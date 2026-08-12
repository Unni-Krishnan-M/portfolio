#!/usr/bin/env python3
"""Cut the portrait out of its studio backdrop.

    python3 scripts/portrait-matte.py

Reads  public/img/unni-portrait.jpg   (the raw photograph)
Writes public/img/unni-portrait-cutout.webp (straight alpha, bottom feathered)

The source is a composite: the photographed subject over a synthetic backdrop of
flat white, saturated blue diagonal bands and halftone dot patches. Two facts make
that separable without a segmentation model:

  1. Every backdrop region touches the frame edge, and the subject is one blob.
     So a pixel is background only if its colour matches the backdrop palette AND
     its region connects to the border. Connectivity alone is not enough — walking
     local gradients leaks straight through the subject on a JPEG, because ringing
     and soft folds provide a chain of small steps across every edge.

  2. Blue-minus-red separates the shirt from the bands. Low red does not: the
     shirt's shadowed folds sit at R~24, well inside the bands' R<32. Measured
     over the torso the shirt tops out at B-R ~102, while the navy band runs
     119-126 and the bright blue band 175-189.

Re-run this after replacing the photograph, then update the `width`/`height` and
the `aspect-[...]` box in src/components/sections/about/NeuralPortrait.tsx to the
canvas size printed at the end. The thresholds below are tuned to this backdrop;
a different one will need them re-measured.
"""

import os
import sys

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "public/img/unni-portrait.jpg")
DEST = os.path.join(ROOT, "public/img/unni-portrait-cutout.webp")

# Backdrop palette thresholds. See the module docstring for the measurements.
WHITE_MIN = 200      # near-white paper: every channel above this
LIGHT_MIN = 110      # pale blue stripes are light; the shirt's min channel is ~43
BAND_MAX_RED = 32    # both blue bands are red-starved
BAND_MIN_BMR = 108   # ...and bluer than any part of the shirt

SIDE_MARGIN = 54     # px of empty canvas beside the widest point of the figure
HEAD_ROOM = 70       # px of canvas above the hair
FEATHER_FROM = 0.80  # fraction of canvas height where the bottom fade begins

GRADE = 0.85         # colour-grade strength, 0 disables it entirely


def grade(rgb, s=GRADE):
    """Match the photograph to the site's palette.

    The raw frame is lit warm: skin sits at R-B ~99 and the shirt is a muted
    (37,72,131), both fighting a cool #f7faff page whose only accent is #1261ff.
    This corrects the tungsten cast and pulls the shirt and shadows into that blue
    family. It deliberately leaves his complexion alone: the moves are weighted by
    warmth / blueness / shadow depth rather than applied per-pixel or as a hue
    rotation, and mean skin luminance lands at ~108 against the original ~112, so
    the skin is tonally where it started — what changes is the light on it, not him.
    """
    if not s:
        return rgb
    r, g, b = rgb[..., 0].copy(), rgb[..., 1].copy(), rgb[..., 2].copy()
    lum = 0.2126 * r + 0.7152 * g + 0.0722 * b

    warm = np.clip((r - b) / 120.0, 0, 1)      # skin ~0.81
    blueness = np.clip((b - r) / 120.0, 0, 1)  # shirt ~0.78, hair ~0.22
    shadow = np.clip(1 - lum / 110.0, 0, 1) ** 1.5

    r -= s * 16 * warm                         # neutralise the warm cast
    g -= s * 2 * warm
    b += s * 10 * warm
    r -= s * 4 * blueness                      # shirt toward --color-blue
    g += s * 14 * blueness
    b += s * 46 * blueness
    r -= s * 8 * shadow                        # deep shadows toward --color-deep
    b += s * 12 * shadow

    out = np.clip(np.dstack([r, g, b]), 0, 255)
    # Gentle S-curve on luminance only, so chroma ratios survive untouched.
    t = np.clip((0.2126 * out[..., 0] + 0.7152 * out[..., 1] + 0.0722 * out[..., 2]) / 255, 1e-6, 1)
    curved = t + (t * t * (3 - 2 * t) - t) * (0.22 * s)
    return np.clip(out * (curved / t)[..., None], 0, 255)


