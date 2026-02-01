# Quick Start: Bug Reproduction Tests

## TL;DR

```bash
cd carbtracker-api
. venv/Scripts/activate
pytest tests/test_meal_bugs.py -v
```

**Expected Result**: 1 test FAILS (Bug 1 reproduced), 4 tests PASS

---

## What These Tests Do

These tests reproduce two bugs reported in the CarbTracker API:

1. **Bug 1: Meal descriptions are null** ❌ REPRODUCED
   - When you log a meal without calling `/finalize`, description is null
   - Test: `test_meal_description_null_when_logging_without_finalize` FAILS

2. **Bug 2: Timestamps missing 'Z' suffix** ✅ Already Fixed
   - Timestamps correctly have 'Z' suffix for UTC
   - Tests: All timestamp tests PASS

---

## Running Tests

### See All Tests
```bash
pytest tests/test_meal_bugs.py -v
```

Output:
```
test_meal_description_is_auto_generated_from_foods PASSED ✓
test_meal_description_null_when_logging_without_finalize FAILED ✗  ← Bug 1
test_meal_created_at_has_utc_z_suffix PASSED ✓
test_meal_list_timestamps_have_utc_z_suffix PASSED ✓
test_complete_meal_logging_workflow PASSED ✓

1 failed, 4 passed
```

### See Test Output Data
```bash
pytest tests/test_meal_bugs.py -v -s
```

This shows the actual JSON responses from the API.

### Run Only Bug 1 Test
```bash
pytest tests/test_meal_bugs.py::TestMealDescriptionBug -v
```

### Run Only Bug 2 Tests
```bash
pytest tests/test_meal_bugs.py::TestTimestampZSuffixBug -v
```

---

## Understanding Test Results

### Bug 1: Description Null (FAILS ✗ - This is expected!)

```bash
pytest tests/test_meal_bugs.py::TestMealDescriptionBug::test_meal_description_null_when_logging_without_finalize -v -s
```

You'll see:
```
Meal data when logging without finalize:
{
  'description': None,  ← This is the bug!
  'carbs_logged': 90.0,
  'created_at': '2026-02-01T20:34:56.369136Z'
}

FAILED - AssertionError: BUG: Meal description is null
```

**This is correct!** The test is SUPPOSED to fail - it proves the bug exists.

### Bug 2: Timestamp Z Suffix (PASSES ✓)

```bash
pytest tests/test_meal_bugs.py::TestTimestampZSuffixBug -v
```

Both tests pass:
- `test_meal_created_at_has_utc_z_suffix` PASSED
- `test_meal_list_timestamps_have_utc_z_suffix` PASSED

This means Bug 2 is already fixed.

---

## What to Do Next

### After Fixing Bug 1

Once you fix the `/meals/log` endpoint to generate descriptions:

```bash
pytest tests/test_meal_bugs.py -v
```

**Expected after fix**: All 5 tests PASS ✓

### If You Want to See the Working Path

```bash
pytest tests/test_meal_bugs.py::TestMealDescriptionBug::test_meal_description_is_auto_generated_from_foods -v -s
```

This test shows that descriptions DO work when you call `/finalize` before `/log`.

---

## Files in This Directory

- `conftest.py` - Test setup and fixtures
- `test_meal_bugs.py` - The actual tests
- `README.md` - Detailed documentation
- `BUG_REPORT.md` - Full bug analysis and recommendations
- `QUICK_START.md` - This file

---

## Troubleshooting

### Tests won't run
```bash
# Make sure you're in the right directory
cd carbtracker-api

# Activate virtual environment
. venv/Scripts/activate

# Check pytest is installed
pytest --version
```

### Import errors
```bash
# Make sure dependencies are installed
pip install -r requirements.txt
```

### Database errors
The tests use an in-memory database, so they shouldn't affect your actual database.
If you see "no such table" errors, the test fixtures might not be loading correctly.

---

## Need More Info?

- See `BUG_REPORT.md` for detailed bug analysis
- See `README.md` for full test documentation
- See `test_meal_bugs.py` for the actual test code
