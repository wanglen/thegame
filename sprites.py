from PIL import Image, ImageDraw

# Create transparent base image (64x32 pixels)
img = Image.new("RGBA", (64, 32), (0, 0, 0, 0))
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

# Save to file
img.save("assets/images/items.png", "PNG")
print("items.png created with enhanced sprites!")