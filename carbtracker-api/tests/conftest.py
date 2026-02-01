"""
Test configuration and fixtures for CarbTracker API tests
"""

import os
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool
from unittest.mock import AsyncMock, MagicMock

from app.main import app
from app.database import Base, get_db
from app.config import get_settings, Settings
# Import models to register them with Base.metadata
from app.models.meal import Meal, Analysis, FoodItem, QuickTapQuestion


# Use in-memory SQLite for tests with StaticPool to keep it alive
TEST_DATABASE_URL = "sqlite://"


@pytest.fixture(scope="function")
def test_db():
    """
    Create a fresh test database for each test
    """
    # Create engine with StaticPool to keep the in-memory database alive
    engine = create_engine(
        TEST_DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )

    # Create all tables
    Base.metadata.create_all(bind=engine)

    # Create session
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = TestingSessionLocal()

    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)
        engine.dispose()


@pytest.fixture(scope="function")
def client(test_db):
    """
    Create a test client with test database
    """
    def override_get_db():
        try:
            yield test_db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()


@pytest.fixture
def mock_claude_vision():
    """
    Mock Claude Vision API responses
    """
    async def mock_analyze(image_bytes, content_type, filename, description=None):
        return {
            "food_detected": True,
            "foods": [
                {
                    "most_likely": {
                        "name": "Waffles",
                        "portion": "2 medium waffles",
                        "carbs": 45.0,
                        "confidence": 85.0
                    },
                    "alternatives": [
                        {
                            "name": "Pancakes",
                            "carbs": 42.0,
                            "confidence": 70.0
                        }
                    ]
                },
                {
                    "most_likely": {
                        "name": "Berries",
                        "portion": "1/2 cup",
                        "carbs": 15.0,
                        "confidence": 90.0
                    },
                    "alternatives": []
                },
                {
                    "most_likely": {
                        "name": "Maple syrup",
                        "portion": "2 tablespoons",
                        "carbs": 26.0,
                        "confidence": 80.0
                    },
                    "alternatives": []
                }
            ],
            "preliminary_estimate": {
                "min": 75.0,
                "max": 95.0,
                "likely": 86.0
            },
            "uncertainties": [],
            "_raw_response": "Mock AI response"
        }

    return mock_analyze


@pytest.fixture
def mock_r2_upload():
    """
    Mock R2 storage upload
    """
    async def mock_upload(image_bytes, content_type, filename):
        return f"https://test-bucket.r2.dev/{filename}"

    return mock_upload


@pytest.fixture
def sample_image_bytes():
    """
    Create a minimal valid image for testing
    """
    # Create a minimal 1x1 PNG
    import io
    from PIL import Image

    img = Image.new('RGB', (1, 1), color='red')
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='PNG')
    img_bytes.seek(0)

    return img_bytes.getvalue()
