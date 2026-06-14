import sys
from PIL import Image

def make_background_transparent(image_path, output_path, threshold=235):
    img = Image.open(image_path).convert("RGBA")
    width, height = img.size
    pixels = list(img.getdata())
    
    # 探索用のキュー
    queue = []
    visited = [False] * (width * height)
    
    # 外周のピクセルをキューに追加
    for x in range(width):
        queue.append((x, 0))
        visited[0 * width + x] = True
        queue.append((x, height - 1))
        visited[(height - 1) * width + x] = True
    for y in range(1, height - 1):
        queue.append((0, y))
        visited[y * width + 0] = True
        queue.append((width - 1, y))
        visited[y * width + (width - 1)] = True
        
    dx = [-1, 1, 0, 0, -1, -1, 1, 1]
    dy = [0, 0, -1, 1, -1, 1, -1, 1]
    
    # 背景ピクセルをマークして透明にする
    head = 0
    while head < len(queue):
        x, y = queue[head]
        head += 1
        
        idx = y * width + x
        r, g, b, a = pixels[idx]
        
        # 白に近いかどうか判定（輝度またはRGBの平均値）
        # JPEGの圧縮ノイズを考慮して少し余裕を持たせる
        is_white = (r > threshold and g > threshold and b > threshold) or ((r + g + b) / 3.0 > threshold)
        
        if is_white:
            # 透明にする
            pixels[idx] = (r, g, b, 0)
            
            for i in range(8):
                nx, ny = x + dx[i], y + dy[i]
                if 0 <= nx < width and 0 <= ny < height:
                    nidx = ny * width + nx
                    if not visited[nidx]:
                        visited[nidx] = True
                        queue.append((nx, ny))
        else:
            # 白くない境界部分は、白に近さに応じてアルファ値を設定（アンチエイリアス）
            avg = (r + g + b) / 3.0
            if avg > threshold - 30:
                # 境界部分のなめらかな透過
                alpha = int(255 * (1.0 - (avg - (threshold - 30)) / 30.0))
                alpha = max(0, min(255, alpha))
                pixels[idx] = (r, g, b, alpha)
                
    img.putdata(pixels)
    img.save(output_path, "PNG")
    print(f"Successfully converted and saved to {output_path}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python3 make_transparent.py input_path output_path [threshold]")
        sys.exit(1)
    input_path = sys.argv[1]
    output_path = sys.argv[2]
    threshold = int(sys.argv[3]) if len(sys.argv) > 3 else 235
    make_background_transparent(input_path, output_path, threshold)
