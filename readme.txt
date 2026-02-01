Rohan's prompt:
I’m a type 1 diabetic and I use an insulin pump. It requires me to enter an estimated carbohydrate count each time I eat a meal. I want to build an application that lets me photograph a meal and have it estimate carbohydrates for me. Can you plan this out for me. How do we get started, what steps do we take, what does the basic architecture look like

Claude's response:
I'll help you plan out this carbohydrate estimation app. This is a great use case for computer vision + AI, and the medical application makes accuracy particularly important.

## High-Level Architecture

**Frontend (Mobile App)**
- Camera interface for meal photos
- Display estimated carbs with confidence level
- Manual adjustment capability
- History/log of meals and estimates
- Sync with your pump data (if API available)

**Backend Services**
- Image processing/analysis API
- Database for meal history
- User authentication
- Analytics for improving accuracy over time

**AI/ML Component**
- Vision model for food recognition
- Portion size estimation
- Carbohydrate calculation engine

## Getting Started - MVP Approach

**Phase 1: Proof of Concept (2-3 weeks)**

1. **Start with Claude/GPT-4 Vision API** - Don't build ML models yet
   - Upload image to API with prompt: "Identify foods and estimate carbohydrates"
   - This validates the concept quickly
   - Claude Sonnet 4.5 or GPT-4o both have strong food recognition

2. **Simple mobile app** (React Native or Flutter)
   - Camera screen
   - API call to Claude/OpenAI
   - Display results
   - Manual override field

3. **Test accuracy** with meals you know well
   - Compare against your current estimates
   - Build a small dataset of photos + actual carbs

**Phase 2: Enhanced MVP (4-6 weeks)**

1. **Improve prompting strategy**
   - Include reference objects for scale (fork, plate, etc.)
   - Multi-angle photos
   - Structured output format (JSON with confidence scores)

2. **Add user feedback loop**
   - Let user correct estimates
   - Store corrections to improve future prompts
   - Build personal meal library

3. **Basic backend** (Node.js/Python + PostgreSQL)
   - User accounts
   - Meal history
   - Personal corrections database

## Technical Stack Recommendation

**Mobile App:**
- React Native (cross-platform) or Swift (iOS-first)
- Expo for faster development if React Native

**Backend:**
- Python FastAPI or Node.js Express
- PostgreSQL for structured data
- S3 for image storage

**AI Layer:**
- Start: Anthropic Claude API or OpenAI GPT-4 Vision
- Future: Fine-tuned model (Nutrition5k dataset, Food-101)

**Infrastructure:**
- Vercel/Railway for backend hosting
- Cloudflare R2 or AWS S3 for images

## Critical Considerations for Type 1 Diabetes

1. **Accuracy & Safety**
   - Always show confidence levels
   - Make manual override prominent
   - Consider showing range (e.g., "45-55g carbs")
   - Clear disclaimer: "estimation tool, not medical device"

2. **FDA Regulations**
   - If you market as medical device, needs FDA clearance
   - Position as "logging tool" not "dosing calculator" initially
   - Consult with regulatory expert before public launch

3. **Features Type 1s Need**
   - Fiber subtraction (net carbs)
   - Fat/protein content (affects extended bolus)
   - Glycemic index indicators
   - Favorite meals quick-access
   - Restaurant meal database

## Development Roadmap

**Week 1-2:** 
- Set up Anthropic/OpenAI API account
- Build basic camera app that sends images to API
- Test with 20-30 of your own meals

**Week 3-4:**
- Add manual correction interface
- Implement meal history
- Refine prompts based on accuracy testing

**Week 5-8:**
- Backend with auth
- Personal meal library
- Improved UI/UX

**Month 3+:**
- Beta testing with other T1Ds
- Consider fine-tuned model if needed
- Integration with pump data (Dexcom/Tandem/Omnipod APIs)

## Cost Estimates (MVP)

- Anthropic/OpenAI API: ~$0.01-0.05 per image analysis
- Hosting: $20-50/month
- Storage: $5-10/month
- Total for 100 daily users: ~$100-200/month

