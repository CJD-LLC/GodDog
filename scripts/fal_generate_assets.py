#!/usr/bin/env python3
"""Generate assets from asset_manifest.json using FAL nano-banana-pro.

- Reads: asset_manifest.json (preferred), else ASSET_SPECIFICATION.md (not parsed here)
- Writes: files into repo paths specified by the manifest
- Writes: art/_manifests/<batch_id>.json provenance

Usage (local):
  export FAL_KEY=...
  python scripts/fal_generate_assets.py --batch 20260116-fullbatch-nanobanana

Usage (CI):
  FAL_KEY comes from GitHub Actions Secret.

Notes:
- This script is intentionally conservative about assumptions on FAL response shapes.
- If your workspace uses a different FAL URL pattern, set FAL_BASE (default https://fal.run).
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import pathlib
import time
from typing import Any, Dict, List, Tuple

import requests

ROOT = pathlib.Path(__file__).resolve().parents[1]
DEFAULT_MANIFEST_PATH = ROOT / "asset_manifest.json"


def utc_now_iso() -> str:
    return dt.datetime.utcnow().replace(microsecond=0).isoformat() + "Z"


def ensure_parent(path: pathlib.Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)


def read_json(path: pathlib.Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def parse_dims(dim_str: str) -> Tuple[int, int]:
    s = dim_str.strip().lower().replace("×", "x")
    if "x" not in s:
        raise ValueError(f"Bad dimensions: {dim_str}")
    w, h = s.split("x", 1)
    return int(w.strip()), int(h.strip())


def fal_headers(fal_key: str) -> Dict[str, str]:
    return {
        "Authorization": f"Key {fal_key}",
        "Content-Type": "application/json",
        "Accept": "application/json",
    }


def call_fal(model: str, prompt: str, fal_key: str, width: int, height: int, transparent: bool) -> Dict[str, Any]:
    base = os.environ.get("FAL_BASE", "https://fal.run").rstrip("/")

    payload = {
        "prompt": prompt,
        "image_size": {"width": width, "height": height},
        "transparent_background": bool(transparent),
        "num_images": 1,
    }

    # Try common endpoint patterns.
    urls = [f"{base}/{model}/run", f"{base}/{model}"]
    last_err: Exception | None = None

    for url in urls:
        try:
            r = requests.post(url, headers=fal_headers(fal_key), json=payload, timeout=180)
            if r.status_code >= 400:
                raise RuntimeError(f"FAL HTTP {r.status_code}: {r.text[:500]}")
            return r.json()
        except Exception as e:
            last_err = e

    raise RuntimeError(f"FAL call failed for {model}: {last_err}")


def first_image_url(result: Dict[str, Any]) -> str:
    # Common shapes
    if "images" in result and isinstance(result["images"], list) and result["images"]:
        img0 = result["images"][0]
        if isinstance(img0, dict) and "url" in img0:
            return img0["url"]
    if "image" in result and isinstance(result["image"], dict) and "url" in result["image"]:
        return result["image"]["url"]
    if "output" in result and isinstance(result["output"], dict):
        out = result["output"]
        if "images" in out and isinstance(out["images"], list) and out["images"]:
            img0 = out["images"][0]
            if isinstance(img0, dict) and "url" in img0:
                return img0["url"]
    raise RuntimeError(f"Cannot find image url in response keys={list(result.keys())}")


def fetch_bytes(url: str) -> bytes:
    r = requests.get(url, timeout=180)
    r.raise_for_status()
    return r.content


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--batch", required=True)
    ap.add_argument("--model", default="fal-ai/nano-banana-pro")
    ap.add_argument("--manifest", default=str(DEFAULT_MANIFEST_PATH))
    ap.add_argument("--limit", type=int, default=0, help="0 = all")
    ap.add_argument("--sleep", type=float, default=0.0)
    args = ap.parse_args()

    fal_key = os.environ.get("FAL_KEY")
    if not fal_key:
        raise SystemExit("Missing FAL_KEY (set as env var or GitHub Actions secret)")

    spec = read_json(pathlib.Path(args.manifest))
    assets = spec.get("assets", spec)
    if not isinstance(assets, list):
        raise SystemExit("asset_manifest.json must be a list, or an object with an 'assets' list")

    if args.limit and args.limit > 0:
        assets = assets[: args.limit]

    batch_id = args.batch
    out_manifest_path = ROOT / "art" / "_manifests" / f"{batch_id}.json"
    ensure_parent(out_manifest_path)

    out_entries: List[Dict[str, Any]] = []

    for i, a in enumerate(assets, start=1):
        out_file = a.get("file") or a.get("path")
        if not out_file:
            raise RuntimeError(f"Asset missing file/path: {a}")

        asset_id = a.get("asset_id") or a.get("id") or pathlib.Path(out_file).stem
        category = a.get("category") or a.get("type") or "unspecified"
        prompt = a.get("prompt", "")
        fmt = (a.get("format") or pathlib.Path(out_file).suffix.lstrip(".") or "png").lower()

        dims = a.get("dimensions") or a.get("size")
        if isinstance(dims, str):
            width, height = parse_dims(dims)
        elif isinstance(dims, dict) and "width" in dims and "height" in dims:
            width, height = int(dims["width"]), int(dims["height"])
        else:
            # fall back; model decides
            width, height = 1024, 1024

        transparent = bool(a.get("transparent", True))

        print(f"[{i}/{len(assets)}] {asset_id} -> {out_file} ({width}x{height})")
        result = call_fal(args.model, prompt, fal_key, width, height, transparent)
        url = first_image_url(result)
        img_bytes = fetch_bytes(url)

        out_path = ROOT / out_file
        ensure_parent(out_path)
        out_path.write_bytes(img_bytes)

        out_entries.append(
            {
                "asset_id": asset_id,
                "filename": pathlib.Path(out_file).name,
                "path": out_file,
                "category": category,
                "dimensions": {"width": width, "height": height},
                "format": fmt,
                "prompt": prompt,
                "model": args.model,
                "seed": result.get("seed"),
                "generated_at": utc_now_iso(),
                "status": "draft",
            }
        )

        if args.sleep:
            time.sleep(args.sleep)

    out_manifest = {"batch_id": batch_id, "created_at": utc_now_iso(), "assets": out_entries}
    out_manifest_path.write_text(json.dumps(out_manifest, indent=2), encoding="utf-8")
    print(f"Wrote manifest: {out_manifest_path}")


if __name__ == "__main__":
    main()
