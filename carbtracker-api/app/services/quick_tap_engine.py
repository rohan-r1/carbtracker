"""
Quick-Tap Question Engine for CarbTracker
Ported from QUICK_TAP_FRAMEWORK.md

Core principle: Ask only when necessary
- AI confidence < 85% on a detail
- Carb impact of uncertainty > 10g
- Maximum 3 questions per meal
- Questions sorted by carb impact (biggest first)
"""

from typing import Optional
from app.schemas.analysis import QuickTapQuestionResponse, QuickTapOption


# Food category triggers and their questions
FOOD_CATEGORY_QUESTIONS = {
    "pizza": [
        {
            "category": "size",
            "question": "How big is the pizza?",
            "options": [
                {"label": "Personal 7-9\"", "carb_adjustment": -15},
                {"label": "Small 10-12\"", "carb_adjustment": 0},
                {"label": "Medium 14\"", "carb_adjustment": 10},
                {"label": "Large 16\"+", "carb_adjustment": 20},
            ],
            "carb_impact": 35,
        },
        {
            "category": "type",
            "question": "What type of crust?",
            "options": [
                {"label": "Thin", "carb_adjustment": -10},
                {"label": "Regular", "carb_adjustment": 0},
                {"label": "Thick/Pan", "carb_adjustment": 10},
                {"label": "Deep Dish", "carb_adjustment": 15},
            ],
            "carb_impact": 25,
        },
    ],
    "cereal": [
        {
            "category": "hidden_ingredients",
            "question": "Did you add liquid?",
            "options": [
                {"label": "No - dry only", "carb_adjustment": 0},
                {"label": "Yes - milk", "carb_adjustment": 6},
                {"label": "Yes - yogurt", "carb_adjustment": 8},
                {"label": "Yes - almond milk", "carb_adjustment": 1},
            ],
            "carb_impact": 15,
        },
        {
            "category": "type",
            "question": "Is this sweetened?",
            "options": [
                {"label": "Plain/unsweetened", "carb_adjustment": 0},
                {"label": "Lightly sweetened", "carb_adjustment": 5},
                {"label": "Honey/sugar added", "carb_adjustment": 10},
                {"label": "Chocolate/frosted", "carb_adjustment": 15},
            ],
            "carb_impact": 15,
        },
        {
            "category": "size",
            "question": "How much cereal (dry)?",
            "options": [
                {"label": "1/4 cup", "carb_adjustment": -15},
                {"label": "1/2 cup", "carb_adjustment": -8},
                {"label": "3/4 cup", "carb_adjustment": 0},
                {"label": "1 cup+", "carb_adjustment": 15},
            ],
            "carb_impact": 30,
        },
    ],
    "sandwich": [
        {
            "category": "type",
            "question": "What kind of bread/bun?",
            "options": [
                {"label": "Regular white", "carb_adjustment": 0},
                {"label": "Whole wheat", "carb_adjustment": 0},
                {"label": "Thin bun", "carb_adjustment": -10},
                {"label": "Large bun", "carb_adjustment": 15},
                {"label": "Wrap/Tortilla", "carb_adjustment": -5},
            ],
            "carb_impact": 25,
        },
        {
            "category": "size",
            "question": "What size?",
            "options": [
                {"label": "6 inch", "carb_adjustment": 0},
                {"label": "8-10 inch", "carb_adjustment": 15},
                {"label": "Footlong", "carb_adjustment": 30},
            ],
            "carb_impact": 30,
        },
    ],
    "pasta": [
        {
            "category": "size",
            "question": "How much is in the bowl/plate?",
            "options": [
                {"label": "Small (1 cup)", "carb_adjustment": 0},
                {"label": "Medium (1.5 cups)", "carb_adjustment": 18},
                {"label": "Large (2+ cups)", "carb_adjustment": 35},
            ],
            "carb_impact": 35,
        },
        {
            "category": "type",
            "question": "What type of pasta?",
            "options": [
                {"label": "Regular wheat", "carb_adjustment": 0},
                {"label": "Whole wheat", "carb_adjustment": 0},
                {"label": "Gluten-free", "carb_adjustment": 0},
                {"label": "Protein/chickpea", "carb_adjustment": -10},
            ],
            "carb_impact": 10,
        },
    ],
    "rice": [
        {
            "category": "size",
            "question": "How much rice?",
            "options": [
                {"label": "Small (1/2 cup)", "carb_adjustment": -15},
                {"label": "Medium (1 cup)", "carb_adjustment": 0},
                {"label": "Large (1.5+ cups)", "carb_adjustment": 20},
            ],
            "carb_impact": 35,
        },
    ],
    "protein": [
        {
            "category": "preparation",
            "question": "Any glaze, sauce, or breading?",
            "options": [
                {"label": "Plain/unsauced", "carb_adjustment": 0},
                {"label": "Light glaze", "carb_adjustment": 5},
                {"label": "Heavy glaze/BBQ", "carb_adjustment": 10},
                {"label": "Breaded/fried", "carb_adjustment": 18},
                {"label": "Teriyaki/sweet sauce", "carb_adjustment": 12},
            ],
            "carb_impact": 18,
        },
    ],
    "beverage": [
        {
            "category": "type",
            "question": "What type of drink is this?",
            "options": [
                {"label": "Regular (with sugar)", "carb_adjustment": 0},
                {"label": "Diet/Zero sugar", "carb_adjustment": -35},
                {"label": "Unsweetened", "carb_adjustment": -30},
                {"label": "Juice/Smoothie", "carb_adjustment": 5},
                {"label": "Beer/Wine", "carb_adjustment": -25},
            ],
            "carb_impact": 40,
        },
        {
            "category": "size",
            "question": "What size is the container?",
            "options": [
                {"label": "Small (8 oz)", "carb_adjustment": -15},
                {"label": "Can/Bottle (12 oz)", "carb_adjustment": 0},
                {"label": "Pint (16 oz)", "carb_adjustment": 10},
                {"label": "Large (20 oz)", "carb_adjustment": 20},
                {"label": "Extra Large (24+ oz)", "carb_adjustment": 30},
            ],
            "carb_impact": 35,
        },
        {
            "category": "preparation",
            "question": "How full is the glass/cup?",
            "options": [
                {"label": "Empty/Almost empty", "carb_adjustment": -25},
                {"label": "About 1/4 full", "carb_adjustment": -18},
                {"label": "About 1/2 full", "carb_adjustment": -12},
                {"label": "About 3/4 full", "carb_adjustment": -6},
                {"label": "Full/Nearly full", "carb_adjustment": 0},
            ],
            "carb_impact": 30,
        },
    ],
}

