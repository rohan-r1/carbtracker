# Beta Tester Feedback Form Template

Use this template to create a Google Form for collecting beta tester feedback.

## How to Create the Form

1. Go to [forms.google.com](https://forms.google.com)
2. Click "+ Blank" to create new form
3. Title: "CarbTracker Beta Feedback"
4. Description: "Thank you for testing CarbTracker! Your feedback helps us improve the app."
5. Add the questions below

---

## Google Form Questions

### Section 1: Meal Information

**Question 1: Your Name (Optional)**
- Type: Short answer
- Optional
- Description: "Only if you want us to follow up with you"

**Question 2: Meal Type/Description**
- Type: Short answer
- Required
- Description: "What did you eat? (e.g., 'Banana and peanut butter', 'Chicken curry with rice')"

**Question 3: Meal Photo (Optional)**
- Type: File upload
- Optional
- Accept: Images only
- Max file size: 10 MB
- Description: "Upload your meal photo if you'd like (helps us improve accuracy)"

---

### Section 2: AI Performance

**Question 4: AI Carb Estimate**
- Type: Short answer (number)
- Required
- Validation: Number, 0-500
- Description: "What carb amount did the AI estimate?"

**Question 5: Actual Carbs (If Known)**
- Type: Short answer (number)
- Optional
- Validation: Number, 0-500
- Description: "If you know the actual carb count (from label or database), enter it here"

**Question 6: How accurate was the estimate?**
- Type: Multiple choice
- Required
- Options:
  - Very accurate (within ±5g)
  - Somewhat accurate (within ±10g)
  - Acceptable (within ±20g)
  - Not very accurate (off by 20-50g)
  - Very inaccurate (off by >50g)
  - Don't know actual carbs

**Question 7: Did the AI identify all foods correctly?**
- Type: Multiple choice
- Required
- Options:
  - Yes, all foods identified correctly
  - Mostly correct (1 wrong item)
  - Some correct, some wrong
  - Mostly wrong
  - Completely wrong

**Question 8: If any foods were wrong, what did it miss or misidentify?**
- Type: Long answer
- Optional
- Description: "Example: 'Thought the banana was a plantain' or 'Missed the cheese in my sandwich'"

---

### Section 3: User Experience

**Question 9: How long did the analysis take?**
- Type: Multiple choice
- Required
- Options:
  - Less than 5 seconds (Excellent!)
  - 5-10 seconds (Good)
  - 10-20 seconds (Acceptable)
  - 20-30 seconds (Slow)
  - More than 30 seconds (Too slow)
  - Failed to complete

**Question 10: Did you use the manual adjustment feature?**
- Type: Multiple choice
- Required
- Options:
  - Yes, I adjusted the estimate
  - No, the estimate was good as-is
  - I wanted to, but couldn't figure out how

**Question 11: If you adjusted, by how much?**
- Type: Short answer (number)
- Optional
- Validation: Number, -100 to 100
- Description: "Enter adjustment amount (use negative for decrease, e.g., -5 or +10)"

**Question 12: Did the food confirmation and quick-tap questions help?**
- Type: Multiple choice
- Required
- Options:
  - Yes, very helpful
  - Somewhat helpful
  - Not particularly helpful
  - No questions were asked
  - Found them annoying

---

### Section 4: Overall Feedback

**Question 13: Would you use this app daily for carb tracking?**
- Type: Multiple choice
- Required
- Options:
  - Yes, definitely
  - Yes, probably
  - Maybe (depends on improvements)
  - Probably not
  - No, not useful for me

**Question 14: What worked well?**
- Type: Long answer
- Optional
- Description: "What did you like about the app?"

**Question 15: What needs improvement?**
- Type: Long answer
- Optional
- Description: "What frustrated you or didn't work well?"

**Question 16: Did you encounter any bugs or errors?**
- Type: Long answer
- Optional
- Description: "Describe any crashes, freezes, or error messages. Include when it happened."

**Question 17: Feature requests or suggestions**
- Type: Long answer
- Optional
- Description: "What features would make this app more useful for you?"

---

### Section 5: Contact (Optional)

**Question 18: Email (Optional)**
- Type: Short answer
- Optional
- Validation: Email format
- Description: "Only if you want us to follow up about your feedback"

**Question 19: Are you willing to participate in a quick follow-up interview (15 min)?**
- Type: Multiple choice
- Optional
- Options:
  - Yes, I'd be happy to
  - Maybe, depending on timing
  - No, the form is enough

---

## Form Settings

### General Settings
- Collect email addresses: No (unless you want automatic collection)
- Limit to 1 response: No (testers can submit multiple times)
- Edit after submit: Yes (allow corrections)

### Presentation Settings
- Show progress bar: Yes
- Shuffle question order: No
- Confirmation message:
  ```
  Thank you for your feedback! 🙏

  Your input helps make CarbTracker better for the entire T1D community.

  Please submit a new form for each meal you test.

  Found a critical bug? Email: [your-email@example.com]
  Questions? Discord: [discord-link]
  ```

---

## After Creating the Form

1. **Get the form link:**
   - Click "Send" button in top right
   - Click link icon
   - Copy the shortened URL
   - Example: `https://forms.gle/AbC123`

2. **Update documentation with form link:**
   - BETA_TESTER_QUICK_START.md
   - TESTFLIGHT_SETUP_CHECKLIST.md
   - Email invitation template
   - Discord welcome message

3. **Test the form yourself:**
   - Fill it out with a test meal
   - Verify all questions make sense
   - Check that responses are recorded

4. **Set up response notifications:**
   - In Google Forms, click "Responses" tab
   - Click three dots menu → "Get email notifications for new responses"
   - Enable notifications so you see feedback immediately

---

## Analyzing Form Responses

### Google Sheets Integration

Google Forms automatically creates a spreadsheet with responses:

1. Click "Responses" tab in form
2. Click green spreadsheet icon
3. Opens Google Sheets with all responses

### Key Metrics to Track

**Accuracy metrics:**
- Average accuracy rating
- % within ±10g
- % within ±20g
- Foods most often misidentified

**Performance metrics:**
- Average analysis time
- % completing under 10 seconds
- % failed analyses

**Satisfaction metrics:**
- % would use daily
- Most common complaints
- Most common praise

### Weekly Summary Template

```
WEEK [X] BETA SUMMARY

📊 METRICS:
- Total feedback submissions: [X]
- Active testers: [X]
- Meals analyzed: [X]

🎯 ACCURACY:
- Very accurate (±5g): [X%]
- Somewhat accurate (±10g): [X%]
- Acceptable (±20g): [X%]
- Not accurate: [X%]

⚡ PERFORMANCE:
- Average analysis time: [X] seconds
- Under 10 seconds: [X%]
- Failed analyses: [X%]

😊 SATISFACTION:
- Would use daily: [X%]
- Top praise: [common theme]
- Top complaint: [common theme]

🐛 BUGS REPORTED:
1. [Bug description] - [X] reports
2. [Bug description] - [X] reports

💡 TOP FEATURE REQUESTS:
1. [Feature] - [X] requests
2. [Feature] - [X] requests

📝 ACTION ITEMS:
- [ ] Fix: [critical bug]
- [ ] Improve: [accuracy issue]
- [ ] Consider: [feature request]
```

---

## Privacy Considerations

**Data collected:**
- Meal descriptions (text)
- Meal photos (optional)
- Carb estimates (numbers)
- User feedback (text)
- Email addresses (optional)

**Best practices:**
1. Add privacy notice to form description
2. Don't require personal information
3. Store responses securely
4. Delete after analysis (if promised)
5. Don't share individual feedback publicly

**Privacy notice for form:**
```
Your feedback is confidential and used only to improve CarbTracker.
Meal photos and descriptions will not be shared publicly.
Optional email addresses are only for follow-up questions.
```

---

## Next Steps After Form Creation

1. ✅ Create the Google Form using this template
2. ✅ Get the form link (forms.gle/...)
3. ✅ Update all documentation with the link
4. ✅ Test the form yourself (submit test response)
5. ✅ Enable email notifications for responses
6. ✅ Share form link with beta testers
7. ✅ Check responses daily
8. ✅ Weekly analysis and summaries

---

Good luck with your beta testing! 🚀
