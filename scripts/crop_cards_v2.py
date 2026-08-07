from PIL import Image
import os

src = r'C:\Users\LENOVO\.cursor\projects\d-junaid-2nd-Projects-bluexche-ai\assets\c__Users_LENOVO_AppData_Roaming_Cursor_User_workspaceStorage_91be83072df34a137fba3c01f932ba1a_images_image-5a53b8e7-07ba-4b94-9255-2194403b1d6f.png'
out = r'd:\junaid\2nd-Projects\bluexche-ai\public\images\portfolio'
os.makedirs(out, exist_ok=True)

im = Image.open(src).convert('RGB')

# Card columns (approx from gutter analysis) - top row of 4
# Image area inside cards: below badge (~268) to above title (~356)
top_img_y0, top_img_y1 = 268, 358

cols_top = [
    ('01-chatbot', 58, 248),
    ('02-document', 286, 500),
    ('03-analytics', 528, 740),
    ('04-content', 756, 960),
]

# Bottom row starts ~484, images ~492-572, then text
bot_img_y0, bot_img_y1 = 492, 575

# Bottom has 3 cards - need to find columns
# From bot regions, cards span differently - let's probe
px = im.load()

def col_brightness(x, y0, y1):
    s = 0
    n = 0
    for y in range(y0, y1):
        r, g, b = px[x, y]
        s += r + g + b
        n += 1
    return s / (n * 3)

print('--- bot col brightness ---')
for x in range(0, 1024, 12):
    print(x, round(col_brightness(x, 500, 570), 1))

# Save candidate crops for tuning
for name, x0, x1 in cols_top:
    crop = im.crop((x0, top_img_y0, x1, top_img_y1))
    crop = crop.resize((crop.width * 2, crop.height * 2), Image.Resampling.LANCZOS)
    crop.save(os.path.join(out, f'trial_{name}.png'))
    print('saved', name, crop.size)

# Hero hexagon visual
hero = im.crop((620, 48, 980, 230))
hero = hero.resize((hero.width * 2, hero.height * 2), Image.Resampling.LANCZOS)
hero.save(os.path.join(out, 'trial_hero.png'))
print('hero', hero.size)