def main() -> int:
    rgb = np.asarray(Image.open(SRC).convert("RGB")).astype(np.int16)
    R, G, B = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    mn = rgb.min(axis=2)
    h, w = mn.shape

    near_white = mn > WHITE_MIN
    light_blue = (mn > LIGHT_MIN) & (B > R + 20) & (B - R < BAND_MIN_BMR)
    deep_blue = (R < BAND_MAX_RED) & (B - R > BAND_MIN_BMR)
    palette = near_white | light_blue | deep_blue

    # Keep only palette regions that reach the frame edge. The torso runs off the
    # bottom, so seeding the whole border is safe: the bottom row is background
    # only where the palette already says so.
    border = np.zeros((h, w), bool)
    border[0, :] = border[-1, :] = True
    border[:, 0] = border[:, -1] = True
    lab, _ = ndi.label(palette)
    keep = np.unique(lab[palette & border])
    bg = np.isin(lab, keep[keep > 0])

    # Specular highlights on skin read as near-white but are enclosed by subject,
    # as are the halftone dots inside the white field; hole-filling resolves both.
    subj = ndi.binary_fill_holes(~bg)
    lab, n = ndi.label(subj)
    if n > 1:
        sizes = ndi.sum(np.ones_like(lab), lab, range(1, n + 1))
        subj = lab == int(np.argmax(sizes)) + 1

    frac = subj.mean()
    print(f"subject occupies {frac:.1%} of the frame")
    if not 0.25 < frac < 0.65:
        print(
            f"error: expected roughly 30-50%; the palette thresholds are probably\n"
            f"       wrong for this backdrop. Nothing was written.",
            file=sys.stderr,
        )
        return 1

    # Pull the matte in ~2px so white-contaminated edge pixels get low alpha,
    # then soften what remains.
    disk = np.array(
        [[0, 1, 1, 1, 0], [1, 1, 1, 1, 1], [1, 1, 1, 1, 1], [1, 1, 1, 1, 1], [0, 1, 1, 1, 0]],
        bool,
    )
    core = ndi.binary_erosion(subj, disk, border_value=1)
    alpha = np.clip((ndi.gaussian_filter(core.astype(np.float64), 1.1) - 0.12) / 0.76, 0, 1)

    # Grade only now: the palette thresholds above are measured against the raw
    # frame, so classification has to happen before any colour move.
    graded = grade(rgb.astype(np.float64))
    if GRADE:
        # Report skin over the pre-grade mask, so both readings cover the same
        # pixels. Luminance should stay put; warmth is what is meant to drop.
        skin = subj & (R > G + 18) & (G > B) & (mn > 40) & (
            (0.2126 * R + 0.7152 * G + 0.0722 * B) > 55
        )
        for tag, im in (("before", rgb.astype(np.float64)), ("after ", graded)):
            sr, sg, sb = im[..., 0][skin], im[..., 1][skin], im[..., 2][skin]
            print(
                f"  skin {tag}: ({sr.mean():3.0f},{sg.mean():3.0f},{sb.mean():3.0f})  "
                f"luminance {(0.2126 * sr + 0.7152 * sg + 0.0722 * sb).mean():5.1f}  "
                f"warmth(R-B) {np.median(sr - sb):3.0f}"
            )

    # Bleed subject colour into the transparent region so the browser cannot pull
    # a halo out of unused RGB when it downscales.
    idx = ndi.distance_transform_edt(~core, return_distances=False, return_indices=True)
    bled = graded[idx[0], idx[1]]

    ys, xs = np.where(subj)
    x0 = max(0, xs.min() - SIDE_MARGIN)
    x1 = min(w, xs.max() + SIDE_MARGIN + 1)
    y0 = max(0, ys.min() - HEAD_ROOM)
    out_rgb, out_a = bled[y0:, x0:x1], alpha[y0:, x0:x1]
    ch, cw = out_a.shape

    # The torso is cut off by the frame, so ramp it out with a smoothstep rather
    # than ending on a hard line.
    t = np.clip((np.linspace(0, 1, ch)[:, None] - FEATHER_FROM) / (1 - FEATHER_FROM), 0, 1)
    out_a = out_a * (1 - t * t * (3 - 2 * t))

    rgba = np.dstack([out_rgb, out_a * 255]).round().clip(0, 255).astype(np.uint8)
    Image.fromarray(rgba, "RGBA").save(DEST, "WEBP", quality=92, method=6)

    print(f"wrote {os.path.relpath(DEST, ROOT)}  {cw}x{ch}px  {os.path.getsize(DEST) / 1024:.0f} KB")
    print(f'NeuralPortrait.tsx: width={cw} height={ch}  aspect-[{cw}/{ch}]')
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
