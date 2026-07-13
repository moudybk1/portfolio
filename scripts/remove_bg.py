"""One-off helper: flood-fill background removal from image edges.

Usage: python3 scripts/remove_bg.py <image.png> [tolerance]
Overwrites the file with a transparent-background version.
"""

import sys
from collections import deque

from PIL import Image


def remove_bg(path: str, tolerance: int = 40) -> None:
    img = Image.open(path).convert("RGBA")
    w, h = img.size
    px = img.load()

    def matches(color, ref):
        return all(abs(color[i] - ref[i]) <= tolerance for i in range(3))

    seen = [[False] * h for _ in range(w)]
    queue = deque()

    for x in range(w):
        for y in (0, h - 1):
            queue.append((x, y, px[x, y]))
    for y in range(h):
        for x in (0, w - 1):
            queue.append((x, y, px[x, y]))

    while queue:
        x, y, ref = queue.popleft()
        if x < 0 or y < 0 or x >= w or y >= h or seen[x][y]:
            continue
        seen[x][y] = True
        color = px[x, y]
        if not matches(color, ref):
            continue
        px[x, y] = (color[0], color[1], color[2], 0)
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            queue.append((x + dx, y + dy, ref))

    img.save(path)
    print(f"done: {path}")


if __name__ == "__main__":
    tol = int(sys.argv[2]) if len(sys.argv) > 2 else 40
    remove_bg(sys.argv[1], tol)
