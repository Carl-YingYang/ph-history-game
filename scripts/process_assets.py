#!/usr/bin/env python3
"""
Process all sprite-sheet JPGs into transparent PNGs + Phaser atlas JSON files.

Input : /tmp/ph-history-game-clone/public/assets/sprites/*.jpg  (988x1024, blue bg)
Output: /home/z/my-project/src/app/assets/<name>.png  (transparent bg)
        /home/z/my-project/src/app/assets/<name>.json (Phaser texture-atlas hash)

The sprite sheets are AI-generated and NON-UNIFORM (frame widths/heights vary per
animation row), so we detect each frame's tight bounding box and emit a per-frame
rectangle atlas. Phaser's `load.atlas()` then slices the sheet exactly — no stretching,
no full-PNG display, pixel-perfect.
"""
import os, json, glob, hashlib
from PIL import Image
import numpy as np

SRC_DIR = "/tmp/ph-history-game-clone/public/assets/sprites"
OUT_DIR = "/home/z/my-project/src/app/assets"

BG = np.array([63, 97, 124], dtype=np.int16)
BG_TOL = 28

ANIM_ORDER = ["idle", "walk", "run", "jump", "attack", "hurt", "dead", "fall", "climb", "jumpattack"]

# Character sheets get full animation registration; others are object/tile collections.
CHARACTER_SHEETS = {
    "rizal", "ibara", "clara", "damaso", "simoun", "salve", "elias",
    "sisa", "basilio", "tiago",
    "student-npc", "villager-npc", "religious-npc", "spanish-npc", "misc-npc",
    "animals-assets",
}

# Exact-duplicate sheets: keep the canonical name, drop the alias.
# (animals.jpg == animals-assets.jpg, etc. — verified by identical file size + md5)
DUPLICATE_ALIASES = {"animals", "buildings", "furniture", "gamedev"}

os.makedirs(OUT_DIR, exist_ok=True)


def is_background(arr):
    return np.all(np.abs(arr.astype(np.int16) - BG) < BG_TOL, axis=-1)


def group_bands(indices, max_gap=3):
    if len(indices) == 0:
        return []
    bands = []
    start = int(indices[0])
    prev = int(indices[0])
    for idx in indices[1:]:
        idx = int(idx)
        if idx - prev > max_gap:
            bands.append((start, prev))
            start = idx
        prev = idx
    bands.append((start, prev))
    return bands


def detect_rows(bg_mask, min_height=18):
    row_bg_frac = np.mean(bg_mask, axis=1)
    content_rows = np.where(row_bg_frac < 0.92)[0]
    bands = group_bands(content_rows, max_gap=4)
    return [(s, e) for s, e in bands if (e - s + 1) >= min_height]


def detect_frames_in_row(bg_mask, y0, y1, min_width=8):
    strip = bg_mask[y0:y1 + 1, :]
    col_bg_frac = np.mean(strip, axis=0)
    content_cols = np.where(col_bg_frac < 0.88)[0]
    bands = group_bands(content_cols, max_gap=4)
    return [(s, e) for s, e in bands if (e - s + 1) >= min_width]


def tighten_bbox(content_mask, x0, x1, y0, y1):
    sub = content_mask[y0:y1 + 1, x0:x1 + 1]
    if not np.any(~sub):
        return None
    ys, xs = np.where(~sub)
    return (x0 + int(xs.min()), y0 + int(ys.min()),
            x0 + int(xs.max()), y0 + int(ys.max()))


def add_frame(frames, fname, x, y, w, h):
    frames[fname] = {
        "frame": {"x": x, "y": y, "w": w, "h": h},
        "rotated": False,
        "trimmed": False,
        "spriteSourceSize": {"x": 0, "y": 0, "w": w, "h": h},
        "sourceSize": {"w": w, "h": h},
    }


