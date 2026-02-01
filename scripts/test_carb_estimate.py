"""
CarbTracker - Meal Photo Analysis Script
Day 1 Test: Analyze a meal photo and estimate carbohydrates

Usage:
    python scripts/test_carb_estimate.py <path_to_meal_photo>

Example:
    python scripts/test_carb_estimate.py meal_photos/dinner.jpg
"""

import os
import sys
import base64
from pathlib import Path
from datetime import datetime
from dotenv import load_dotenv
from anthropic import Anthropic

# Load API key from .env file
load_dotenv()
api_key = os.getenv('ANTHROPIC_API_KEY')

if not api_key:
    print("ERROR: ANTHROPIC_API_KEY not found in .env file")
    sys.exit(1)

# Initialize Anthropic client
client = Anthropic(api_key=api_key)

def encode_image(image_path):
    """Convert image to base64 format for API"""
    with open(image_path, 'rb') as image_file:
        return base64.standard_b64encode(image_file.read()).decode('utf-8')

def get_image_media_type(image_path):
    """Determine image type from file extension"""
    ext = Path(image_path).suffix.lower()
    media_types = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp'
    }
    return media_types.get(ext, 'image/jpeg')

def analyze_meal(image_path):
    """
    Send meal photo to Claude Vision API and get carb estimate
    """
    print(f"\n{'='*60}")
    print(f"ANALYZING MEAL PHOTO: {image_path}")
    print(f"{'='*60}\n")

    # Check if image exists
    if not os.path.exists(image_path):
        print(f"ERROR: Image file not found: {image_path}")
        return None

    # Encode image
    print("[*] Loading image...")
    image_data = encode_image(image_path)
    media_type = get_image_media_type(image_path)

    # Craft the prompt for carb estimation
    prompt = """You are a nutrition expert helping a Type 1 diabetic estimate carbohydrates for insulin dosing.

Analyze this meal photo and provide:

1. **Food Identification**: List each food item you can see
2. **Portion Estimation**: Estimate the portion size for each item
3. **Carbohydrate Estimate**: Calculate total carbohydrates in grams
4. **Breakdown**: Show carbs per food item
5. **Confidence Level**: Rate your confidence (High/Medium/Low) and explain why
6. **Uncertainties**: Note anything that affects accuracy (angle, lighting, hidden ingredients, etc.)

Format your response clearly with the total carb estimate prominent.

Remember: This person will use this estimate to dose insulin, so be honest about uncertainty and provide a reasonable range if exact estimation is difficult."""

    # Call Claude Vision API
    print("[*] Sending to Claude Vision API...")
    print("[*] Analyzing...")

    try:
        message = client.messages.create(
            model="claude-sonnet-4-5-20250929",  # Latest Claude Sonnet with vision
            max_tokens=1024,
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
                            "text": prompt
                        }
                    ],
                }
            ],
        )

        # Extract response
        response_text = message.content[0].text

        print(f"\n{'='*60}")
        print("RESULTS:")
        print(f"{'='*60}\n")
        print(response_text)
        print(f"\n{'='*60}\n")

        # Save results to file
        save_results(image_path, response_text)

        return response_text

    except Exception as e:
        print(f"\n[!] ERROR: {str(e)}")
        return None

def save_results(image_path, response):
    """Save analysis results to a text file"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    image_name = Path(image_path).stem
    results_file = f"results/{image_name}_{timestamp}.txt"

    # Create results directory if it doesn't exist
    os.makedirs("results", exist_ok=True)

    with open(results_file, 'w', encoding='utf-8') as f:
        f.write(f"CarbTracker Analysis Results\n")
        f.write(f"{'='*60}\n\n")
        f.write(f"Image: {image_path}\n")
        f.write(f"Analyzed: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write(f"\n{'='*60}\n\n")
        f.write(response)

    print(f"[*] Results saved to: {results_file}\n")

def main():
    """Main entry point"""
    if len(sys.argv) != 2:
        print("\n[!] Usage: python scripts/test_carb_estimate.py <path_to_meal_photo>")
        print("\nExample:")
        print("  python scripts/test_carb_estimate.py meal_photos/dinner.jpg\n")
        sys.exit(1)

    image_path = sys.argv[1]
    analyze_meal(image_path)

if __name__ == "__main__":
    main()
