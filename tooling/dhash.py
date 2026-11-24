#!/usr/bin/env python3
"""dHash for capture drift detection (tooling/refresh.mjs).

  python3 tooling/dhash.py shot.png            -> prints the 256-bit hash
  python3 tooling/dhash.py old.png new.png     -> prints hamming distance (0..256)

Compares only the top 2000px of the full-page captures: the fold + early sections are
where a redesign shows; footer/legal churn shouldn't count as drift.
"""
import sys
from PIL import Image

Image.MAX_IMAGE_PIXELS = 500_000_000
SIZE = 16


def dhash(path):
    im = Image.open(path).convert("L")
    im = im.crop((0, 0, im.width, min(im.height, 2000)))
    im = im.resize((SIZE + 1, SIZE), Image.LANCZOS)
    px = im.load()
    return [px[x, y] > px[x + 1, y] for y in range(SIZE) for x in range(SIZE)]


if len(sys.argv) == 3:
    a, b = dhash(sys.argv[1]), dhash(sys.argv[2])
    print(sum(x != y for x, y in zip(a, b)))
elif len(sys.argv) == 2:
    print("".join("1" if b else "0" for b in dhash(sys.argv[1])))
else:
    sys.exit("usage: dhash.py <png> [<png2>]")
