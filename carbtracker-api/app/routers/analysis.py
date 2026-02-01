"""
Analysis Router for CarbTracker API
Handles meal photo analysis and carb estimation
"""

import uuid
from typing import Optional

from fastapi import APIRouter, File, Form, UploadFile, HTTPException, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.meal import Meal, Analysis, FoodItem, QuickTapQuestion
from app.schemas.analysis import (
    AnalysisResponse,
    FoodItemResponse,
    FoodAlternative,
    PreliminaryEstimate,
    QuickTapQuestionResponse,
    QuickTapOption,
    FinalEstimateRequest,
    FinalEstimateResponse,
    FoodBreakdown,
)
from app.services.claude_vision import analyze_meal_image
from app.services.quick_tap_engine import (
    generate_quick_tap_questions,
    calculate_adjusted_carbs,
)
from app.services.r2_storage import upload_image, is_r2_configured

router = APIRouter()


@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_meal(
    image: UploadFile = File(...),
    description: Optional[str] = Form(None),
    db: Session = Depends(get_db),
):
    """
    Analyze a meal photo and return carb estimates with food identification

    - **image**: Meal photo (JPEG, PNG, WebP)
    - **description**: Optional text description of the meal (helps with soups, curries, etc.)
    """
    # Validate file type
    if not image.content_type or not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    # Read image bytes
    image_bytes = await image.read()

    if len(image_bytes) == 0:
        raise HTTPException(status_code=400, detail="Empty image file")

    # Upload to R2 if configured
    photo_url = None
    if is_r2_configured():
        try:
            photo_url = await upload_image(
                image_bytes,
                content_type=image.content_type,
                filename=image.filename,
            )
        except Exception:
            # Continue without storage - photo_url will be None
            pass

    # Create meal record
    meal = Meal(
        photo_url=photo_url,
        description=description,
    )
    db.add(meal)
    db.flush()

    # Analyze with Claude Vision
    try:
        ai_result = await analyze_meal_image(
            image_bytes,
            content_type=image.content_type,
            filename=image.filename,
            description=description,
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"AI analysis failed: {str(e)}")

    # Check if food was detected
    food_detected = ai_result.get("food_detected", True)  # Default to True for backwards compatibility
    if not food_detected:
        db.rollback()
        no_food_reason = ai_result.get("no_food_reason", "No food was clearly identified in the photo")
        raise HTTPException(
            status_code=422,  # Unprocessable Entity
            detail={
                "error": "no_food_detected",
                "message": "We couldn't identify any food in this photo. Please take another photo with your meal clearly visible.",
                "reason": no_food_reason
            }
        )

    # Extract preliminary estimate
    prelim = ai_result.get("preliminary_estimate", {})
    preliminary_estimate = PreliminaryEstimate(
        min=prelim.get("min", 0),
        max=prelim.get("max", 0),
        likely=prelim.get("likely", 0),
    )

    # Create analysis record
    analysis = Analysis(
        meal_id=meal.id,
        raw_ai_response=ai_result.get("_raw_response", ""),
        preliminary_estimate_min=preliminary_estimate.min,
        preliminary_estimate_max=preliminary_estimate.max,
        preliminary_estimate_likely=preliminary_estimate.likely,
    )
    db.add(analysis)
    db.flush()

    # Process foods and create records
    foods_response = []
    ai_foods = ai_result.get("foods", [])

    for ai_food in ai_foods:
        most_likely = ai_food.get("most_likely", {})

        # Create primary food item
        food_item = FoodItem(
            analysis_id=analysis.id,
            name=most_likely.get("name", "Unknown"),
            portion=most_likely.get("portion"),
            carbs=most_likely.get("carbs", 0),
            confidence=most_likely.get("confidence", 50),
            is_selected=1,
        )
        db.add(food_item)
        db.flush()

        # Create alternatives
        alternatives_response = []
        for alt in ai_food.get("alternatives", []):
            alt_item = FoodItem(
                analysis_id=analysis.id,
                name=alt.get("name", ""),
                carbs=alt.get("carbs", 0),
                confidence=alt.get("confidence", 0),
                is_selected=0,
                parent_food_id=food_item.id,
            )
            db.add(alt_item)

            alternatives_response.append(
                FoodAlternative(
                    name=alt.get("name", ""),
                    confidence=alt.get("confidence", 0),
                    carbs=alt.get("carbs", 0),
                )
            )

        foods_response.append(
            FoodItemResponse(
                id=str(food_item.id),
                most_likely=FoodAlternative(
                    name=most_likely.get("name", "Unknown"),
                    confidence=most_likely.get("confidence", 50),
                    carbs=most_likely.get("carbs", 0),
                ),
                alternatives=alternatives_response,
                portion=most_likely.get("portion"),
            )
        )

    # Generate quick-tap questions
    ai_uncertainties = ai_result.get("uncertainties", [])
    quick_tap_questions = generate_quick_tap_questions(
        foods=ai_foods,
        uncertainties=ai_uncertainties,
    )

    # Store questions in database
    questions_response = []
    for qt in quick_tap_questions:
        qt_record = QuickTapQuestion(
            analysis_id=analysis.id,
            food_item_id=qt.food_id if qt.food_id else None,
            question=qt.question,
            options=[{"label": o.label, "carb_adjustment": o.carb_adjustment} for o in qt.options],
            carb_impact=qt.carb_impact,
        )
        db.add(qt_record)
        db.flush()

        questions_response.append(
            QuickTapQuestionResponse(
                id=str(qt_record.id),
                food_id=qt.food_id,
                question=qt.question,
                options=qt.options,
                carb_impact=qt.carb_impact,
            )
        )

    db.commit()

    return AnalysisResponse(
        analysis_id=str(analysis.id),
        foods=foods_response,
        quick_tap_questions=questions_response if questions_response else None,
        preliminary_estimate=preliminary_estimate,
    )


