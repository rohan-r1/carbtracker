"""
Tests to reproduce two critical bugs in the CarbTracker API

Bug 1: Meal descriptions are null instead of auto-generated from food names
Bug 2: Timestamps missing UTC 'Z' suffix
"""

import pytest
from unittest.mock import patch
from io import BytesIO


class TestMealDescriptionBug:
    """
    Bug 1: Meal descriptions should be auto-generated from confirmed food items

    Expected: description = "Waffles, Berries, Maple syrup"
    Actual: description = null

    The bug occurs when logging a meal WITHOUT calling /finalize first.
    The /log endpoint doesn't generate the description - only /finalize does.
    """

    @pytest.mark.asyncio
    async def test_meal_description_is_auto_generated_from_foods(
        self,
        client,
        mock_claude_vision,
        mock_r2_upload,
        sample_image_bytes
    ):
        """
        Test that meal description is auto-generated from food names after finalization

        This tests the WORKING path: analyze -> finalize -> log
        """
        # Step 1: Analyze a meal
        with patch('app.routers.analysis.analyze_meal_image', mock_claude_vision), \
             patch('app.routers.analysis.upload_image', mock_r2_upload), \
             patch('app.routers.analysis.is_r2_configured', return_value=True):

            response = client.post(
                "/api/v1/analyze",
                files={"image": ("test.png", sample_image_bytes, "image/png")},
            )

            assert response.status_code == 200
            analysis_data = response.json()
            analysis_id = analysis_data["analysis_id"]
            foods = analysis_data["foods"]

            assert len(foods) == 3  # Waffles, Berries, Maple syrup
            food_names = [f["most_likely"]["name"] for f in foods]
            assert food_names == ["Waffles", "Berries", "Maple syrup"]

        # Step 2: Finalize the estimate with food confirmations
        food_confirmations = [
            {
                "food_id": foods[0]["id"],
                "selected_name": "Waffles"  # Confirm the most likely option
            },
            {
                "food_id": foods[1]["id"],
                "selected_name": "Berries"
            },
            {
                "food_id": foods[2]["id"],
                "selected_name": "Maple syrup"
            }
        ]

        response = client.post(
            f"/api/v1/analyze/{analysis_id}/finalize",
            json={
                "analysis_id": analysis_id,
                "food_confirmations": food_confirmations,
                "quick_tap_answers": [],
                "manual_adjustment": None
            }
        )

        assert response.status_code == 200
        final_data = response.json()
        assert final_data["total_carbs"] == 86.0  # 45 + 15 + 26

        # Step 3: Log the meal
        response = client.post(
            "/api/v1/meals/log",
            json={
                "analysis_id": analysis_id,
                "final_carbs": 86.0
            }
        )

        assert response.status_code == 200
        meal_data = response.json()

        # Description should be auto-generated from food names
        assert meal_data["description"] is not None, \
            "Bug: Meal description is null instead of auto-generated"

        # Description should contain the food names
        assert "Waffles" in meal_data["description"], \
            f"Expected 'Waffles' in description, got: {meal_data['description']}"
        assert "Berries" in meal_data["description"], \
            f"Expected 'Berries' in description, got: {meal_data['description']}"
        assert "Maple syrup" in meal_data["description"], \
            f"Expected 'Maple syrup' in description, got: {meal_data['description']}"

    @pytest.mark.asyncio
    async def test_meal_description_null_when_logging_without_finalize(
        self,
        client,
        mock_claude_vision,
        mock_r2_upload,
        sample_image_bytes
    ):
        """
        BUG REPRODUCTION: When logging a meal without calling /finalize first,
        the description is null because only /finalize generates the description.

        This is the actual bug - /log should also generate description if it's null.
        """
        # Step 1: Analyze a meal
        with patch('app.routers.analysis.analyze_meal_image', mock_claude_vision), \
             patch('app.routers.analysis.upload_image', mock_r2_upload), \
             patch('app.routers.analysis.is_r2_configured', return_value=True):

            response = client.post(
                "/api/v1/analyze",
                files={"image": ("test.png", sample_image_bytes, "image/png")},
            )

            assert response.status_code == 200
            analysis_data = response.json()
            analysis_id = analysis_data["analysis_id"]

        # Step 2: Skip /finalize and log directly
        # (User might adjust carbs manually in UI without confirming foods)
        response = client.post(
            "/api/v1/meals/log",
            json={
                "analysis_id": analysis_id,
                "final_carbs": 90.0  # User manually adjusted
            }
        )

        assert response.status_code == 200
        meal_data = response.json()

        print(f"\nMeal data when logging without finalize: {meal_data}")

        # BUG 1: Description should be auto-generated but it's null
        # The /log endpoint should generate description from food items if it's null
        assert meal_data["description"] is not None, \
            "BUG: Meal description is null when logging without calling /finalize. " \
            "The /log endpoint should auto-generate description from confirmed foods."

        assert "Waffles" in meal_data["description"], \
            f"BUG: Description should contain food names. Got: {meal_data['description']}"


