from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field


class QuickTapOption(BaseModel):
    label: str
    carb_adjustment: float


class QuickTapQuestionResponse(BaseModel):
    id: str
    food_id: Optional[str] = None
    question: str
    options: list[QuickTapOption]
    carb_impact: Optional[float] = None


class FoodAlternative(BaseModel):
    name: str
    confidence: float
    carbs: float


class FoodItemResponse(BaseModel):
    id: str
    most_likely: FoodAlternative
    alternatives: list[FoodAlternative] = []
    portion: Optional[str] = None


class PreliminaryEstimate(BaseModel):
    min: float
    max: float
    likely: float


class AnalysisResponse(BaseModel):
    analysis_id: str
    foods: list[FoodItemResponse]
    quick_tap_questions: Optional[list[QuickTapQuestionResponse]] = None
    preliminary_estimate: PreliminaryEstimate


class FoodConfirmation(BaseModel):
    food_id: str
    selected_name: str


class QuickTapAnswer(BaseModel):
    question_id: str
    answer: str


class FinalEstimateRequest(BaseModel):
    analysis_id: str
    food_confirmations: list[FoodConfirmation] = []
    quick_tap_answers: list[QuickTapAnswer] = []
    manual_adjustment: Optional[float] = None


class FoodBreakdown(BaseModel):
    name: str
    carbs: float
    portion: Optional[str] = None


class FinalEstimateResponse(BaseModel):
    analysis_id: str
    total_carbs: float
    breakdown: list[FoodBreakdown]
    confidence_level: str  # High, Medium, Low


class MealLogRequest(BaseModel):
    analysis_id: str
    final_carbs: float


class MealResponse(BaseModel):
    id: str
    photo_url: Optional[str] = None
    description: Optional[str] = None
    carbs_logged: Optional[float] = None
    created_at: datetime

    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() + 'Z' if v else None
        }
