# Quick-Tap Question Framework for CarbTracker MVP

**Created:** January 22, 2026
**Purpose:** Smart confirmation system that asks minimal questions for maximum accuracy improvement
**Goal:** Only ask when AI is uncertain AND carb impact > 10g

---

## Core Principle

**Ask only when necessary:**
- AI confidence < 85% on a detail
- Carb impact of uncertainty > 10g
- Maximum 3 questions per meal
- Questions sorted by carb impact (biggest first)

---

## Decision Logic

```
1. AI analyzes photo
2. AI identifies uncertainties with carb impact estimates
3. For each uncertainty:
   - If impact > 10g AND confidence < 85% → Ask question
   - If impact < 10g OR confidence > 85% → Skip question
4. Sort questions by carb impact (descending)
5. Show max 3 questions
6. Optional text field for edge cases
```

---

## MVP Phase 1: Top 5 Food Categories

### 1. PIZZA 🍕

**Triggers when AI identifies:** Pizza, flatbread, calzone

**Question 1: Size** (CRITICAL - can be 30g difference)
```
How big is the pizza?
[Personal 7-9"] [Small 10-12"] [Medium 14"] [Large 16"+] [Extra Large 18"+]

Carb impact: Personal slice = 20-25g | Large slice = 50-60g
```

**Question 2: Crust Type** (15-20g difference)
```
What type of crust?
[Thin] [Regular] [Thick/Pan] [Deep Dish] [Stuffed Crust]

Carb impact: Thin = -10g | Deep dish = +15g
```

**Auto-skip if:** User already typed size in notes field

---

### 2. CEREAL & OATS 🥣

**Triggers when AI identifies:** Cereal, granola, oatmeal, muesli

**Question 1: Did you add milk/yogurt?** (CRITICAL - 10-15g difference)
```
Did you add liquid?
[No - dry only] [Yes - milk] [Yes - yogurt] [Yes - almond milk]

Carb impact: 1/2 cup milk = +6g | 1/2 cup yogurt = +8g
```

**Question 2: Sweetened or Plain?** (10-15g difference)
```
Is this sweetened?
[Plain/unsweetened] [Lightly sweetened] [Honey/sugar added] [Chocolate/frosted]

Carb impact: Plain = base | Sweetened = +10-15g
```

