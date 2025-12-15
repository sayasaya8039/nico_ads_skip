"""
アイコン生成スクリプト
"""

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    print("Pillowをインストールしてください: pip install Pillow")
    exit(1)

import os

SIZES = [16, 48, 128]

# 赤系（広告ブロックをイメージ）
BG_COLOR = (239, 68, 68)   # #EF4444
TEXT_COLOR = (255, 255, 255)  # 白

def create_icon(size):
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    radius = size // 4
    draw.rounded_rectangle(
        [(0, 0), (size - 1, size - 1)],
        radius=radius,
        fill=BG_COLOR
    )

    # "X" を描画（広告ブロックのイメージ）
    font_size = int(size * 0.6)
    try:
        font = ImageFont.truetype("arial.ttf", font_size)
    except:
        font = ImageFont.load_default()

    text = "X"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    x = (size - text_width) // 2
    y = (size - text_height) // 2 - bbox[1]

    draw.text((x, y), text, fill=TEXT_COLOR, font=font)

    return img

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_dir = os.path.join(script_dir, '..', 'src', 'icons')
    os.makedirs(output_dir, exist_ok=True)

    for size in SIZES:
        icon = create_icon(size)
        output_path = os.path.join(output_dir, f'icon{size}.png')
        icon.save(output_path, 'PNG')
        print(f"生成完了: icon{size}.png")

    print("\nアイコン生成が完了しました")

if __name__ == '__main__':
    main()
