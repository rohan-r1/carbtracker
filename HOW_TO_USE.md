# How to Use CarbTracker - Quick Reference

## Testing a Meal Photo (Day 1)

### Step 1: Get a meal photo ready
- Take a photo of your meal with your phone
- Transfer it to your computer
- Put it in the `meal_photos` folder

### Step 2: Run the analysis
Open Command Prompt or Terminal and run:

```bash
python scripts/test_carb_estimate.py meal_photos/your_photo.jpg
```

Replace `your_photo.jpg` with your actual photo filename.

### Step 3: View results
- Results will print on screen
- Also saved to `results/` folder with timestamp
- Compare the estimate to your actual carb count

---

## Folder Structure

```
carbtracker/
├── .env                    # Your API key (KEEP SECRET!)
├── claude.md               # Project overview and strategy
├── readme.txt              # Original conversation notes
├── HOW_TO_USE.md          # This file
│
├── scripts/
│   └── test_carb_estimate.py   # Main test script
│
├── meal_photos/            # Put your meal photos here
│
├── results/                # Analysis results saved here
│
└── tests/                  # Future: accuracy tracking
```

---

## Example Workflow

1. **Before you eat:** Take a photo of your meal
2. **Transfer photo** to `meal_photos/breakfast.jpg`
3. **Run analysis:**
   ```
   python scripts/test_carb_estimate.py meal_photos/breakfast.jpg
   ```
4. **Review estimate:** Read the carb count and confidence level
5. **Make your decision:** Use the estimate (with your judgment) or override
6. **Track accuracy:** Note the estimate vs. what you actually counted

---

## Troubleshooting

**"python is not recognized"**
- Try: `python3` instead of `python`
- Or reinstall Python and check "Add to PATH"

**"ANTHROPIC_API_KEY not found"**
- Check that `.env` file exists
- Open `.env` and verify your API key is there

**"Image file not found"**
- Check the file path is correct
- Use forward slashes: `meal_photos/photo.jpg`
- Or escape backslashes: `meal_photos\\photo.jpg`

**API errors**
- Check your Anthropic account has credits
- Verify API key is correct in `.env`

---

## What Next?

After testing 5-10 meals, we'll:
1. Track accuracy in a spreadsheet
2. Refine the AI prompt
3. Decide if we're ready to build the mobile app

---

**Need help?** Just ask Claude (me!) in the chat.