@router.post("/analyze/{analysis_id}/finalize", response_model=FinalEstimateResponse)
async def finalize_estimate(
    analysis_id: str,
    request: FinalEstimateRequest,
    db: Session = Depends(get_db),
):
    """
    Finalize carb estimate after user confirmations and quick-tap answers

    - **analysis_id**: ID from the initial analysis
    - **food_confirmations**: Which foods the user confirmed/selected
    - **quick_tap_answers**: Answers to quick-tap questions
    - **manual_adjustment**: Optional manual carb adjustment
    """
    # Get analysis
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")

    # Get food items
    food_items = db.query(FoodItem).filter(
        FoodItem.analysis_id == analysis_id,
        FoodItem.is_selected == 1,
    ).all()

    # Process food confirmations - update selected foods
    for confirmation in request.food_confirmations:
        food_id = confirmation.food_id

        # Find the confirmed food and any alternatives
        confirmed_food = db.query(FoodItem).filter(FoodItem.id == food_id).first()
        if not confirmed_food:
            continue

        # Check if user selected an alternative
        if confirmation.selected_name != confirmed_food.name:
            # Find the alternative with this name
            alternatives = db.query(FoodItem).filter(
                FoodItem.parent_food_id == food_id,
                FoodItem.name == confirmation.selected_name,
            ).all()

            if alternatives:
                # Deselect the original, select the alternative
                confirmed_food.is_selected = 0
                alternatives[0].is_selected = 1

    db.flush()

    # Recalculate with updated selections
    selected_foods = db.query(FoodItem).filter(
        FoodItem.analysis_id == analysis_id,
        FoodItem.is_selected == 1,
    ).all()

    # Calculate base carbs from selected foods
    base_carbs = sum(f.carbs for f in selected_foods)

    # Get quick-tap questions for adjustment calculation
    questions = db.query(QuickTapQuestion).filter(
        QuickTapQuestion.analysis_id == analysis_id
    ).all()

    # Convert to response format for calculation
    qt_responses = [
        QuickTapQuestionResponse(
            id=str(q.id),
            food_id=str(q.food_item_id) if q.food_item_id else None,
            question=q.question,
            options=[QuickTapOption(**opt) for opt in q.options],
            carb_impact=q.carb_impact,
        )
        for q in questions
    ]

    # Calculate adjusted carbs
    adjusted_carbs = calculate_adjusted_carbs(
        base_carbs=base_carbs,
        quick_tap_answers=[
            {"question_id": a.question_id, "answer": a.answer}
            for a in request.quick_tap_answers
        ],
        questions=qt_responses,
    )

    # Apply manual adjustment if provided
    if request.manual_adjustment is not None:
        adjusted_carbs += request.manual_adjustment

    # Update analysis with final estimate
    analysis.final_estimate = adjusted_carbs

    # Store quick-tap answers
    for answer in request.quick_tap_answers:
        question = db.query(QuickTapQuestion).filter(QuickTapQuestion.id == answer.question_id).first()
        if question:
            question.answer = answer.answer

    db.commit()

    # Build breakdown
    breakdown = [
        FoodBreakdown(
            name=f.name,
            carbs=f.carbs,
            portion=f.portion,
        )
        for f in selected_foods
    ]

    # Determine confidence level
    avg_confidence = sum(f.confidence or 50 for f in selected_foods) / len(selected_foods) if selected_foods else 50
    if avg_confidence >= 85:
        confidence_level = "High"
    elif avg_confidence >= 60:
        confidence_level = "Medium"
    else:
        confidence_level = "Low"

    return FinalEstimateResponse(
        analysis_id=analysis_id,
        total_carbs=adjusted_carbs,
        breakdown=breakdown,
        confidence_level=confidence_level,
    )
