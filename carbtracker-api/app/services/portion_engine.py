"""
Portion Size Engine for CarbTracker
Generates universal 3-option portion sizes (Small, Regular, Large)
"""

from app.schemas.analysis import PortionOption


# Universal 3-option portion template for all foods
UNIVERSAL_PORTIONS = [
    {"label": "Small", "multiplier": 0.7},
    {"label": "Regular", "multiplier": 1.0},
    {"label": "Large", "multiplier": 1.4},
]


def get_portion_options(food_name: str) -> list[PortionOption]:
    """
    Get universal portion size options (Small, Regular, Large)

    Args:
        food_name: Name of the food item (not used, kept for API compatibility)

    Returns:
        List of 3 PortionOption objects
    """
    return [
        PortionOption(label=opt["label"], multiplier=opt["multiplier"])
        for opt in UNIVERSAL_PORTIONS
    ]
