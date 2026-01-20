#!/usr/bin/env python3
"""Smart sprite sheet slicer that finds and centers on actual content.

This version analyzes the sprite sheet to find where the actual pixel art
content is located (ignoring transparent borders) and extracts frames from
the content area rather than assuming top-left positioning.
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


def find_content_bounds(img: Image.Image, alpha_threshold: int = 10) -> Tuple[int, int, int, int]:
    """Find bounding box of non-transparent content.
    
    Returns:
        (left, top, right, bottom) bounding box
    """
    # Convert to RGBA if needed
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
    
    # Get alpha channel
    alpha = np.array(img)[:, :, 3]
    
    # Find rows and columns with visible pixels
    rows = np.any(alpha > alpha_threshold, axis=1)
    cols = np.any(alpha > alpha_threshold, axis=0)
    
    if not rows.any() or not cols.any():
        # No content found, return full image bounds
        return (0, 0, img.width, img.height)
    
    top = int(np.argmax(rows))
    bottom = int(len(rows) - np.argmax(rows[::-1]))
    left = int(np.argmax(cols))
    right = int(len(cols) - np.argmax(cols[::-1]))
    
    return (left, top, right, bottom)


def slice_spritesheet_smart(
    input_path: pathlib.Path,
    output_dir: pathlib.Path,
    num_frames: int,
    target_frame_width: int = 64,
    target_frame_height: int = 64,
    horizontal: bool = True,
    padding: int = 0,
) -> List[pathlib.Path]:
    """Intelligently slice a sprite sheet by finding actual content.
    
    This function:
    1. Finds the bounding box of actual sprite content
    2. Divides that content area into frames
    3. Extracts and centers each frame in the target size
    
    Args:
        input_path: Path to the sprite sheet image
        output_dir: Directory to save individual frames
        num_frames: Number of frames in the sprite sheet
        target_frame_width: Desired width of output frames
        target_frame_height: Desired height of output frames
        horizontal: True if frames are arranged horizontally
        padding: Padding between frames in pixels
        
    Returns:
        List of paths to the saved frame images
    """
    output_dir.mkdir(parents=True, exist_ok=True)
    
    img = Image.open(input_path)
    sheet_width, sheet_height = img.size
    
    # Find the actual content bounds
    left, top, right, bottom = find_content_bounds(img)
    content_width = right - left
    content_height = bottom - top
    
    print(f"Slicing {input_path.name}:")
    print(f"  Sheet size: {sheet_width}x{sheet_height}")
    print(f"  Content area: ({left},{top}) to ({right},{bottom}) = {content_width}x{content_height}")
    
    # Calculate frame size from content area
    if horizontal:
        source_frame_width = content_width // num_frames
        source_frame_height = content_height
    else:
        source_frame_width = content_width
        source_frame_height = content_height // num_frames
    
    print(f"  Source frame size: {source_frame_width}x{source_frame_height}")
    print(f"  Target frame size: {target_frame_width}x{target_frame_height}")
    print(f"  Frames: {num_frames} ({'horizontal' if horizontal else 'vertical'})")
    
    saved_paths = []
    
    for i in range(num_frames):
        # Calculate position within content area
        if horizontal:
            frame_left = left + i * source_frame_width
            frame_top = top
            frame_right = frame_left + source_frame_width
            frame_bottom = bottom
        else:
            frame_left = left
            frame_top = top + i * source_frame_height
            frame_right = right
            frame_bottom = frame_top + source_frame_height
        
        # Extract frame from content area
        frame = img.crop((frame_left, frame_top, frame_right, frame_bottom))
        
        # Create new image with target size and transparent background
        output_frame = Image.new('RGBA', (target_frame_width, target_frame_height), (0, 0, 0, 0))
        
        # Calculate position to center the content in the output frame
        # Scale if needed to fit
        scale = min(
            target_frame_width / source_frame_width,
            target_frame_height / source_frame_height
        )
        
        if scale < 1.0:
            # Need to scale down
            new_width = int(source_frame_width * scale)
            new_height = int(source_frame_height * scale)
            frame = frame.resize((new_width, new_height), Image.Resampling.NEAREST)
        else:
            # No scaling needed, use original size
            new_width = source_frame_width
            new_height = source_frame_height
        
        # Center the frame
        paste_x = (target_frame_width - new_width) // 2
        paste_y = (target_frame_height - new_height) // 2
        
        output_frame.paste(frame, (paste_x, paste_y), frame if frame.mode == 'RGBA' else None)
        
        # Save frame
        frame_filename = f"frame_{i:03d}.png"
        frame_path = output_dir / frame_filename
        output_frame.save(frame_path)
        saved_paths.append(frame_path)
        
        print(f"  Frame {i+1}/{num_frames}: {frame_filename} (source: {frame_left},{frame_top},{frame_right},{frame_bottom} → centered in {target_frame_width}x{target_frame_height})")
    
    return saved_paths


def process_from_manifest(manifest_path: pathlib.Path, output_base: pathlib.Path = None) -> None:
    """Process all sprite sheets defined in a manifest file."""
    if output_base is None:
        output_base = ROOT / "assets" / "sprites" / "frames"
    
    manifest = read_json(manifest_path)
    assets = manifest.get("assets", [])
    
    # Define frame counts based on GodDog spec
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
            print(f"Skipping {asset_id} - no frame config found")
            continue
        
        config = sprite_configs[sprite_name]
        input_path = ROOT / file_path
        
        if not input_path.exists():
            print(f"Warning: {input_path} does not exist, skipping")
            continue
        
        # Create output directory
        parts = pathlib.Path(file_path).parts
        if "player" in parts:
            output_dir = output_base / "player" / sprite_name
        elif "enemies" in parts:
            enemy_type = parts[parts.index("enemies") + 1] if len(parts) > parts.index("enemies") + 1 else "unknown"
            output_dir = output_base / "enemies" / enemy_type / sprite_name
        else:
            output_dir = output_base / sprite_name
        
        print(f"\n{'='*60}")
        slice_spritesheet_smart(
            input_path=input_path,
            output_dir=output_dir,
            num_frames=config["frames"],
            target_frame_width=config["frame_width"],
            target_frame_height=config["frame_height"],
            horizontal=True,
            padding=0,
        )
    
    print(f"\n{'='*60}")
    print(f"All frames saved to: {output_base}")


def main() -> None:
    ap = argparse.ArgumentParser(description="Smart sprite sheet slicer with content detection")
    ap.add_argument("--input", type=str, help="Input sprite sheet image")
    ap.add_argument("--output", type=str, help="Output directory for frames")
    ap.add_argument("--frames", type=int, help="Number of frames")
    ap.add_argument("--frame-width", type=int, default=64, help="Target width of each frame")
    ap.add_argument("--frame-height", type=int, default=64, help="Target height of each frame")
    ap.add_argument("--padding", type=int, default=0, help="Padding between frames")
    ap.add_argument("--vertical", action="store_true", help="Frames arranged vertically")
    ap.add_argument("--manifest", type=str, help="Process all sprites from manifest JSON")
    ap.add_argument("--all", action="store_true", help="Process all sprites when using --manifest")
    ap.add_argument("--output-base", type=str, help="Base output directory")
    
    args = ap.parse_args()
    
    if args.manifest and args.all:
        manifest_path = pathlib.Path(args.manifest)
        output_base = pathlib.Path(args.output_base) if args.output_base else None
        process_from_manifest(manifest_path, output_base)
    
    elif args.input and args.output and args.frames:
        input_path = pathlib.Path(args.input)
        output_dir = pathlib.Path(args.output)
        
        slice_spritesheet_smart(
            input_path=input_path,
            output_dir=output_dir,
            num_frames=args.frames,
            target_frame_width=args.frame_width,
            target_frame_height=args.frame_height,
            horizontal=not args.vertical,
            padding=args.padding,
        )
        
        print(f"\nFrames saved to: {output_dir}")
    
    else:
        ap.print_help()
        print("\nError: Either provide --manifest with --all, or provide --input, --output, and --frames")
        return 1
    
    return 0


if __name__ == "__main__":
    exit(main())
