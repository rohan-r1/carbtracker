# CarbTracker API Tests

## Bug Reproduction Tests

This directory contains test files for reproducing bugs in the CarbTracker API.

### Test Files

- `test_meal_bugs.py` - Tests that reproduce two critical bugs in meal logging

### Running the Tests

```bash
# Activate virtual environment
. venv/Scripts/activate

# Run all bug reproduction tests
pytest tests/test_meal_bugs.py -v

# Run a specific test
pytest tests/test_meal_bugs.py::TestMealDescriptionBug::test_meal_description_null_when_logging_without_finalize -v

# Run with output to see test data
pytest tests/test_meal_bugs.py -v -s
```

### Bug Status

#### Bug 1: Meal Descriptions Null When Logging Without Finalize
**Status**: REPRODUCED ✓

**Failing Test**: `test_meal_description_null_when_logging_without_finalize`

**Expected Behavior**:
- When a meal is logged after analysis, the description should be auto-generated from confirmed food items
- Example: If foods are ["Waffles", "Berries", "Maple syrup"], description should be "Waffles, Berries, Maple syrup"

**Actual Behavior**:
- Description is `null` when logging without calling `/finalize` first
- Description is only generated in the `/finalize` endpoint, not `/log`

**Reproduction Steps**:
1. POST `/api/v1/analyze` with a meal image
2. Skip the `/finalize` endpoint
3. POST `/api/v1/meals/log` with analysis_id and final_carbs
4. Response has `description: null`

**Passing Workflow** (works correctly):
1. POST `/api/v1/analyze` with a meal image
2. POST `/api/v1/analyze/{id}/finalize` with food confirmations
3. POST `/api/v1/meals/log` with analysis_id and final_carbs
4. Response has properly generated description

**Fix Needed**:
- The `/log` endpoint should generate description from food items if meal.description is null
- OR frontend should always call `/finalize` before `/log`

---

#### Bug 2: Timestamps Missing UTC 'Z' Suffix
**Status**: NOT REPRODUCED (Already Fixed) ✓

**Test Status**: All timestamp tests PASS

**Expected Behavior**:
- API should return: `"2026-02-01T20:25:33.949176Z"` (with 'Z' suffix)

**Current Behavior**:
- API correctly returns timestamps with 'Z' suffix
- Example: `"2026-02-01T20:34:03.389536Z"`

**Note**:
- The `json_encoders` in `MealResponse` (schemas/analysis.py) adds the 'Z' suffix
- However, `json_encoders` is deprecated in Pydantic v2
- While currently working, this should be migrated to Pydantic v2 `model_serializer` or `field_serializer`
- See Pydantic v2 migration guide: https://docs.pydantic.dev/2.12/concepts/serialization/

---

### Test Coverage

The test file includes:

1. **TestMealDescriptionBug** - Tests for description auto-generation
   - `test_meal_description_is_auto_generated_from_foods` - Tests working path (PASSES)
   - `test_meal_description_null_when_logging_without_finalize` - Reproduces bug (FAILS)

2. **TestTimestampZSuffixBug** - Tests for UTC timestamp format
   - `test_meal_created_at_has_utc_z_suffix` - Tests /log endpoint (PASSES)
   - `test_meal_list_timestamps_have_utc_z_suffix` - Tests /meals endpoint (PASSES)

3. **TestBothBugsTogether** - Combined workflow test
   - `test_complete_meal_logging_workflow` - Tests full flow (PASSES)

### Test Fixtures

Defined in `conftest.py`:

- `test_engine` - Creates an in-memory SQLite database engine
- `test_session` - Provides a database session for tests
- `client` - FastAPI TestClient with test database
- `mock_claude_vision` - Mocks Claude Vision API responses
- `mock_r2_upload` - Mocks R2 storage upload
- `sample_image_bytes` - Creates a minimal valid PNG image

### Dependencies

Tests require:
- pytest
- pytest-asyncio
- httpx
- Pillow (for image generation)
- All app dependencies

See `requirements.txt` for full list.
