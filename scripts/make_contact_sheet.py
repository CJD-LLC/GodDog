#!/usr/bin/env python3
"""Create a contact sheet PNG for a batch manifest.

Reads: art/_manifests/<batch_id>.json
Writes:
  art/_previews/<batch_id>/contact_sheet.png
  art/_previews/<batch_id>/README.md
"""

from __future__ import annotations

import argparse
import json
import math
import pathlib
from typing import Any, Dict, List

from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = pathlib.Path(__file__).resolve().parents[1]


def read_json(path: pathlib.Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--batch", required=True)
    ap.add_argument("--thumb", type=int, default=192)
    ap.add_argument("--cols", type=int, default=6)
    args = ap.parse_args()

    batch = args.batch
    mpath = ROOT / "art" / "_manifests" / f"{batch}.json"
    m = read_json(mpath)
    assets: List[Dict[str, Any]] = m.get("assets", [])

    cols = max(1, args.cols)
    rows = max(1, int(math.ceil(len(assets) / cols)))
    pad = 12
    label_h = 34
    tw = args.thumb
    th = args.thumb

    sheet_w = pad + cols * (tw + pad)
    sheet_h = pad + rows * (th + label_h + pad)

    sheet = Image.new("RGBA", (sheet_w, sheet_h), (18, 18, 20, 255))
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.load_default()

    for i, a in enumerate(assets):
        r = i // cols
        c = i % cols
        x = pad + c * (tw + pad)
        y = pad + r * (th + label_h + pad)

        p = a.get("path")
        aid = a.get("asset_id", "asset")
        if not p:
            continue
        img_path = ROOT / p
        if not img_path.exists():
            continue

        im = Image.open(img_path).convert("RGBA")
        im = ImageOps.contain(im, (tw, th))
        thumb = Image.new("RGBA", (tw, th), (0, 0, 0, 0))
        thumb.paste(im, ((tw - im.size[0]) // 2, (th - im.size[1]) // 2))
        sheet.alpha_composite(thumb, (x, y))
        draw.text((x, y + th + 6), aid[:28], fill=(235, 235, 235, 255), font=font)

    out_dir = ROOT / "art" / "_previews" / batch
    out_dir.mkdir(parents=True, exist_ok=True)
    out_png = out_dir / "contact_sheet.png"
    sheet.save(out_png, "PNG")

    (out_dir / "README.md").write_text(
        f"# Preview: {batch}\n\nAssets: {len(assets)}\n\nReview this contact sheet for style/consistency and obvious issues (wrong background, wrong framing, etc.).\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
