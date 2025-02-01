from PIL import Image, ImageDraw

# Create 16x16 pixel image (favicon standard size)
img = Image.new('RGB', (16, 16), color=(44, 62, 80))  # Dark slate background
draw = ImageDraw.Draw(img)

# Draw crypt-themed icon
# Tombstone shape
draw.rectangle([4, 6, 12, 12], fill=(255, 255, 255))  # White base
draw.polygon([(4, 6), (8, 2), (12, 6)], fill=(255, 255, 255))  # Pointed top
# Crack detail
draw.line([(8, 8), (10, 10)], fill=(50, 50, 50), width=1)
# Blood spatter
draw.ellipse([13, 13, 15, 15], fill=(231, 76, 60))  # Red accent

# Save as favicon.ico
img.save('../favicon.ico', sizes=[(16,16)])