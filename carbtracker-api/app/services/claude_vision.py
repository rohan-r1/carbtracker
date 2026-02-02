"""
Claude Vision Service for CarbTracker
Ported from scripts/test_carb_estimate_v2.py with structured JSON output
"""

import base64
import io
import json
import re
from typing import Optional
from PIL import Image
from anthropic import Anthropic

from app.config import get_settings


settings = get_settings()
client = Anthropic(api_key=settings.anthropic_api_key)


def compress_image(image_bytes: bytes, max_size_mb: float = 3.5) -> bytes:
    """Compress image if it exceeds max size (API limit is 5MB, target 3.5MB for safety)"""
    file_size_mb = len(image_bytes) / (1024 * 1024)

    if file_size_mb <= max_size_mb:
        return image_bytes

    img = Image.open(io.BytesIO(image_bytes))

    # Convert RGBA to RGB if needed (for JPEG compatibility)
    if img.mode == "RGBA":
        background = Image.new("RGB", img.size, (255, 255, 255))
        background.paste(img, mask=img.split()[3])
        img = background
    elif img.mode != "RGB":
        img = img.convert("RGB")

    # Try reducing quality first
    quality = 85
    while quality > 20:
        buffer = io.BytesIO()
        img.save(buffer, format="JPEG", quality=quality, optimize=True)
        buffer.seek(0)

        compressed_size_mb = len(buffer.getvalue()) / (1024 * 1024)
        if compressed_size_mb <= max_size_mb:
            return buffer.getvalue()

        quality -= 5

    # If still too large, resize
    width, height = img.size
    img = img.resize((int(width * 0.8), int(height * 0.8)), Image.Resampling.LANCZOS)

    buffer = io.BytesIO()
    img.save(buffer, format="JPEG", quality=85, optimize=True)
    buffer.seek(0)

    return buffer.getvalue()


def get_media_type(content_type: Optional[str], filename: Optional[str] = None) -> str:
    """Determine media type from content type or filename"""
    if content_type and content_type.startswith("image/"):
        return content_type

    if filename:
        ext = filename.lower().split(".")[-1] if "." in filename else ""
        media_types = {
            "jpg": "image/jpeg",
            "jpeg": "image/jpeg",
            "png": "image/png",
            "gif": "image/gif",
            "webp": "image/webp",
        }
        return media_types.get(ext, "image/jpeg")

    return "image/jpeg"


