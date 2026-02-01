"""
Simple script to generate app icon PNG from concept
Uses PIL (Pillow) to create a clean placeholder icon
"""

from PIL import Image, ImageDraw, ImageFont

def create_app_icon(output_path="icon.png", size=1024):
    """Create a simple CarbTracker app icon with CT logo"""

    # Forest green background with golden yellow text
    bg_color = '#2d5016'  # Forest green
    text_color = '#d4a522'  # Golden yellow

    # Create rounded rectangle background
    rounded_img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(rounded_img)
    corner_radius = 180
    draw.rounded_rectangle([(0, 0), (size-1, size-1)], corner_radius, fill=bg_color)

    # Try to use a bold font, fallback to default
    try:
        # Try common Windows font paths
        font_large = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 420)
        font_small = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 150)
    except:
        try:
            font_large = ImageFont.truetype("arial.ttf", 420)
            font_small = ImageFont.truetype("arial.ttf", 150)
        except:
            # Fallback to default font
            font_large = ImageFont.load_default()
            font_small = ImageFont.load_default()

    # Calculate text position (centered)
    text = "CT"

    # Get text bounding box for centering
    bbox = draw.textbbox((0, 0), text, font=font_large)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    x = (size - text_width) // 2
    y = (size - text_height) // 2 - 30  # Slightly above center

    # Convert hex color to RGB tuple
    # #d4a522 = (212, 165, 34)
    draw.text((x, y), text, fill=(212, 165, 34, 255), font=font_large)

    # Draw small "g" subscript
    small_text = "g"
    bbox_small = draw.textbbox((0, 0), small_text, font=font_small)
    small_width = bbox_small[2] - bbox_small[0]

    x_small = x + text_width + 20
    y_small = y + text_height - 100

    # Slightly transparent golden yellow for subscript
    draw.text((x_small, y_small), small_text, fill=(212, 165, 34, 230), font=font_small)

    # Save the icon
    rounded_img.save(output_path, 'PNG')
    print(f"[OK] Icon created: {output_path}")
    print(f"   Size: {size}x{size}px")
    print(f"   Format: PNG with transparency")

if __name__ == "__main__":
    import os

    # Create icon in the current directory
    icon_path = os.path.join(os.path.dirname(__file__), "icon.png")
    create_app_icon(icon_path, size=1024)

    print("\nNext steps:")
    print("1. Check the icon.png file that was created")
    print("2. Update app.json to reference this icon")
    print("3. Reload Expo to see the new icon")
