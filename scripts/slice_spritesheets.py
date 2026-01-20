#!/usr/bin/env python3
"""Slice sprite sheets into individual frames.

Reads sprite sheet PNGs and slices them into individual frames based on
the frame dimensions specified in the manifest or command-line arguments.

Usage:
  python scripts/slice_spritesheets.py --input assets/sprites/player/idle.png --frames 4 --output assets/sprites/player/frames/idle/
  python scripts/slice_spritesheets.py --manifest asset_manifest_player_sprites.json --all

Examples:
  # Slice a single sprite sheet
  python scripts/slice_spritesheets.py --input assets/sprites/player/walk.png --frames 8 --frame-width 64 --frame-height 64

  # Slice all sprite sheets from manifest
  python scripts/slice_spritesheets.py --manifest asset_manifest_player_sprites.json --all
"""

from __future__ import annotations

import argparse
import json
import pathlib
from typing import Any, Dict, List

from PIL import Image


ROOT = pathlib.Path(__file__).resolve().parents[1]


def read_json(path: pathlib.Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def parse_dims(dim_str: str) -> tuple[int, int]:
    """Parse dimension string like '256x64' or '512×64'."""
    s = dim_str.strip().lower().replace("×", "x")
    if "x" not in s:
        raise ValueError(f"Bad dimensions: {dim_str}")
    w, h = s.split("x", 1)
    return int(w.strip()), int(h.strip())


def slice_spritesheet(
    input_path: pathlib.Path,
    output_dir: pathlib.Path,
    num_frames: int,
    frame_width: int = None,
    frame_height: int = None,
    horizontal: bool = True,
    padding: int = 0,
) -> List[pathlib.Path]:
    """Slice a sprite sheet into individual frames.
    
    Args:
        input_path: Path to the sprite sheet image
        output_dir: Directory to save individual frames
        num_frames: Number of frames in the sprite sheet
        frame_width: Width of each frame (auto-detect if None)
        frame_height: Height of each frame (auto-detect if None)
        horizontal: True if frames are arranged horizontally, False for vertical
        padding: Padding between frames in pixels
        
    Returns:
        List of paths to the saved frame images
    """
    output_dir.mkdir(parents=True, exist_ok=True)
    
    img = Image.open(input_path)
    sheet_width, sheet_height = img.size
    
    # Auto-detect frame dimensions if not provided
    if horizontal:
        if frame_width is None:
            frame_width = (sheet_width + padding) // num_frames - padding
        if frame_height is None:
            frame_height = sheet_height
    else:
        if frame_width is None:
            frame_width = sheet_width
        if frame_height is None:
            frame_height = (sheet_height + padding) // num_frames - padding
    
    print(f"Slicing {input_path.name}:")
    print(f"  Sheet size: {sheet_width}x{sheet_height}")
    print(f"  Frame size: {frame_width}x{frame_height}")
    print(f"  Frames: {num_frames}")
    print(f"  Layout: {'horizontal' if horizontal else 'vertical'}")
    
    saved_paths = []
    
    for i in range(num_frames):
        if horizontal:
            left = i * (frame_width + padding)
            top = 0
            right = left + frame_width
            bottom = frame_height
        else:
            left = 0
            top = i * (frame_height + padding)
            right = frame_width
            bottom = top + frame_height
        
        # Extract frame
        frame = img.crop((left, top, right, bottom))
        
        # Save frame
        frame_filename = f"frame_{i:03d}.png"
        frame_path = output_dir / frame_filename
        frame.save(frame_path)
        saved_paths.append(frame_path)
        
        print(f"  Frame {i+1}/{num_frames}: {frame_filename} ({left},{top},{right},{bottom})")
    
    return saved_paths


def process_from_manifest(manifest_path: pathlib.Path, output_base: pathlib.Path = None) -> None:
    """Process all sprite sheets defined in a manifest file.
    
    Args:
        manifest_path: Path to the asset manifest JSON
        output_base: Base directory for output (default: assets/sprites/frames/)
    """
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
        
        # Extract sprite name (e.g., "player_idle" -> "idle", "player_attack_1" -> "attack_1")
        # Handle both "player_idle" and "player_attack_1" formats
        if "attack" in asset_id:
            # For attack animations, keep the full attack_N naming
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
        
        # Create output directory based on asset structure
        # e.g., assets/sprites/player/idle.png -> assets/sprites/frames/player/idle/
        parts = pathlib.Path(file_path).parts
        if "player" in parts:
            output_dir = output_base / "player" / sprite_name
        elif "enemies" in parts:
            enemy_type = parts[parts.index("enemies") + 1] if len(parts) > parts.index("enemies") + 1 else "unknown"
            output_dir = output_base / "enemies" / enemy_type / sprite_name
        else:
            output_dir = output_base / sprite_name
        
        print(f"\n{'='*60}")
        slice_spritesheet(
            input_path=input_path,
            output_dir=output_dir,
            num_frames=config["frames"],
            frame_width=config["frame_width"],
            frame_height=config["frame_height"],
            horizontal=True,
            padding=0,
        )
    
    print(f"\n{'='*60}")
    print(f"All frames saved to: {output_base}")


def main() -> None:
    ap = argparse.ArgumentParser(description="Slice sprite sheets into individual frames")
    ap.add_argument("--input", type=str, help="Input sprite sheet image")
    ap.add_argument("--output", type=str, help="Output directory for frames")
    ap.add_argument("--frames", type=int, help="Number of frames")
    ap.add_argument("--frame-width", type=int, help="Width of each frame (auto-detect if omitted)")
    ap.add_argument("--frame-height", type=int, help="Height of each frame (auto-detect if omitted)")
    ap.add_argument("--padding", type=int, default=0, help="Padding between frames")
    ap.add_argument("--vertical", action="store_true", help="Frames arranged vertically (default: horizontal)")
    ap.add_argument("--manifest", type=str, help="Process all sprites from manifest JSON")
    ap.add_argument("--all", action="store_true", help="Process all sprites when using --manifest")
    ap.add_argument("--output-base", type=str, help="Base output directory (default: assets/sprites/frames/)")
    
    args = ap.parse_args()
    
    if args.manifest and args.all:
        # Process from manifest
        manifest_path = pathlib.Path(args.manifest)
        output_base = pathlib.Path(args.output_base) if args.output_base else None
        process_from_manifest(manifest_path, output_base)
    
    elif args.input and args.output and args.frames:
        # Process single sprite sheet
        input_path = pathlib.Path(args.input)
        output_dir = pathlib.Path(args.output)
        
        slice_spritesheet(
            input_path=input_path,
            output_dir=output_dir,
            num_frames=args.frames,
            frame_width=args.frame_width,
            frame_height=args.frame_height,
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