# Food keywords to category mapping
FOOD_KEYWORDS = {
    "pizza": ["pizza", "flatbread", "calzone"],
    "cereal": ["cereal", "granola", "oatmeal", "muesli", "cheerios", "oats"],
    "sandwich": ["sandwich", "burger", "sub", "wrap", "hoagie", "panini"],
    "pasta": ["pasta", "spaghetti", "penne", "linguine", "fettuccine", "noodle", "macaroni"],
    "rice": ["rice", "risotto", "quinoa", "grain bowl"],
    "protein": ["chicken", "beef", "pork", "fish", "salmon", "steak", "wings"],
    "beverage": [
        "beer", "ale", "lager", "ipa", "juice", "soda", "cola",
        "smoothie", "latte", "coffee drink", "lemonade",
        "energy drink", "wine", "cocktail", "drink", "beverage",
    ],
}


def detect_food_category(food_name: str) -> Optional[str]:
    """Detect which category a food belongs to based on keywords"""
    food_lower = food_name.lower()
    for category, keywords in FOOD_KEYWORDS.items():
        for keyword in keywords:
            if keyword in food_lower:
                return category
    return None


def generate_quick_tap_questions(
    foods: list[dict],
    uncertainties: list[dict],
    max_questions: int = 3,
    confidence_threshold: float = 85,
    carb_impact_threshold: float = 10,
) -> list[QuickTapQuestionResponse]:
    """
    Generate quick-tap questions based on AI analysis results

    Args:
        foods: List of detected foods from AI
        uncertainties: List of uncertainties from AI
        max_questions: Maximum number of questions to return
        confidence_threshold: Only ask if confidence below this
        carb_impact_threshold: Only ask if carb impact above this

    Returns:
        List of QuickTapQuestionResponse sorted by carb impact
    """
    questions = []

    # First, include AI-generated uncertainties that meet thresholds
    for uncertainty in uncertainties:
        confidence = uncertainty.get("confidence", 100)
        carb_impact = uncertainty.get("carb_impact", 0)

        if confidence < confidence_threshold and carb_impact > carb_impact_threshold:
            options = [
                QuickTapOption(
                    label=opt.get("label", ""),
                    carb_adjustment=opt.get("carb_adjustment", 0),
                )
                for opt in uncertainty.get("options", [])
            ]

            questions.append(
                QuickTapQuestionResponse(
                    id=f"q_{len(questions) + 1}",
                    food_id=uncertainty.get("food_id"),
                    question=uncertainty.get("question", ""),
                    options=options,
                    carb_impact=carb_impact,
                )
            )

    # Then, check if we should add category-specific questions
    for food in foods:
        most_likely = food.get("most_likely", {})
        food_name = most_likely.get("name", "")
        food_confidence = most_likely.get("confidence", 100)

        # Only add category questions if confidence is low (below threshold)
        if food_confidence >= confidence_threshold:
            continue

        # Detect category
        category = detect_food_category(food_name)
        if not category:
            continue

        # Get category questions
        category_questions = FOOD_CATEGORY_QUESTIONS.get(category, [])

        for cq in category_questions:
            # Skip if question already exists for similar category
            existing_categories = [q.question for q in questions]
            if cq["question"] in existing_categories:
                continue

            # Only check carb impact threshold (confidence already checked above)
            if cq["carb_impact"] > carb_impact_threshold:
                # Make question contextual by inserting food name
                contextual_question = cq["question"]

                # Replace generic terms with specific food name
                if "pizza" in cq["question"].lower() and category == "pizza":
                    contextual_question = cq["question"]  # Already specific
                elif "cereal" in cq["question"].lower() and category == "cereal":
                    contextual_question = cq["question"]  # Already specific
                elif "is this" in cq["question"].lower():
                    contextual_question = cq["question"].replace("Is this", f"Is the {food_name}")
                elif "this" in cq["question"].lower() and category != "beverage":
                    contextual_question = cq["question"].replace("this", f"the {food_name}")

                options = [
                    QuickTapOption(
                        label=opt["label"],
                        carb_adjustment=opt["carb_adjustment"],
                    )
                    for opt in cq["options"]
                ]

                questions.append(
                    QuickTapQuestionResponse(
                        id=f"q_{len(questions) + 1}",
                        food_id=food.get("id"),
                        question=contextual_question,
                        options=options,
                        carb_impact=cq["carb_impact"],
                    )
                )

    # Sort by carb impact (descending) and limit
    questions.sort(key=lambda q: q.carb_impact or 0, reverse=True)
    return questions[:max_questions]


def calculate_adjusted_carbs(
    base_carbs: float,
    quick_tap_answers: list[dict],
    questions: list[QuickTapQuestionResponse],
) -> float:
    """
    Calculate adjusted carb total based on quick-tap answers

    Args:
        base_carbs: Original carb estimate
        quick_tap_answers: List of {question_id, answer} dicts
        questions: Original questions with options

    Returns:
        Adjusted carb total
    """
    total_adjustment = 0

    # Build question lookup
    question_map = {q.id: q for q in questions}

    for answer in quick_tap_answers:
        question_id = answer.get("question_id")
        selected_label = answer.get("answer")

        question = question_map.get(question_id)
        if not question:
            continue

        # Find the selected option
        for option in question.options:
            if option.label == selected_label:
                total_adjustment += option.carb_adjustment
                break

    return base_carbs + total_adjustment
