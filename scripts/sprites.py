from PIL import Image, ImageDraw

# Create transparent base image (96x32 pixels to accommodate 3 sprites)
img = Image.new("RGBA", (96, 32), (0, 0, 0, 0))
draw = ImageDraw.Draw(img)

# Heart shape with border
heart_coords = [
    (10, 6), (16, 6), (22, 6),  # Top points
    (26, 10), (26, 16), (22, 22),  # Right curve
    (16, 26), (10, 22), (6, 16), (6, 10),  # Bottom curve
    (10, 6)  # Close path
]

# Draw pink heart with dark pink border
draw.polygon(heart_coords, fill="#FF69B4", outline="#CC0066", width=2)

# Enhanced diamond with facets
diamond_coords = [
    (32+16, 6),      # Top
    (32+26, 16),     # Right
    (32+16, 26),     # Bottom
    (32+6, 16),      # Left
    (32+16, 6)       # Close
]

# Draw cyan diamond with dark blue border and facets
draw.polygon(diamond_coords, fill="#00FFFF", outline="#006699", width=2)

# Add diamond facets (diagonal lines)
draw.line((32+16, 6) + (32+16, 26), fill="#80FFFF", width=1)  # Vertical center
draw.line((32+6, 16) + (32+26, 16), fill="#80FFFF", width=1)  # Horizontal center
draw.line((32+11, 11) + (32+21, 21), fill="#80FFFF", width=1)  # Diagonal 1
draw.line((32+21, 11) + (32+11, 21), fill="#80FFFF", width=1)  # Diagonal 2

# Rainbow prism sprite at 64,0
rainbow_coords = [
    (64+6, 6), (64+26, 6),  # Top
    (64+30, 16), (64+26, 26),  # Right curve
    (64+16, 30), (64+6, 26), (64+2, 16),  # Bottom curve
    (64+6, 6)  # Close path
]

# Draw rainbow effect with white border
draw.arc([(64+6,6), (64+26,26)], start=180, end=360, fill="#FF0000", width=2)  # Red arc
draw.line((64+16,6) + (64+16,26), fill="#FFA500", width=2)  # Orange center
draw.arc([(64+8,10), (64+24,22)], start=180, end=360, fill="#FFFF00", width=2)  # Yellow
draw.arc([(64+10,14), (64+22,18)], start=180, end=360, fill="#00FF00", width=2)  # Green
draw.rectangle([64+14,16, 64+18,26], fill="#0000FF")  # Blue bar
draw.polygon(rainbow_coords, outline="#FFFFFF", width=2)  # White border

# Save to file
img.save("assets/images/items.png", "PNG")
print("items.png created with enhanced sprites!")