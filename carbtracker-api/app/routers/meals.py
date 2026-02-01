"""
Meals Router for CarbTracker API
Handles meal logging and history
"""

from typing import Optional

from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database import get_db
from app.models.meal import Meal, Analysis, FoodItem
from app.schemas.analysis import MealLogRequest, MealResponse

router = APIRouter()


@router.post("/meals/log", response_model=MealResponse)
async def log_meal(
    request: MealLogRequest,
    db: Session = Depends(get_db),
):
    """
    Log a meal with the final carb count

    - **analysis_id**: ID of the analysis to log
    - **final_carbs**: Final carb count (after any manual adjustments)
    """
    # Get the analysis and its meal
    analysis = db.query(Analysis).filter(Analysis.id == request.analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")

    meal = db.query(Meal).filter(Meal.id == analysis.meal_id).first()
    if not meal:
        raise HTTPException(status_code=404, detail="Meal not found")

    # Update the meal with logged carbs
    meal.carbs_logged = request.final_carbs

    # Generate meal description from foods if not already set
    if not meal.description:
        # Query selected food items from the analysis
        selected_foods = (
            db.query(FoodItem)
            .filter(FoodItem.analysis_id == analysis.id)
            .filter(FoodItem.is_selected == 1)
            .all()
        )

        if selected_foods:
            # Create description from selected foods (max 3, then "+N more")
            food_names = [f.name for f in selected_foods]
            description = ", ".join(food_names[:3])  # Take first 3 foods
            if len(food_names) > 3:
                description += f" +{len(food_names) - 3} more"
            meal.description = description

    db.commit()
    db.refresh(meal)

    return MealResponse(
        id=str(meal.id),
        photo_url=meal.photo_url,
        description=meal.description,
        carbs_logged=meal.carbs_logged,
        created_at=meal.created_at,
    )


@router.get("/meals", response_model=list[MealResponse])
async def get_meals(
    limit: int = Query(default=50, le=100),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
):
    """
    Get meal history

    - **limit**: Maximum number of meals to return (max 100)
    - **offset**: Number of meals to skip for pagination
    """
    meals = (
        db.query(Meal)
        .filter(Meal.carbs_logged.isnot(None))  # Only logged meals
        .order_by(desc(Meal.created_at))
        .offset(offset)
        .limit(limit)
        .all()
    )

    return [
        MealResponse(
            id=str(meal.id),
            photo_url=meal.photo_url,
            description=meal.description,
            carbs_logged=meal.carbs_logged,
            created_at=meal.created_at,
        )
        for meal in meals
    ]


@router.get("/meals/{meal_id}", response_model=MealResponse)
async def get_meal(
    meal_id: str,
    db: Session = Depends(get_db),
):
    """
    Get a specific meal by ID
    """
    meal = db.query(Meal).filter(Meal.id == meal_id).first()
    if not meal:
        raise HTTPException(status_code=404, detail="Meal not found")

    return MealResponse(
        id=str(meal.id),
        photo_url=meal.photo_url,
        description=meal.description,
        carbs_logged=meal.carbs_logged,
        created_at=meal.created_at,
    )


@router.put("/meals/{meal_id}", response_model=MealResponse)
async def update_meal(
    meal_id: str,
    carbs_logged: Optional[float] = None,
    description: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """
    Update a meal's logged carbs or description
    """
    meal = db.query(Meal).filter(Meal.id == meal_id).first()
    if not meal:
        raise HTTPException(status_code=404, detail="Meal not found")

    if carbs_logged is not None:
        meal.carbs_logged = carbs_logged
    if description is not None:
        meal.description = description

    db.commit()
    db.refresh(meal)

    return MealResponse(
        id=str(meal.id),
        photo_url=meal.photo_url,
        description=meal.description,
        carbs_logged=meal.carbs_logged,
        created_at=meal.created_at,
    )


@router.delete("/meals/{meal_id}")
async def delete_meal(
    meal_id: str,
    db: Session = Depends(get_db),
):
    """
    Delete a meal and its associated analyses
    """
    meal = db.query(Meal).filter(Meal.id == meal_id).first()
    if not meal:
        raise HTTPException(status_code=404, detail="Meal not found")

    db.delete(meal)
    db.commit()

    return {"message": "Meal deleted successfully"}
