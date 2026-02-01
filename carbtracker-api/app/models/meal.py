import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, JSON, Integer, Text
from sqlalchemy.orm import relationship

from app.database import Base


def generate_uuid():
    return str(uuid.uuid4())


class Meal(Base):
    __tablename__ = "meals"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    photo_url = Column(String, nullable=True)
    description = Column(String, nullable=True)
    carbs_logged = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    analyses = relationship("Analysis", back_populates="meal", cascade="all, delete-orphan")


class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    meal_id = Column(String(36), ForeignKey("meals.id"), nullable=False)
    raw_ai_response = Column(Text, nullable=True)
    preliminary_estimate_min = Column(Float, nullable=True)
    preliminary_estimate_max = Column(Float, nullable=True)
    preliminary_estimate_likely = Column(Float, nullable=True)
    final_estimate = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    meal = relationship("Meal", back_populates="analyses")
    food_items = relationship("FoodItem", back_populates="analysis", cascade="all, delete-orphan")
    quick_tap_questions = relationship("QuickTapQuestion", back_populates="analysis", cascade="all, delete-orphan")


class FoodItem(Base):
    __tablename__ = "food_items"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    analysis_id = Column(String(36), ForeignKey("analyses.id"), nullable=False)
    name = Column(String, nullable=False)
    portion = Column(String, nullable=True)
    carbs = Column(Float, nullable=False)
    confidence = Column(Float, nullable=True)  # 0-100
    is_selected = Column(Integer, default=1)  # 1 = selected, 0 = alternative
    parent_food_id = Column(String(36), nullable=True)  # For linking alternatives to main food
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    analysis = relationship("Analysis", back_populates="food_items")


class QuickTapQuestion(Base):
    __tablename__ = "quick_tap_questions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    analysis_id = Column(String(36), ForeignKey("analyses.id"), nullable=False)
    food_item_id = Column(String(36), nullable=True)
    question = Column(String, nullable=False)
    options = Column(JSON, nullable=False)  # [{label, carb_adjustment}]
    carb_impact = Column(Float, nullable=True)  # Used for sorting questions
    answer = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    analysis = relationship("Analysis", back_populates="quick_tap_questions")
