#!/usr/bin/env python3
"""Per-frame content-aware sprite sheet slicer.

This version detects the actual content bounds for EACH individual frame
rather than assuming uniform spacing across the sheet.
"""

from __future__ import annotations

import argparse
import json
import pathlib
from typing import Any, Dict, List, Tuple

import numpy as np
from PIL import Image


ROOT = pathlib.Path(__file__).resolve().parents[1]


def read_json(path: pathlib.Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def find_frame_content_bounds(
    img: Image.Image,
    frame_index: int,
    num_frames: int,
    horizontal: bool = True,
    alpha_threshold: int = 10
) -> Tuple[int, int, int, int]:
    """Find content bounds for a specific frame within the sprite sheet.
    
    Args:
        img: The full sprite sheet image
        frame_index: Which frame to analyze (0-indexed)
        num_frames: Total number of frames in the sheet
        horizontal: True if frames are arranged horizontally
        alpha_threshold: Minimum alpha value to consider as content
        
    Returns:
        (left, top, right, bottom) bounding box in absolute image coordinates
    """
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
    
    width, height = img.size
    
    # Calculate the expected frame area
    if horizontal:
        frame_width = width // num_frames
        frame_left = frame_index * frame_width
        frame_right = (frame_index + 1) * frame_width
        frame_top = 0
        frame_bottom = height
    else:
        frame_height = height // num_frames
        frame_left = 0
        frame_right = width
        frame_top = frame_index * frame_height
        frame_bottom = (frame_index + 1) * frame_height
    
    # Extract alpha channel for this frame's region
    alpha = np.array(img)[frame_top:frame_bottom, frame_left:frame_right, 3]
    
    # Find content within this frame
    rows = np.any(alpha > alpha_threshold, axis=1)
    cols = np.any(alpha > alpha_threshold, axis=0)
    
    if not rows.any() or not cols.any():
        # No content in this frame, return the full frame area
        return (frame_left, frame_top, frame_right, frame_bottom)
    
    # Get relative bounds within the frame
    rel_top = int(np.argmax(rows))
    rel_bottom = int(len(rows) - np.argmax(rows[::-1]))
    rel_left = int(np.argmax(cols))
    rel_right = int(len(cols) - np.argmax(cols[::-1]))
    
    # Convert to absolute coordinates
    abs_left = frame_left + rel_left
    abs_top = frame_top + rel_top
    abs_right = frame_left + rel_right
    abs_bottom = frame_top + rel_bottom
    
    return (abs_left, abs_top, abs_right, abs_bottom)


def slice_spritesheet_perframe(
    input_path: pathlib.Path,
    output_dir: pathlib.Path,
    num_frames: int,
    target_frame_width: int = 64,
    target_frame_height: int = 64,
    horizontal: bool = True,
) -> List[pathlib.Path]:
    """Slice sprite sheet with per-frame content detection.
    
    Each frame's content is detected independently and centered in the output.
    """
    output_dir.mkdir(parents=True, exist_ok=True)
    
    img = Image.open(input_path)
    sheet_width, sheet_height = img.size
    
    print(f"Slicing {input_path.name}:")
    print(f"  Sheet size: {sheet_width}x{sheet_height}")
    print(f"  Target frame size: {target_frame_width}x{target_frame_height}")
    print(f"  Frames: {num_frames} ({'horizontal' if horizontal else 'vertical'})")
    
    saved_paths = []
    
    for i in range(num_frames):
        # Find this specific frame's content bounds
        left, top, right, bottom = find_frame_content_bounds(
            img, i, num_frames, horizontal
        )
        
        content_width = right - left
        content_height = bottom - top
        
        # Extract the content
        frame_content = img.crop((left, top, right, bottom))
        
        # Create output frame with transparent background
        output_frame = Image.new('RGBA', (target_frame_width, target_frame_height), (0, 0, 0, 0))
        
        # Calculate scale to fit content in target size
        scale = min(
            target_frame_width / content_width,
            target_frame_height / content_height,
            1.0  # Don't scale up
        )
        
        if scale < 1.0:
            # Scale down to fit
            new_width = int(content_width * scale)
            new_height = int(content_height * scale)
            frame_content = frame_content.resize(
                (new_width, new_height),
                Image.Resampling.LANCZOS  # Better quality for downscaling
            )
        else:
            new_width = content_width
            new_height = content_height
        
        # Center the content in the output frame
        paste_x = (target_frame_width - new_width) // 2
        paste_y = (target_frame_height - new_height) // 2
        
        # Ensure frame_content is RGBA
        if frame_content.mode != 'RGBA':
            frame_content = frame_content.convert('RGBA')
        
        output_frame.paste(frame_content, (paste_x, paste_y), frame_content.split()[3])
        
        # Save frame
        frame_filename = f"frame_{i:03d}.png"
        frame_path = output_dir / frame_filename
        output_frame.save(frame_path)
        saved_paths.append(frame_path)
        
        print(f"  Frame {i+1}/{num_frames}: {frame_filename}")
        print(f"    Source bounds: ({left},{top},{right},{bottom}) = {content_width}x{content_height}")
        print(f"    Scaled to: {new_width}x{new_height}, centered at ({paste_x},{paste_y})")
    
    return saved_paths


def process_from_manifest(manifest_path: pathlib.Path, output_base: pathlib.Path = None) -> None:
    """Process all sprite sheets from manifest with per-frame detection."""
    if output_base is None:
        output_base = ROOT / "assets" / "sprites" / "frames"
    
    manifest = read_json(manifest_path)
    assets = manifest.get("assets", [])
    
    # GodDog spec frame configurations
    sprite_configs = {
        "idle": {"frames": 4, "frame_width": 64, "frame_height": 64},
        "walk": {"frames": 8, "frame_width": 64, "frame_height": 64},
        "attack_1": {"frames": 4, "frame_width": 64, "frame_height": 64},
        "attack_2": {"frames": 4, "frame_width": 64, "frame_height": 64},
        "attack_3": {"frames": 5, "frame_width": 64, "frame_height": 64},
        "dodge": {"frames": 6, "frame_width": 64, "frame_height": 64},
        "hurt": {"frames": 2, "frame_width": 64, "frame_height": 64},
        "death": {"frames": 6, "frame_width": 64, "frame_height": 64},
    }
    
    for asset in assets:
        asset_id = asset.get("asset_id") or asset.get("id")
        file_path = asset.get("file") or asset.get("path")
        
        if not asset_id or not file_path:
            continue
        
        # Extract sprite name
        if "attack" in asset_id:
            parts = asset_id.split("_")
            sprite_name = "_".join(parts[-2:]) if len(parts) >= 2 else parts[-1]
        else:
            sprite_name = asset_id.split("_")[-1]
        
        if sprite_name not in sprite_configs:
            print(f"Skipping {asset_id} - no config found")
            continue
        
        config = sprite_configs[sprite_name]
        input_path = ROOT / file_path
        
        if not input_path.exists():
            print(f"Warning: {input_path} not found, skipping")
            continue
        
        # Determine output directory
        parts = pathlib.Path(file_path).parts
        if "player" in parts:
            output_dir = output_base / "player" / sprite_name
        elif "enemies" in parts:
            enemy_type = parts[parts.index("enemies") + 1]
            output_dir = output_base / "enemies" / enemy_type / sprite_name
        else:
            output_dir = output_base / sprite_name
        
        print(f"\n{'='*60}")
        slice_spritesheet_perframe(
            input_path=input_path,
            output_dir=output_dir,
            num_frames=config["frames"],
            target_frame_width=config["frame_width"],
            target_frame_height=config["frame_height"],
            horizontal=True,
        )
    
    print(f"\n{'='*60}")
    print(f"All frames saved to: {output_base}")


def main() -> None:
    ap = argparse.ArgumentParser(description="Per-frame content-aware sprite slicer")
    ap.add_argument("--input", type=str, help="Input sprite sheet")
    ap.add_argument("--output", type=str, help="Output directory")
    ap.add_argument("--frames", type=int, help="Number of frames")
    ap.add_argument("--frame-width", type=int, default=64)
    ap.add_argument("--frame-height", type=int, default=64)
    ap.add_argument("--vertical", action="store_true")
    ap.add_argument("--manifest", type=str, help="Process from manifest")
    ap.add_argument("--all", action="store_true")
    ap.add_argument("--output-base", type=str)
    
    args = ap.parse_args()
    
    if args.manifest and args.all:
        manifest_path = pathlib.Path(args.manifest)
        output_base = pathlib.Path(args.output_base) if args.output_base else None
        process_from_manifest(manifest_path, output_base)
    
    elif args.input and args.output and args.frames:
        input_path = pathlib.Path(args.input)
        output_dir = pathlib.Path(args.output)
        
        slice_spritesheet_perframe(
            input_path=input_path,
            output_dir=output_dir,
            num_frames=args.frames,
            target_frame_width=args.frame_width,
            target_frame_height=args.frame_height,
            horizontal=not args.vertical,
        )
        
        print(f"\nFrames saved to: {output_dir}")
    
    else:
        ap.print_help()
        return 1
    
    return 0


if __name__ == "__main__":
    exit(main())