def build_analysis_prompt(description: Optional[str] = None) -> str:
    """Build the Claude Vision prompt for carb analysis"""
    description_context = ""
    if description:
        description_context = f"""
The user has described this meal as: "{description}"
Use this description to guide your food identification. Trust the user's description for what the food IS,
and focus your visual analysis on estimating PORTIONS and QUANTITIES from the photo.

"""

    return f"""You are a nutrition expert helping a Type 1 diabetic estimate carbohydrates for insulin dosing.

Analyze this meal photo and return a structured JSON response.
{description_context}
IMPORTANT: Your response must be ONLY valid JSON with no additional text before or after.

**CRITICAL SAFETY CHECK**: First, determine if there is actually FOOD present in this photo.
- If the photo shows no food, empty plates/cups, just table/background, or unclear objects: set "food_detected" to false
- Only set "food_detected" to true if you can clearly identify edible food items in the photo
- This is a SAFETY CRITICAL field - Type 1 diabetics could dose insulin based on this analysis

Return JSON in this exact format:
{{
  "food_detected": true,
  "foods": [
    {{
      "id": "food_1",
      "most_likely": {{
        "name": "Food name",
        "confidence": 85,
        "carbs": 30,
        "portion": "1 medium"
      }},
      "alternatives": [
        {{
          "name": "Alternative food",
          "confidence": 10,
          "carbs": 45
        }}
      ]
    }}
  ],
  "uncertainties": [
    {{
      "food_id": "food_1",
      "category": "size|type|preparation|hidden_ingredients",
      "question": "What size is the banana?",
      "options": [
        {{"label": "Small", "carb_adjustment": -10}},
        {{"label": "Medium", "carb_adjustment": 0}},
        {{"label": "Large", "carb_adjustment": 15}}
      ],
      "carb_impact": 25,
      "confidence": 60
    }}
  ],
  "preliminary_estimate": {{
    "min": 25,
    "max": 45,
    "likely": 35
  }},
  "overall_confidence": "High|Medium|Low",
  "notes": "Any important notes about the analysis",
  "no_food_reason": "Explanation if food_detected is false"
}}

Guidelines:
1. **FIRST**: Determine if food is actually present. Set "food_detected" to false if:
   - No food visible in the image
   - Only empty plates, cups, or utensils
   - Blurry/dark/unclear image with no identifiable food
   - Objects that might look like food but clearly aren't (e.g., toys, decorations)
2. If food_detected is false, you can set foods array to empty [] and skip other fields
3. For each food, identify the most likely item and up to 3 alternatives if there's visual ambiguity
4. Confidence is 0-100 percentage
5. Include uncertainties when confidence < 85% AND the carb impact > 10g
6. Sort uncertainties by carb_impact descending
7. Maximum 3 uncertainties (questions)
8. Categories: "size" for portion questions, "type" for food identification, "preparation" for cooking method, "hidden_ingredients" for things you can't see
9. Be conservative - if unsure, use the higher carb estimate
10. preliminary_estimate.likely should be your best single estimate

**Question Phrasing Guidelines (CRITICAL):**
- ALWAYS make questions contextual and conversational, referring to the specific food by name
- For binary detection (is X present?): "Is there [food name] on your food?" or "Are there [food name] in your meal?"
  * Example: "Is there butter on your toast?" with options ["Yes", "No"]
  * Example: "Are there mixed berries in your meal?" with options ["Yes", "No"]
- For portion/size questions: "What size is the [food name]?" or "How much [food name]?"
  * Example: "What size is the banana?" with options ["Small", "Medium", "Large"]
  * Example: "How much rice?" with options ["1/2 cup", "1 cup", "1.5 cups"]
- For preparation: "How is the [food name] prepared?"
  * Example: "How is the chicken prepared?" with options ["Grilled", "Fried", "Baked"]
- For hidden ingredients: "What's in the [dish name]?" or "What liquid is in the [container]?"
  * Example: "What's in the curry?" with options ["Just vegetables", "With rice", "With naan"]
- NEVER use generic questions like "What is this item?" - always name the food you're asking about
- If asking about presence/absence, use Yes/No options. If asking about quantities, provide specific quantity options
- Make questions natural and easy to answer quickly while looking at the photo"""


async def analyze_meal_image(
    image_bytes: bytes,
    content_type: Optional[str] = None,
    filename: Optional[str] = None,
    description: Optional[str] = None,
) -> dict:
    """
    Analyze a meal image using Claude Vision API

    Returns structured JSON with foods, uncertainties, and preliminary estimate
    """
    # Compress image if needed
    compressed_image = compress_image(image_bytes)

    # Encode to base64
    image_data = base64.standard_b64encode(compressed_image).decode("utf-8")

    # Get media type
    media_type = get_media_type(content_type, filename)
    # After compression, image is JPEG
    if len(compressed_image) != len(image_bytes):
        media_type = "image/jpeg"

    # Build prompt
    prompt = build_analysis_prompt(description)

    # Call Claude Vision API
    message = client.messages.create(
        model="claude-sonnet-4-5-20250929",
        max_tokens=2048,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": media_type,
                            "data": image_data,
                        },
                    },
                    {
                        "type": "text",
                        "text": prompt,
                    },
                ],
            }
        ],
    )

    # Extract response text
    response_text = message.content[0].text

    # Parse JSON from response
    try:
        # Try to extract JSON if there's extra text
        json_match = re.search(r"\{[\s\S]*\}", response_text)
        if json_match:
            result = json.loads(json_match.group())
        else:
            result = json.loads(response_text)
    except json.JSONDecodeError:
        # If parsing fails, return a structured error response
        result = {
            "foods": [],
            "uncertainties": [],
            "preliminary_estimate": {"min": 0, "max": 0, "likely": 0},
            "overall_confidence": "Low",
            "notes": "Failed to parse AI response",
            "raw_response": response_text,
        }

    # Store raw response for debugging
    result["_raw_response"] = response_text

    return result
