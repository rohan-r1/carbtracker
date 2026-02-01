"""
CarbTracker - Meal Photo Analysis Script V2
Enhanced version with multiple food possibilities

Usage:
    python scripts/test_carb_estimate_v2.py <path_to_meal_photo> [description]

Examples:
    python scripts/test_carb_estimate_v2.py meal_photos/lunch.jpg
    python scripts/test_carb_estimate_v2.py meal_photos/lunch.jpg "thai coconut curry with potato, carrots, zucchini"
"""

import os
import sys
import base64
from pathlib import Path
from datetime import datetime
from dotenv import load_dotenv
from anthropic import Anthropic
from PIL import Image
import io

# Configure UTF-8 encoding for Windows console
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Load API key from .env file
load_dotenv()
api_key = os.getenv('ANTHROPIC_API_KEY')

if not api_key:
    print("ERROR: ANTHROPIC_API_KEY not found in .env file")
    sys.exit(1)

# Initialize Anthropic client
client = Anthropic(api_key=api_key)

def compress_image(image_path, max_size_mb=3.5):
    """Compress image if it exceeds max size (API limit is 5MB, target 4.5MB for safety)"""
    # Check file size
    file_size_mb = os.path.getsize(image_path) / (1024 * 1024)

    if file_size_mb <= max_size_mb:
        # No compression needed
        with open(image_path, 'rb') as f:
            return f.read()

    print(f"[*] Image is {file_size_mb:.2f}MB, compressing to fit API limits...")

    # Open and compress image
    img = Image.open(image_path)

    # Convert RGBA to RGB if needed (for JPEG compatibility)
    if img.mode == 'RGBA':
        background = Image.new('RGB', img.size, (255, 255, 255))
        background.paste(img, mask=img.split()[3])
        img = background

    # Start with reasonable quality
    quality = 85

    while quality > 20:
        # Save to bytes buffer
        buffer = io.BytesIO()
        img.save(buffer, format='JPEG', quality=quality, optimize=True)
        buffer.seek(0)

        # Check size
        compressed_size_mb = len(buffer.getvalue()) / (1024 * 1024)

        if compressed_size_mb <= max_size_mb:
            print(f"[*] Compressed to {compressed_size_mb:.2f}MB (quality={quality})")
            return buffer.getvalue()

        # Reduce quality and try again
        quality -= 5

    # If still too large, resize
    print("[*] Resizing image...")
    width, height = img.size
    img = img.resize((int(width * 0.8), int(height * 0.8)), Image.Resampling.LANCZOS)

    buffer = io.BytesIO()
    img.save(buffer, format='JPEG', quality=85, optimize=True)
    buffer.seek(0)

    final_size_mb = len(buffer.getvalue()) / (1024 * 1024)
    print(f"[*] Final size: {final_size_mb:.2f}MB")

    return buffer.getvalue()

def encode_image(image_path):
    """Convert image to base64 format for API (with compression if needed)"""
    image_bytes = compress_image(image_path)
    return base64.standard_b64encode(image_bytes).decode('utf-8')

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

def analyze_meal(image_path, description=None):
    """
    Send meal photo to Claude Vision API and get carb estimate with multiple possibilities
    """
    print(f"\n{'='*60}")
    print(f"ANALYZING MEAL PHOTO: {image_path}")
    if description:
        print(f"USER DESCRIPTION: {description}")
    print(f"{'='*60}\n")

    # Check if image exists
    if not os.path.exists(image_path):
        print(f"ERROR: Image file not found: {image_path}")
        return None

    # Encode image
    print("[*] Loading image...")
    image_data = encode_image(image_path)
    media_type = get_image_media_type(image_path)

    # Enhanced prompt that considers multiple possibilities
    description_context = ""
    if description:
        description_context = f"""
The user has described this meal as: "{description}"
Use this description to guide your food identification. Trust the user's description for what the food IS,
and focus your visual analysis on estimating PORTIONS and QUANTITIES from the photo.

"""

    prompt = f"""You are a nutrition expert helping a Type 1 diabetic estimate carbohydrates for insulin dosing.

Analyze this meal photo carefully. Because similar-looking foods can have very different carb counts, I need you to be thorough.
{description_context}
For each food item in the photo, provide:

## 1. FOOD IDENTIFICATION (with alternatives)
For each item, list:
- **Most Likely:** What you think it is (with confidence %)
- **Could Also Be:** 2-3 similar-looking alternatives if there's any ambiguity
- **Key Visual Cues:** What makes you think it's one vs. the other

## 2. PORTION ESTIMATION
Estimate portion size for each item with reference to common objects if possible

## 3. CARBOHYDRATE ESTIMATES

Provide a breakdown table like this:

**If Most Likely Identification:**
| Food Item | Portion | Carbs |
|-----------|---------|-------|
| [item] | [size] | [g] |

**Alternative Scenarios (if uncertain):**
- If it's [alternative 1]: Total would be [X]g carbs
- If it's [alternative 2]: Total would be [Y]g carbs

## 4. RECOMMENDED ESTIMATE
**Primary Estimate:** [range] with most likely value
**If wrong about food ID, range could be:** [min-max]

## 5. CONFIDENCE LEVEL
Rate confidence (High/Medium/Low) and explain:
- What you're certain about
- What you're uncertain about
- What would help improve accuracy (better angle, reference objects, packaging visible, etc.)

## 6. USER CONFIRMATION NEEDED?
State clearly if you recommend the user confirm food identification before dosing, especially if:
- Similar foods with very different carb counts
- Can't see the full item
- Ambiguous portion size

Remember: Safety first. If uncertain between options with >10g carb difference, explicitly say so."""

    # Call Claude Vision API
    print("[*] Sending to Claude Vision API...")
    print("[*] Analyzing...")

    try:
        message = client.messages.create(
            model="claude-sonnet-4-5-20250929",
            max_tokens=2048,  # Increased for more detailed response
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
    results_file = f"results/{image_name}_{timestamp}_v2.txt"

    # Create results directory if it doesn't exist
    os.makedirs("results", exist_ok=True)

    with open(results_file, 'w', encoding='utf-8') as f:
        f.write(f"CarbTracker Analysis Results (V2 - Multiple Possibilities)\n")
        f.write(f"{'='*60}\n\n")
        f.write(f"Image: {image_path}\n")
        f.write(f"Analyzed: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write(f"\n{'='*60}\n\n")
        f.write(response)

    print(f"[*] Results saved to: {results_file}\n")

def main():
    """Main entry point"""
    if len(sys.argv) < 2:
        print("\n[!] Usage: python scripts/test_carb_estimate_v2.py <path_to_meal_photo> [description]")
        print("\nExamples:")
        print("  python scripts/test_carb_estimate_v2.py meal_photos/lunch.jpg")
        print('  python scripts/test_carb_estimate_v2.py meal_photos/lunch.jpg "thai coconut curry with potato, carrots, zucchini"\n')
        sys.exit(1)

    image_path = sys.argv[1]
    description = sys.argv[2] if len(sys.argv) > 2 else None
    analyze_meal(image_path, description)

if __name__ == "__main__":
    main()