## First Concrete Steps

1. **This week:** Create Anthropic API account, test Claude with 5 meal photos
2. **Next week:** Build React Native camera app that calls Claude API
3. **Week 3:** Show it to your endocrinologist for feedback

Want me to help you with any specific part? I could draft the initial prompt for Claude's vision API, or help set up the basic mobile app structure.

Rohan's prompt:
I need a checklist of steps for week 1

Claude's response:
# Week 1 Checklist: Carb Estimation App

## Day 1: Setup & API Testing

### Morning
- [ ] Create Anthropic account at console.anthropic.com
- [ ] Add payment method and get API key
- [ ] Install Python or Node.js (if not already installed)
- [ ] Create project folder: `carb-estimator-poc`
- [ ] Install required packages:
  - Python: `pip install anthropic pillow`
  - OR Node.js: `npm install @anthropic-ai/sdk`

### Afternoon
- [ ] Write simple script to test Claude Vision API
- [ ] Test with 1 sample meal photo from your phone
- [ ] Verify API works and returns food identification

## Day 2: Prompt Engineering

### Tasks
- [ ] Take photos of 5 different meals you ate (with known carb counts)
- [ ] Write detailed prompt for Claude that requests:
  - Food identification
  - Portion size estimation
  - Carbohydrate calculation
  - Confidence level
  - JSON output format
- [ ] Test prompt on all 5 meals
- [ ] Document accuracy: estimated carbs vs. your actual count

## Day 3: Refine & Iterate

### Morning
- [ ] Analyze which foods/meals were most/least accurate
- [ ] Improve prompt based on errors:
  - Add instructions for portion estimation
  - Request breakdown by food item
  - Ask for reasoning/explanation
- [ ] Re-test on same 5 meals with improved prompt

### Afternoon
- [ ] Take 5 NEW meal photos and test
- [ ] Create spreadsheet to track:
  - Photo filename
  - Claude's estimate
  - Your actual count
  - Confidence level
  - Accuracy percentage

## Day 4: Scale Reference Testing

### Tasks
- [ ] Retake 3-5 previous meals WITH reference objects:
  - Standard dinner plate
  - Fork/spoon
  - Your hand for scale
- [ ] Update prompt to mention reference objects
- [ ] Test if scale references improve accuracy
- [ ] Document results

## Day 5: Edge Cases & Planning

### Morning
- [ ] Test challenging scenarios:
  - [ ] Mixed dish (casserole, stir-fry)
  - [ ] Restaurant meal
  - [ ] Packaged food with visible label
  - [ ] Liquid (smoothie, juice)
  - [ ] Simple food (apple, slice of bread)

### Afternoon
- [ ] Calculate average accuracy across all tests
- [ ] Identify patterns in what works/doesn't work
- [ ] Write up findings document
- [ ] Decide: Is accuracy good enough to proceed to Week 2?

## Day 6-7: Documentation & Next Steps

- [ ] Organize all test photos in folders by accuracy level
- [ ] Document best prompt version
- [ ] Calculate estimated API costs based on testing
- [ ] Create GitHub repo for the project
- [ ] Plan Week 2 mobile app architecture
- [ ] (Optional) Show results to another T1D friend for feedback

## Resources to Bookmark

- [ ] Anthropic API docs: https://docs.anthropic.com
- [ ] Claude vision examples: https://docs.anthropic.com/en/docs/build-with-claude/vision
- [ ] USDA FoodData Central (for validation): https://fdc.nal.usda.gov

## Success Criteria for Week 1

- [ ] Successfully called Claude API with at least 15 meal photos
- [ ] Achieved average accuracy within ±15g on simple meals
- [ ] Identified which meal types work best/worst
- [ ] Have clear prompt template ready for Week 2
- [ ] Know API costs per image analysis

---

**Pro tip**: Keep your pump data nearby during testing so you can see how your estimates compared to actual blood sugar response. This real-world validation is gold.

Want me to help you write the initial API test script to get started on Day 1?