def process_sheet(jpg_path):
    name = os.path.splitext(os.path.basename(jpg_path))[0]
    im = Image.open(jpg_path).convert("RGB")
    arr = np.array(im)
    H, W, _ = arr.shape

    bg_mask = is_background(arr)
    content_mask = bg_mask

    # Transparent PNG (background -> alpha 0)
    rgba = np.dstack([arr, np.where(bg_mask, 0, 255).astype(np.uint8)])
    out_png = Image.fromarray(rgba, "RGBA")
    png_path = os.path.join(OUT_DIR, f"{name}.png")
    out_png.save(png_path, optimize=False)

    rows = detect_rows(bg_mask, min_height=18)
    is_character = name in CHARACTER_SHEETS

    frames = {}
    anim_rows = []  # list of (anim_name, [frame_names])

    if is_character:
        # ── Character sheet: portrait header at top, then animation rows ──
        # The portrait is the TALLEST row (h > 90). Everything at or above it is
        # header (title banner + portrait). Animation rows are BELOW it, with
        # height in the anim range (25-90).
        portrait_idx = None
        for i, (s, e) in enumerate(rows):
            if (e - s + 1) > 90:
                portrait_idx = i
                break
        if portrait_idx is None:
            # No tall portrait found — assume first row is header
            portrait_idx = 0

        # Save the portrait as a named frame (single tight bbox of the whole portrait row)
        ps, pe = rows[portrait_idx]
        ptight = tighten_bbox(content_mask, 0, W - 1, ps, pe)
        if ptight:
            add_frame(frames, f"{name}_portrait", ptight[0], ptight[1],
                      ptight[2] - ptight[0] + 1, ptight[3] - ptight[1] + 1)

        # Animation rows = rows below the portrait, with height in [25, 90]
        anim_candidate_rows = []
        for i in range(portrait_idx + 1, len(rows)):
            s, e = rows[i]
            h = e - s + 1
            if 25 <= h <= 95:
                anim_candidate_rows.append((s, e))

        for r_idx, (ry0, ry1) in enumerate(anim_candidate_rows):
            frame_bands = detect_frames_in_row(bg_mask, ry0, ry1, min_width=8)
            row_frame_names = []
            for f_idx, (fx0, fx1) in enumerate(frame_bands):
                tight = tighten_bbox(content_mask, fx0, fx1, ry0, ry1)
                if tight is None:
                    continue
                tx0, ty0, tx1, ty1 = tight
                fw, fh = tx1 - tx0 + 1, ty1 - ty0 + 1
                if fw < 4 or fh < 4:
                    continue
                anim_name = ANIM_ORDER[r_idx] if r_idx < len(ANIM_ORDER) else f"row{r_idx}"
                fname = f"{name}_{anim_name}_{f_idx}"
                add_frame(frames, fname, tx0, ty0, fw, fh)
                row_frame_names.append(fname)
            if row_frame_names:
                anim_name = ANIM_ORDER[r_idx] if r_idx < len(ANIM_ORDER) else f"row{r_idx}"
                anim_rows.append((anim_name, row_frame_names))
    else:
        # ── Environment/object sheet: every detected frame is a reusable tile ──
        for r_idx, (ry0, ry1) in enumerate(rows):
            frame_bands = detect_frames_in_row(bg_mask, ry0, ry1, min_width=8)
            for f_idx, (fx0, fx1) in enumerate(frame_bands):
                tight = tighten_bbox(content_mask, fx0, fx1, ry0, ry1)
                if tight is None:
                    continue
                tx0, ty0, tx1, ty1 = tight
                fw, fh = tx1 - tx0 + 1, ty1 - ty0 + 1
                if fw < 4 or fh < 4:
                    continue
                fname = f"{name}_r{r_idx}_f{f_idx}"
                add_frame(frames, fname, tx0, ty0, fw, fh)

    atlas = {
        "frames": frames,
        "meta": {
            "app": "ph-history-game asset pipeline",
            "image": f"{name}.png",
            "size": {"w": W, "h": H},
            "scale": 1,
        },
    }
    json_path = os.path.join(OUT_DIR, f"{name}.json")
    with open(json_path, "w") as f:
        json.dump(atlas, f, separators=(",", ":"))

    return {
        "name": name,
        "is_character": is_character,
        "rows": len(rows),
        "frames": len(frames),
        "animations": {a: len(fs) for a, fs in anim_rows},
        "png": png_path,
        "json": json_path,
    }


def md5_of(path):
    h = hashlib.md5()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def main():
    jpgs = sorted(glob.glob(os.path.join(SRC_DIR, "*.jpg")))
    # Deduplicate exact-content aliases
    seen_md5 = {}
    kept = []
    for jpg in jpgs:
        name = os.path.splitext(os.path.basename(jpg))[0]
        if name in DUPLICATE_ALIASES:
            continue  # skip known aliases (canonical "-assets" version kept)
        kept.append(jpg)
    print(f"Processing {len(kept)} sprite sheets (deduped from {len(jpgs)})...")
    print("-" * 78)
    summaries = []
    for jpg in kept:
        s = process_sheet(jpg)
        anim_str = ""
        if s["is_character"]:
            anim_str = " | " + " ".join(f"{a}:{n}" for a, n in s["animations"].items())
        print(f"{s['name']:<20} frames={s['frames']:<4}{anim_str}")
        summaries.append(s)
    print("-" * 78)
    print(f"Done. {len(summaries)} sheets -> {OUT_DIR}")

    manifest = {
        "characterSheets": [s["name"] for s in summaries if s["is_character"]],
        "environmentSheets": [s["name"] for s in summaries if not s["is_character"]],
        "animations": {s["name"]: s["animations"] for s in summaries if s["is_character"]},
        "allSheets": [s["name"] for s in summaries],
    }
    with open(os.path.join(OUT_DIR, "manifest.json"), "w") as f:
        json.dump(manifest, f, indent=2)
    print(f"Manifest written: {os.path.join(OUT_DIR, 'manifest.json')}")


if __name__ == "__main__":
    main()