class TestTimestampZSuffixBug:
    """
    Bug 2: Timestamps should end with 'Z' to indicate UTC

    Expected: "2026-02-01T20:25:33.949176Z"
    Actual: "2026-02-01T20:25:33.949176"

    Without the 'Z', frontend interprets timestamp as local time instead of UTC,
    causing incorrect relative time displays like "-480 minutes ago"
    """

    @pytest.mark.asyncio
    async def test_meal_created_at_has_utc_z_suffix(
        self,
        client,
        mock_claude_vision,
        mock_r2_upload,
        sample_image_bytes
    ):
        """
        Test that meal created_at timestamp ends with 'Z' suffix
        """
        # Step 1: Analyze a meal
        with patch('app.routers.analysis.analyze_meal_image', mock_claude_vision), \
             patch('app.routers.analysis.upload_image', mock_r2_upload), \
             patch('app.routers.analysis.is_r2_configured', return_value=True):

            response = client.post(
                "/api/v1/analyze",
                files={"image": ("test.png", sample_image_bytes, "image/png")},
            )

            assert response.status_code == 200
            analysis_data = response.json()
            analysis_id = analysis_data["analysis_id"]
            foods = analysis_data["foods"]

        # Step 2: Finalize the estimate
        food_confirmations = [
            {"food_id": f["id"], "selected_name": f["most_likely"]["name"]}
            for f in foods
        ]

        response = client.post(
            f"/api/v1/analyze/{analysis_id}/finalize",
            json={
                "analysis_id": analysis_id,
                "food_confirmations": food_confirmations,
                "quick_tap_answers": [],
                "manual_adjustment": None
            }
        )

        assert response.status_code == 200

        # Step 3: Log the meal
        response = client.post(
            "/api/v1/meals/log",
            json={
                "analysis_id": analysis_id,
                "final_carbs": 86.0
            }
        )

        assert response.status_code == 200
        meal_data = response.json()

        # BUG 2: This assertion should PASS but currently FAILS
        # Timestamp should end with 'Z' to indicate UTC
        assert meal_data["created_at"].endswith("Z"), \
            f"Bug: Timestamp missing UTC 'Z' suffix. Got: {meal_data['created_at']}"

        # Additional validation: timestamp should be valid ISO 8601 with Z
        assert "T" in meal_data["created_at"], \
            "Timestamp should be in ISO 8601 format"

    @pytest.mark.asyncio
    async def test_meal_list_timestamps_have_utc_z_suffix(
        self,
        client,
        mock_claude_vision,
        mock_r2_upload,
        sample_image_bytes
    ):
        """
        Test that timestamps in meal list endpoint also have 'Z' suffix
        """
        # Create and log a meal
        with patch('app.routers.analysis.analyze_meal_image', mock_claude_vision), \
             patch('app.routers.analysis.upload_image', mock_r2_upload), \
             patch('app.routers.analysis.is_r2_configured', return_value=True):

            response = client.post(
                "/api/v1/analyze",
                files={"image": ("test.png", sample_image_bytes, "image/png")},
            )
            analysis_data = response.json()
            analysis_id = analysis_data["analysis_id"]
            foods = analysis_data["foods"]

        # Finalize
        food_confirmations = [
            {"food_id": f["id"], "selected_name": f["most_likely"]["name"]}
            for f in foods
        ]
        client.post(
            f"/api/v1/analyze/{analysis_id}/finalize",
            json={
                "analysis_id": analysis_id,
                "food_confirmations": food_confirmations,
                "quick_tap_answers": [],
            }
        )

        # Log the meal
        client.post(
            "/api/v1/meals/log",
            json={"analysis_id": analysis_id, "final_carbs": 86.0}
        )

        # Get meal list
        response = client.get("/api/v1/meals")
        assert response.status_code == 200
        meals = response.json()

        assert len(meals) > 0, "Should have at least one logged meal"

        for meal in meals:
            # BUG 2: This assertion should PASS but currently FAILS
            assert meal["created_at"].endswith("Z"), \
                f"Bug: Meal list timestamp missing UTC 'Z' suffix. Got: {meal['created_at']}"


class TestBothBugsTogether:
    """
    Combined test that checks both bugs in a single workflow
    """

    @pytest.mark.asyncio
    async def test_complete_meal_logging_workflow(
        self,
        client,
        mock_claude_vision,
        mock_r2_upload,
        sample_image_bytes
    ):
        """
        Test complete workflow from analysis to logging, checking both bugs
        """
        # Analyze
        with patch('app.routers.analysis.analyze_meal_image', mock_claude_vision), \
             patch('app.routers.analysis.upload_image', mock_r2_upload), \
             patch('app.routers.analysis.is_r2_configured', return_value=True):

            response = client.post(
                "/api/v1/analyze",
                files={"image": ("test.png", sample_image_bytes, "image/png")},
            )
            analysis_data = response.json()
            analysis_id = analysis_data["analysis_id"]
            foods = analysis_data["foods"]

        # Finalize with confirmations
        food_confirmations = [
            {"food_id": f["id"], "selected_name": f["most_likely"]["name"]}
            for f in foods
        ]
        client.post(
            f"/api/v1/analyze/{analysis_id}/finalize",
            json={
                "analysis_id": analysis_id,
                "food_confirmations": food_confirmations,
                "quick_tap_answers": [],
            }
        )

        # Log the meal
        response = client.post(
            "/api/v1/meals/log",
            json={"analysis_id": analysis_id, "final_carbs": 86.0}
        )

        assert response.status_code == 200
        meal_data = response.json()

        # Check both bugs
        print(f"\nMeal data: {meal_data}")

        # Bug 1: Description should be auto-generated
        assert meal_data["description"] is not None, \
            "BUG 1: Meal description is null"
        assert "Waffles" in meal_data["description"], \
            f"BUG 1: Description missing food names. Got: {meal_data['description']}"

        # Bug 2: Timestamp should have 'Z' suffix
        assert meal_data["created_at"].endswith("Z"), \
            f"BUG 2: Timestamp missing 'Z' suffix. Got: {meal_data['created_at']}"
