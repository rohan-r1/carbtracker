# Week 1 Testing Guide

## Goal
Test 15-20 meals to understand AI accuracy patterns and validate the confirmation step approach.

## Your Daily Process (2-3 photos per day)

### Before/During Your Meal

1. **Take the photo**
   - Clear, well-lit photo
   - Include the whole meal/snack
   - Try to get a straight-on angle
   - Include a reference object occasionally (fork, plate, your hand)

2. **Note your carb estimate**
   - Use your usual method (package labels, mental math, app)
   - Write it down immediately
   - Note which items you're most/least confident about

3. **Save the photo**
   - Transfer to `meal_photos/` folder
   - Name it descriptively: `breakfast_jan22.jpg`, `lunch_sandwich.jpg`, etc.

### Running the Test

**Use the V2 script** (shows multiple possibilities):

```bash
python scripts/test_carb_estimate_v2.py meal_photos/your_photo.jpg
```

### After Each Test

1. **Compare results** - Look at AI estimate vs. your estimate
2. **Note patterns** - Which foods were accurate? Which weren't?
3. **Update tracking** - I'll help you add results to the CSV

---

## What We're Learning

For each test, we want to know:

### Food Identification
- ✓ Did it identify foods correctly?
- ✗ What did it confuse? (like Madeleine → Twinkie)
- Did it offer alternatives for ambiguous items?

### Carb Accuracy
- How close was total estimate? (within ±10g is good)
- Which items were accurate?
- Which items were way off?

### Confidence Calibration
- When AI says "High confidence" - is it actually accurate?
- When AI says "Low confidence" - is it being appropriately cautious?

### Meal Categories to Test
Try to get variety across:
- ✅ Simple fruits (banana, apple, orange) - expect high accuracy
- ✅ Packaged foods with labels visible
- ✅ Home-cooked meals (rice, pasta, chicken, veggies)
- ✅ Sandwiches and bread items
- ✅ Restaurant meals
- ✅ Mixed dishes (casseroles, stir-fry, salads)
- ✅ Baked goods (muffins, pastries, cookies)
- ✅ Beverages (juice, smoothies, milk)

---

## Success Criteria for Week 1

By end of week, we should know:

**Accuracy Benchmarks:**
- [ ] What's the average accuracy across all tests?
- [ ] Which food categories hit ±10g accuracy?
- [ ] Which categories need the confirmation step?

**Confirmation Step Validation:**
- [ ] When AI offers alternatives, is the right answer usually there?
- [ ] How often is the "most likely" guess correct?
- [ ] Are 2-3 alternatives enough, or do we need more options?

**User Experience:**
- [ ] Is 3-5 second analysis time acceptable?
- [ ] Are results clear enough to make dosing decisions?
- [ ] What additional info would be helpful?

---

## Test Results So Far

### Test #1 - After Dinner Snack (Jan 21)
- **Foods:** Banana + Madeleine
- **AI Identified:** Banana ✓ + Twinkie ✗
- **Accuracy:**
  - Banana: Within 5g (excellent)
  - Madeleine: +12-15g error (misidentified)
  - Total: +7-14g error (16-33% off)
- **Learning:** Need confirmation for similar-looking pastries
- **Status:** V2 script created to address this

### Test #2 - [Your next meal]
- To be filled in...

---

## Quick Commands Reference

**Run V2 test (recommended):**
```bash
python scripts/test_carb_estimate_v2.py meal_photos/photo.jpg
```

**Run original test (for comparison):**
```bash
python scripts/test_carb_estimate.py meal_photos/photo.jpg
```

**View all results:**
```bash
ls results/
```

**Check tracking spreadsheet:**
Open `tests/accuracy_tracking.csv` in Excel or Notepad

---

## When to Share Results with Me

**Daily:** Just run tests on your own, take notes

**Every 2-3 days:** Share with me:
- Which photos you tested
- Overall accuracy trends you're seeing
- Any foods that consistently fail
- Questions or concerns

**End of Week 1:** We'll review together:
- Complete accuracy analysis
- Decision: Proceed to mobile app or iterate more?
- Finalize confirmation step UX design

---

## Tips for Better Results

**Good photo practices:**
- Natural or bright lighting (not dim)
- Avoid shadows covering food
- Show full portions (not cut off)
- Steady shot (not blurry)

**Helpful additions:**
- Include fork/spoon for scale
- Show package labels when available
- Multiple angles for complex dishes

**Track extra context:**
- Restaurant name (if applicable)
- Homemade vs. packaged
- Foods you were unsure about yourself

---

## Cost Tracking

**Each test costs:** ~$0.01-0.02

**Target 15-20 tests:** ~$0.15-0.40 total

**Well within budget** for valuable learning.

---

Ready to test! Take photos of your next 2-3 meals and run them through the V2 script. Let me know if you hit any issues or see interesting patterns.
