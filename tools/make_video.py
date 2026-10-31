"""Vidéo de fond de la section Contact, fabriquée à partir de photos-brutes/IMG_8715.jpg.

Étapes : fond reconstruit sans le sujet (remplissage par flou normalisé) puis flouté,
sujet détouré (rembg), effet 2.5D (le fond et le sujet bougent en sens opposé),
lent zoom aller-retour, lueur chaude qui balaie, étalonnage bleu / terracotta.
Boucle parfaite de 6 s à 24 i/s, 1280x720. Images écrites dans tools/video-work/frames.
Usage : tools/.venv/Scripts/python tools/make_video.py
"""
import math, os, shutil
import numpy as np
from PIL import Image, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
WORK = os.path.join(HERE, 'video-work')
FR = os.path.join(WORK, 'frames')
W, H, FPS, SEC = 1280, 720, 24, 6
N = FPS * SEC

photo = Image.open(os.path.join(ROOT, 'photos-brutes', 'IMG_8715.jpg')).convert('RGB')
subj = Image.open(os.path.join(WORK, 'subject.png')).convert('RGBA')
alpha = np.asarray(subj.split()[-1], dtype=np.float32) / 255.0

# --- 1. fond sans le sujet : remplissage par flou normalisé (plusieurs échelles) ---
img = np.asarray(photo, dtype=np.float32) / 255.0
hole = np.clip(np.asarray(Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(15)), dtype=np.float32) / 255.0 * 1.6, 0, 1)
keep = 1.0 - hole

def box(a, r):
    """Flou boîte séparable en flottant (3 passes ~ gaussienne)."""
    for _ in range(3):
        for ax in (0, 1):
            p = np.pad(a, [(r + 1, r)] + [(0, 0)] if ax == 0 else [(0, 0), (r + 1, r)], mode='edge') if a.ndim == 2 else \
                np.pad(a, [(r + 1, r), (0, 0), (0, 0)] if ax == 0 else [(0, 0), (r + 1, r), (0, 0)], mode='edge')
            cs = np.cumsum(p, axis=ax)
            a = (np.take(cs, range(2 * r + 1, cs.shape[ax]), axis=ax) - np.take(cs, range(0, cs.shape[ax] - 2 * r - 1), axis=ax)) / (2 * r + 1)
    return a

# du plus large au plus fin : chaque passe affine là où elle a assez d'information
est = None
for r in (120, 60, 30, 14, 6):
    num = box(img * keep[..., None], r)
    den = box(keep, r)[..., None]
    e = num / np.maximum(den, 1e-6)
    if est is None:
        est = e
    else:
        w = np.clip((den - 0.15) * 3, 0, 1)
        est = est * (1 - w) + e * w
filled = img * keep[..., None] + est * (1 - keep[..., None])
bg = Image.fromarray((np.clip(filled, 0, 1) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(13))

# --- 2. étalonnage : ombres vers le bleu de la palette, hautes lumières chaudes ---
def grade(rgb_arr):
    a = rgb_arr.astype(np.float32) / 255.0
    lum = (0.2126 * a[..., 0] + 0.7152 * a[..., 1] + 0.0722 * a[..., 2])[..., None]
    blue = np.array([59, 85, 230], np.float32) / 255.0
    warm = np.array([232, 150, 105], np.float32) / 255.0
    sh = np.clip(1 - lum * 1.8, 0, 1) * 0.22
    hi = np.clip((lum - 0.55) * 2.2, 0, 1) * 0.20
    a = a * (1 - sh) + blue * lum * sh * 1.6
    a = a * (1 - hi) + warm * hi
    a = np.clip((a - 0.5) * 1.06 + 0.5 - 0.02, 0, 1)  # léger contraste
    return (a * 255).astype(np.uint8)

bg = Image.fromarray(grade(np.asarray(bg)))
s_rgb = Image.fromarray(grade(np.asarray(subj.convert('RGB'))))
a_tight = subj.split()[-1].filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.6))  # retire le liseré clair
subj = Image.merge('RGBA', (*s_rgb.split(), a_tight))

# --- 3. plaque de fond en paysage (le fond est flou, on peut l'agrandir) ---
BS = W / photo.width * 1.08                     # échelle de base du fond
bg_big = bg.resize((round(photo.width * BS), round(photo.height * BS)), Image.LANCZOS)
BG_TOP = 150 * BS                                # rangée de la photo d'origine en haut du cadre
bb = subj.getbbox()
subj = subj.crop(bb)
SS = 650 / subj.height                           # le sujet fait environ 650 px de haut
SUBJ_CX = 0.73 * W                               # sujet sur le tiers droit (le texte est à gauche)

def affine_paste(canvas, src, scale, cx, cy, anchor):
    """Colle src mis à l'échelle, point d'ancrage (fraction de src) placé en (cx, cy), avec sous-pixel."""
    ax, ay = anchor[0] * src.width, anchor[1] * src.height
    inv = 1.0 / scale
    # coordonnées source = inv * (dest - (cx,cy)) + (ax,ay)
    m = (inv, 0, ax - inv * cx, 0, inv, ay - inv * cy)
    layer = src.transform((W, H), Image.AFFINE, m, resample=Image.BICUBIC)
    if layer.mode == 'RGBA':
        canvas.alpha_composite(layer)
    else:
        canvas.paste(layer)

glow_base = None
if os.path.isdir(FR):
    shutil.rmtree(FR)
os.makedirs(FR)
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)

for i in range(N):
    t = i / N
    c, s = math.cos(2 * math.pi * t), math.sin(2 * math.pi * t)
    ease = (1 - c) / 2                           # 0 -> 1 -> 0 : boucle sans coupure
    frame = Image.new('RGBA', (W, H))
    # fond : léger zoom + dérive vers la gauche
    bscale = 1.0 + 0.045 * ease
    affine_paste(frame, bg_big.convert('RGBA'), bscale, W / 2 + 16 * s, H / 2 + 4 * c, (0.5, (BG_TOP + H / 2) / bg_big.height))
    # lueur chaude qui balaie le haut de l'image (écran)
    gx = W * (0.30 + 0.30 * ease)
    g = np.exp(-(((xx - gx) / 420) ** 2 + ((yy - 120) / 260) ** 2)) * (0.16 + 0.05 * s)
    warm = np.array([255, 196, 140], np.float32)[None, None, :]
    base = np.asarray(frame, dtype=np.float32)[..., :3]
    base = 255 - (255 - base) * (1 - g[..., None] * warm / 255)
    frame = Image.fromarray(np.clip(base, 0, 255).astype(np.uint8)).convert('RGBA')
    # sujet : zoom plus marqué et dérive opposée = profondeur
    sscale = SS * (1.0 + 0.03 * ease)
    affine_paste(frame, subj, sscale, SUBJ_CX - 9 * s, H + 6, (0.5, 1.0))
    frame.convert('RGB').save(os.path.join(FR, f'f{i:04d}.png'))
print('images :', N, 'dans', FR)