**Question 3: Portion** (AI often can't tell depth)
```
How much cereal (dry)?
[1/4 cup] [1/2 cup] [3/4 cup] [1 cup] [More than 1 cup]

Carb impact: 1/2 cup = 20-25g | 1 cup = 40-50g
```

---

### 3. SANDWICHES & BURGERS 🥪🍔

**Triggers when AI identifies:** Sandwich, burger, sub, wrap, hoagie

**Question 1: Bread Type** (10-20g difference)
```
What kind of bread/bun?
[Regular white] [Whole wheat] [Thin bun] [Large bun] [Wrap/Tortilla] [Low-carb]

Carb impact: Regular bun = 30g | Large bun = 45g | Low-carb = 5g
```

**Question 2: Size** (for subs/hoagies)
```
What size?
[6 inch] [Footlong] [8-10 inch]

Carb impact: 6" = 30-40g | Footlong = 60-80g
```

---

### 4. PASTA, RICE & GRAIN BOWLS 🍝🍚

**Triggers when AI identifies:** Pasta, rice, quinoa, grain bowl, noodles

**Question 1: Portion Size** (CRITICAL - hard to judge from photo, 20-40g difference)
```
How much is in the bowl/plate?
[Small (1 cup)] [Medium (1.5 cups)] [Large (2+ cups)] [Side portion] [Full meal]

Carb impact: 1 cup = 35-45g | 2 cups = 70-90g
```

**Question 2: Type** (for pasta - 10-15g difference)
```
What type of pasta?
[Regular wheat] [Whole wheat] [Gluten-free] [Protein/chickpea] [Low-carb]

Carb impact: Similar for most, but protein pasta = -10g
```

---

### 5. PROTEINS WITH SAUCES 🍗🥩

**Triggers when AI identifies:** Chicken, beef, pork, fish with visible glaze/sauce

**Question: Is it glazed/sauced?** (5-15g difference)
```
Any glaze, sauce, or breading?
[Plain/unsauced] [Light glaze] [Heavy glaze/BBQ] [Breaded/fried] [Teriyaki/sweet sauce]

Carb impact: Plain = 0g | BBQ glaze = +10g | Breaded = +15-20g
```

---

## Phase 2 Categories (Post-Launch)

### 6. BAKED GOODS 🥐🧁

**Triggers:** Muffin, croissant, donut, pastry, cookie, cake, brownie

**Question 1: Size**
```
What size is this?
[Mini] [Regular/Medium] [Large] [Jumbo/Bakery-size]

Carb impact: Mini muffin = 15g | Jumbo muffin = 60g
```

**Question 2: Type** (if ambiguous)
```
Which one is it?
[Option A: Twinkie (27g)] [Option B: Madeleine (15g)]
```

---

### 7. BEVERAGES 🥤

**Triggers:** Juice, smoothie, soda, latte, frappe

**Question 1: Size**
```
What size?
[Small 8-12oz] [Medium 16oz] [Large 20oz] [Extra Large 24oz+]

Carb impact: Small juice = 20g | Large = 60g
```

**Question 2: Sugar content**
```
What type?
[Regular/Full sugar] [Diet/Zero sugar] [Half sugar] [Unsweetened]

Carb impact: Diet = 0g | Regular = 30-60g
```

---

### 8. FRUIT 🍎🍌

**Triggers:** Fruit (whole or cut)

**Question 1: Size**
```
What size?
[Small] [Medium] [Large]

Carb impact: Small banana = 20g | Large = 35g
```

**Question 2: Dried vs Fresh** (CRITICAL - 4x difference)
```
Is this:
[Fresh] [Dried/Dehydrated] [Canned in syrup]

Carb impact: Fresh grapes = 15g | Raisins same amount = 60g
```

---

### 9. SOUPS & STEWS 🍲

**Triggers:** Soup, stew, chili

**Question 1: Portion**
```
How much?
[Cup (~8oz)] [Bowl (~12oz)] [Large bowl (16oz+)]
```

**Question 2: Type**
```
What kind of soup?
[Broth-based] [Creamy/cream-based] [With noodles] [With potatoes/beans]

Carb impact: Broth = 5-10g | Creamy with noodles = 30-40g
```

---

### 10. BREAKFAST FOODS 🍳🥞

**Triggers:** Pancakes, waffles, French toast

**Question 1: Count**
```
How many?
[1 piece] [2 pieces] [3 pieces] [4+ pieces] [Stack]

Carb impact: 1 pancake = 15-20g | Stack of 3 = 50-60g
```

**Question 2: Syrup/toppings**
```
Any syrup or sweet toppings?
[None] [Light syrup] [Regular syrup] [Fruit topping] [Chocolate chips]

Carb impact: None = 0g | Regular syrup = +15-30g
```

---

## Phase 3 Categories (Enhancement)

### 11. MIXED DISHES 🍛

**Triggers:** Casserole, stir-fry, curry, mixed plate

**Question: Portion size**
```
How much are you eating?
[Small (1 cup)] [Medium (1.5 cups)] [Large (2+ cups)] [Side] [Main dish]
```

---

### 12. PACKAGED/PROCESSED FOODS 📦

**Triggers:** Chips, crackers, packaged snacks

**Question: Portion**
```
How much did you eat?
[Small handful] [Serving (check bag)] [Half bag] [Whole bag]

Carb impact: 1 serving chips = 15g | Whole bag = 60g+
```

**Auto-suggest:** "If the package is visible, I can read the label for exact carbs"

---

## Special Cases

### RESTAURANT MEALS 🍽️

**Triggers:** Restaurant setting (plates, table visible)

```
Do you know the restaurant?
[Yes - {text field}] [No - estimate from photo]

If yes: Look up chain nutrition data
```

---

## UX Flow Examples

### Example 1: Clear Photo (Skip Questions)

```
📸 Photo: Banana next to phone for scale

🤖 AI: "Medium banana, 95% confident"

✅ 27g carbs
   [Adjust manually] [Confirm & Log]

Questions asked: NONE (high confidence, clear context)
```

---

### Example 2: Moderate Uncertainty (1 Question)

```
📸 Photo: Bowl of Cheerios

🤖 AI: "Cheerios (90% confident), unclear if milk added"

❓ Did you add milk?
   [No - dry only] [Yes - milk] [Yes - yogurt]
                       ↑ TAP

✅ 31g carbs
   • Cheerios (dry): 25g
   • Milk (1/2 cup): 6g

   [Adjust manually] [Confirm & Log]

Questions asked: 1 (milk uncertainty = +6g impact)
```

---

### Example 3: Multiple Uncertainties (2-3 Questions)

```
📸 Photo: Pizza slice

🤖 AI: "Pizza with sausage and peppers"

❓ Pizza size?
   [Personal 7-9"] [Small 10-12"] [Medium 14"] [Large 16"+]
                        ↑ TAP

❓ Crust type?
   [Thin] [Regular] [Thick]
           ↑ TAP

💬 Other details? (optional)
   [Skip]

✅ 38g carbs
   • Regular crust: 32g
   • Sauce: 3g
   • Toppings: 3g

   [Adjust manually] [Confirm & Log]

Questions asked: 2 (size = ±20g, crust = ±15g)
```

---

## Smart Features (Future Enhancement)

### Contextual Question Skipping

- **Reference objects visible** → Skip size questions
- **Package/label visible** → Offer to read label instead
- **Bowl appears dry** → Skip "did you add milk?" question
- **AI > 90% confident** → Skip that question entirely

### Learning from User Patterns

- "Last time you had Domino's medium, you logged 45g. Use that?"
- Remember: "You usually add milk to cereal" → Pre-select that option
- Track: "You typically eat large portions" → Adjust estimates

### Meal History Integration

- "This looks like the spaghetti you had last week (55g). Same portion?"
- "Similar to your usual breakfast. Estimate 30g?"

---

## Key Design Principles

1. **Ask maximum 2-3 questions** - More = user fatigue and abandonment
2. **Show carb impact when helpful** - "Thin crust (-10g)" vs "Deep dish (+15g)"
3. **Make skipping easy** - Don't block progress on unanswered questions
4. **Learn from patterns** - Pre-select common choices after 2-3 uses
5. **Food-specific only** - Generic questions waste time and add no value
6. **Visual clarity** - Use icons, colors, and clear labels
7. **Speed over precision** - 90% accuracy in 10 seconds beats 95% in 60 seconds

---

## Implementation Priority

### MVP Launch (Phase 1):
- Pizza (size + crust)
- Cereal/Oats (milk + sweetened + portion)
- Sandwiches (bread type + size)
- Pasta/Rice (portion)
- Proteins (glazed/sauced)

### Post-Launch (Phase 2):
- Baked goods
- Beverages
- Fruit
- Soups
- Breakfast foods

### Enhancement (Phase 3):
- Mixed dishes
- Packaged foods
- Restaurant integration
- Smart learning features

---

## Success Metrics to Track

During beta testing, measure:

1. **Question frequency** - How often is each question asked?
2. **Answer rate** - What % of questions do users answer vs skip?
3. **Carb impact** - Which questions most frequently change the estimate?
4. **Accuracy improvement** - Estimates with questions vs without
5. **User friction** - Do users abandon after X questions?
6. **Time cost** - Average seconds spent answering questions
7. **Pattern learning** - How quickly can we pre-select answers?

**Target KPIs:**
- 80%+ question answer rate
- <15 seconds total time to answer questions
- 90%+ accuracy when questions answered
- <5% user abandonment during question flow

---

## Test Data Evidence

From Week 1 testing (5 meals):

| Test | Food | AI Alone | With Questions | Improvement |
|------|------|----------|----------------|-------------|
| #1 | Madeleine/Twinkie | 75% | Would be 95%+ | +20% |
| #2 | Salmon dinner | 100% | N/A (no questions needed) | - |
| #3 | Muesli | 86% | Would be 95%+ | +9% |
| #4 | Lunch | 100% with questions | 85% without | +15% |
| #5 | Pizza | 65% | Would be 95%+ | +30% |

**Average accuracy:**
- AI alone: 85%
- AI + uncertainty questions: 93%
- Improvement: +8 percentage points (±20g → ±10g)

---

*This framework is a living document and will be refined based on beta testing feedback and user behavior patterns.*
