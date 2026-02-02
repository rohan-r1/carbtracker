"""
Portion Size Engine for CarbTracker
Generates appropriate portion size options based on food type
"""

from typing import Optional
from app.schemas.analysis import PortionOption


# Food category to portion options mapping
PORTION_TEMPLATES = {
    "fruit": [
        {"label": "Small", "multiplier": 0.7},
        {"label": "Medium", "multiplier": 1.0},
        {"label": "Large", "multiplier": 1.4},
    ],
    "bread_slice": [
        {"label": "1 slice", "multiplier": 1.0},
        {"label": "2 slices", "multiplier": 2.0},
        {"label": "3 slices", "multiplier": 3.0},
        {"label": "4+ slices", "multiplier": 4.5},
    ],
    "bagel": [
        {"label": "Half", "multiplier": 0.5},
        {"label": "Whole", "multiplier": 1.0},
        {"label": "1.5 bagels", "multiplier": 1.5},
        {"label": "2 bagels", "multiplier": 2.0},
    ],
    "muffin": [
        {"label": "Mini", "multiplier": 0.4},
        {"label": "Regular", "multiplier": 1.0},
        {"label": "Large/Jumbo", "multiplier": 1.6},
    ],
    "beverage": [
        {"label": "4 oz (small cup)", "multiplier": 0.5},
        {"label": "8 oz (cup)", "multiplier": 1.0},
        {"label": "12 oz (can/bottle)", "multiplier": 1.5},
        {"label": "16 oz (pint)", "multiplier": 2.0},
        {"label": "20 oz (large)", "multiplier": 2.5},
        {"label": "24+ oz (XL)", "multiplier": 3.0},
    ],
    "rice": [
        {"label": "1/2 cup", "multiplier": 0.5},
        {"label": "1 cup", "multiplier": 1.0},
        {"label": "1.5 cups", "multiplier": 1.5},
        {"label": "2 cups", "multiplier": 2.0},
        {"label": "2+ cups", "multiplier": 2.5},
    ],
    "pasta": [
        {"label": "1 cup", "multiplier": 1.0},
        {"label": "1.5 cups", "multiplier": 1.5},
        {"label": "2 cups", "multiplier": 2.0},
        {"label": "2.5+ cups", "multiplier": 2.5},
    ],
    "curry_stew": [
        {"label": "4 oz (small)", "multiplier": 0.5},
        {"label": "8 oz (cup)", "multiplier": 1.0},
        {"label": "12 oz (bowl)", "multiplier": 1.5},
        {"label": "16 oz (large bowl)", "multiplier": 2.0},
        {"label": "20+ oz", "multiplier": 2.5},
    ],
    "soup": [
        {"label": "1 cup (8 oz)", "multiplier": 1.0},
        {"label": "1.5 cups (12 oz)", "multiplier": 1.5},
        {"label": "2 cups (16 oz)", "multiplier": 2.0},
        {"label": "Bowl (20+ oz)", "multiplier": 2.5},
    ],
    "pizza": [
        {"label": "1 slice", "multiplier": 1.0},
        {"label": "2 slices", "multiplier": 2.0},
        {"label": "3 slices", "multiplier": 3.0},
        {"label": "4+ slices", "multiplier": 4.0},
    ],
    "sandwich": [
        {"label": "Half sandwich", "multiplier": 0.5},
        {"label": "Whole sandwich", "multiplier": 1.0},
        {"label": "1.5 sandwiches", "multiplier": 1.5},
    ],
    "cookie": [
        {"label": "1 cookie", "multiplier": 1.0},
        {"label": "2 cookies", "multiplier": 2.0},
        {"label": "3 cookies", "multiplier": 3.0},
        {"label": "4+ cookies", "multiplier": 4.0},
    ],
    "default": [
        {"label": "Small portion", "multiplier": 0.7},
        {"label": "Medium portion", "multiplier": 1.0},
        {"label": "Large portion", "multiplier": 1.4},
        {"label": "Extra large", "multiplier": 2.0},
    ],
}

# Keywords to detect food category
FOOD_CATEGORY_KEYWORDS = {
    "fruit": ["apple", "banana", "orange", "pear", "peach", "plum", "grape", "strawberr", "blueberr", "raspberr", "blackberr", "melon", "mango", "pineapple", "kiwi", "cherry"],
    "bread_slice": ["bread slice", "toast", "slice of bread"],
    "bagel": ["bagel"],
    "muffin": ["muffin", "cupcake"],
    "beverage": ["juice", "soda", "cola", "drink", "beverage", "smoothie", "latte", "coffee", "tea", "lemonade", "beer", "wine", "cocktail"],
    "rice": ["rice", "risotto", "grain bowl", "rice bowl"],
    "pasta": ["pasta", "spaghetti", "penne", "linguine", "fettuccine", "noodle", "macaroni", "ramen"],
    "curry_stew": ["curry", "stew", "chili", "dal", "korma", "tikka masala", "vindaloo"],
    "soup": ["soup", "broth", "bisque", "chowder"],
    "pizza": ["pizza", "flatbread"],
    "sandwich": ["sandwich", "burger", "sub", "wrap", "hoagie", "panini"],
    "cookie": ["cookie", "biscuit"],
}


def detect_portion_category(food_name: str) -> Optional[str]:
    """Detect which portion category a food belongs to based on keywords"""
    food_lower = food_name.lower()

    # Check for exact matches first (like "bread slice")
    for category, keywords in FOOD_CATEGORY_KEYWORDS.items():
        for keyword in keywords:
            if keyword in food_lower:
                return category

    return None


def get_portion_options(food_name: str) -> list[PortionOption]:
    """
    Get appropriate portion size options for a food item

    Args:
        food_name: Name of the food item

    Returns:
        List of PortionOption objects
    """
    category = detect_portion_category(food_name)

    # Use category template or default
    template = PORTION_TEMPLATES.get(category, PORTION_TEMPLATES["default"])

    return [
        PortionOption(label=opt["label"], multiplier=opt["multiplier"])
        for opt in template
    ]
