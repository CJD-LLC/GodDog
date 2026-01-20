#!/usr/bin/env python3
"""Visualize sprite sheet layout to understand frame positioning."""

import sys
from pathlib import Path
from PIL import Image, ImageDraw
import numpy as np

def analyze_frame_content(img_path: Path, num_frames: int):
    """Analyze where actual content is in each expected frame."""
    img = Image.open(img_path)
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
    
    width, height = img.size
    frame_width = width // num_frames
    
    print(f"\nAnalyzing: {img_path.name}")
    print(f"Image: {width}x{height}")
    print(f"Expected {num_frames} frames of {frame_width}x{height} each")
    print(f"\nPer-frame analysis:")
    
    alpha = np.array(img)[:, :, 3]
    
    for i in range(num_frames):
        frame_left = i * frame_width
        frame_right = (i + 1) * frame_width
        
        # Get this frame's alpha data
        frame_alpha = alpha[:, frame_left:frame_right]
        
        # Find content bounds within this frame
        rows = np.any(frame_alpha > 10, axis=1)
        cols = np.any(frame_alpha > 10, axis=0)
        
        if rows.any() and cols.any():
            top = int(np.argmax(rows))
            bottom = int(len(rows) - np.argmax(rows[::-1]))
            left = int(np.argmax(cols))
            right = int(len(cols) - np.argmax(cols[::-1]))
            
            content_width = right - left
            content_height = bottom - top
            
            # Absolute coordinates
            abs_left = frame_left + left
            abs_right = frame_left + right
            
            print(f"  Frame {i}: content at ({left},{top}) to ({right},{bottom}) = {content_width}x{content_height}")
            print(f"           absolute: ({abs_left},{top}) to ({abs_right},{bottom})")
        else:
            print(f"  Frame {i}: NO CONTENT")

def visualize_frames(img_path: Path, num_frames: int, output_path: Path = None):
    """Create a visualization showing frame boundaries and content."""
    img = Image.open(img_path)
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
    
    # Create a copy to draw on
    vis = img.copy()
    draw = ImageDraw.Draw(vis)
    
    width, height = img.size
    frame_width = width // num_frames
    
    # Draw frame boundaries
    for i in range(num_frames + 1):
        x = i * frame_width
        draw.line([(x, 0), (x, height)], fill=(255, 0, 0, 255), width=2)
    
    # Find and draw content bounds for each frame
    alpha = np.array(img)[:, :, 3]
    
    for i in range(num_frames):
        frame_left = i * frame_width
        frame_right = (i + 1) * frame_width
        
        frame_alpha = alpha[:, frame_left:frame_right]
        rows = np.any(frame_alpha > 10, axis=1)
        cols = np.any(frame_alpha > 10, axis=0)
        
        if rows.any() and cols.any():
            top = int(np.argmax(rows))
            bottom = int(len(rows) - np.argmax(rows[::-1]))
            left = int(np.argmax(cols))
            right = int(len(cols) - np.argmax(cols[::-1]))
            
            # Draw content bounding box (in green)
            abs_left = frame_left + left
            abs_right = frame_left + right
            
            draw.rectangle(
                [(abs_left, top), (abs_right, bottom)],
                outline=(0, 255, 0, 255),
                width=2
            )
    
    if output_path:
        vis.save(output_path)
        print(f"\nVisualization saved to: {output_path}")
    
    return vis

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python visualize_sprite_layout.py <image_path> <num_frames> [output_path]")
        sys.exit(1)
    
    img_path = Path(sys.argv[1])
    num_frames = int(sys.argv[2])
    output_path = Path(sys.argv[3]) if len(sys.argv) > 3 else None
    
    analyze_frame_content(img_path, num_frames)
    
    if output_path or True:  # Always create visualization
        if not output_path:
            output_path = img_path.parent / f"{img_path.stem}_visualization.png"
        visualize_frames(img_path, num_frames, output_path)
