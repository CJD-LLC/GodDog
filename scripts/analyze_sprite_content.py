#!/usr/bin/env python3
"""Analyze sprite sheets to find where actual content is located."""

import sys
from pathlib import Path
from PIL import Image
import numpy as np

def find_content_bounds(img_path: Path):
    """Find the bounding box of non-transparent content in an image."""
    img = Image.open(img_path)
    
    # Convert to RGBA if not already
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
    
    # Get alpha channel
    alpha = np.array(img)[:, :, 3]
    
    # Find rows and columns with non-transparent pixels
    rows = np.any(alpha > 10, axis=1)
    cols = np.any(alpha > 10, axis=0)
    
    if not rows.any() or not cols.any():
        return None
    
    # Get bounds
    top = np.argmax(rows)
    bottom = len(rows) - np.argmax(rows[::-1])
    left = np.argmax(cols)
    right = len(cols) - np.argmax(cols[::-1])
    
    width = right - left
    height = bottom - top
    
    return {
        'top': int(top),
        'left': int(left),
        'bottom': int(bottom),
        'right': int(right),
        'width': int(width),
        'height': int(height),
        'center_x': int(left + width // 2),
        'center_y': int(top + height // 2)
    }

if __name__ == "__main__":
    img_path = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("assets/sprites/player/idle.png")
    
    img = Image.open(img_path)
    print(f"\nAnalyzing: {img_path.name}")
    print(f"Image size: {img.size}")
    
    bounds = find_content_bounds(img_path)
    if bounds:
        print(f"\nContent bounds:")
        print(f"  Position: ({bounds['left']}, {bounds['top']}) to ({bounds['right']}, {bounds['bottom']})")
        print(f"  Size: {bounds['width']}x{bounds['height']}")
        print(f"  Center: ({bounds['center_x']}, {bounds['center_y']})")
    else:
        print("No content found!")
