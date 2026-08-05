from PIL import Image
import math

src = r"d:\junaid\2nd-Projects\bluexche-ai\public\images\assistant.png"
im = Image.open(src).convert("RGBA")

# Full cute robot (head + body + arms), speech bubble cropped out on the right
box = (85, 245, 310, 690)
robot = im.crop(box)

# Soft circular mask so it works as a logo badge (not a photo tile)
w, h = robot.size
side = max(w, h) + 8
canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
ox = (side - w) // 2
oy = (side - h) // 2
canvas.paste(robot, (ox, oy))

px = canvas.load()
cx = cy = (side - 1) / 2.0
r_hard = side * 0.46
r_soft = side * 0.50
for y in range(side):
    for x in range(side):
        r, g, b, a = px[x, y]
        dist = math.hypot(x - cx, y - cy)
        if dist >= r_soft:
            px[x, y] = (0, 0, 0, 0)
        elif dist > r_hard:
            t = 1.0 - (dist - r_hard) / (r_soft - r_hard)
            px[x, y] = (r, g, b, int(a * t))

path = r"d:\junaid\2nd-Projects\bluexche-ai\public\images\assistant-robot.png"
canvas.save(path, optimize=True)
print("saved", path, canvas.size)

# cleanup previews
import os
for name in "abcdefg":
    p = rf"d:\junaid\2nd-Projects\bluexche-ai\public\images\_preview_{name}.png"
    if os.path.exists(p):
        os.remove(p)
print("cleaned previews")
