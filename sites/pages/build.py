#!/usr/bin/env python3
"""Build the exemplar directory site (deployed at taste.extant.cc).

Reads every exemplar's frontmatter from the taste corpus, transcodes the
desktop + mobile captures to lazy WebP, and emits a static index.html plus an
inline JSON blob the lightbox reads. Re-runnable; idempotent (orphaned webp
output from removed exemplars is cleaned up).

Deploy runs should pass --strict (or PAGES_STRICT=1): the build then FAILS
instead of silently shipping a partial/empty site when screenshots are missing
or an exemplar's frontmatter doesn't parse.

Source of truth lives here in the repo (sites/pages/{build.py,css,js}); the
generated output (index.html, data.json, img/) is git-ignored because img/ is
derived from the corpus screenshots, which are private references and not
redistributed (see repo .gitignore).

  # build in place (into this dir) — for local preview
  python3 sites/pages/build.py
  # deploy: build straight into the live web root (also copies css/ + js/)
  PAGES_OUT=/var/www/sites/pages python3 sites/pages/build.py

Design sources (web-design-taste / production corpus):
  - "Real product UI is the hero" -> the screenshots ARE the content, framed
    with hairline + whisper shadow (embedded-product-frame / os-shell-window-frame).
  - "A repeated unit anatomy is the legibility mechanism for dense grids"
    (every, posthog) -> one rigid card recipe, scan the rest.
  - "Hierarchy from scale + typographic-role-split" -> serif voice (masthead),
    sans chrome, mono metadata (mono-label-metadata).
  - "Discipline is the aesthetic" -> warm near-monochrome field; the captures
    carry every pixel of colour.
"""
import html, json, os, shutil, sys
from pathlib import Path
from PIL import Image

# Full-page captures of very tall sites exceed PIL's default ~89MP bomb guard.
# Raise it to a sane ceiling (1440px-wide x ~340k px tall) instead of disabling
# it outright — the pipeline will eventually transcode third-party images.
Image.MAX_IMAGE_PIXELS = 500_000_000

STRICT = "--strict" in sys.argv or os.environ.get("PAGES_STRICT") == "1"
# Text-only mode: build every exemplar as a card WITHOUT screenshots, and never
# publish a capture even if one is present locally. The public deploy uses this:
# captures are pictures of other people's sites and stay private.
NO_SHOTS = "--no-shots" in sys.argv or os.environ.get("PAGES_NO_SHOTS") == "1"

SRC = Path(__file__).resolve().parent          # sites/pages/
REPO = SRC.parents[1]                            # repo root
CORPUS = REPO / "corpus"
OUT = Path(os.environ.get("PAGES_OUT", SRC)).resolve()
IMG = OUT / "img"
DESK_W, MOB_W = 820, 360
Q = 82

NAME = {
    "posthog": "PostHog", "buildinamsterdam": "Build in Amsterdam",
    "northkingdom": "North Kingdom", "hellomonday": "Hello Monday",
    "studiofreight": "Studio Freight", "exoape": "Exo Ape",
    "corentinbernadou": "Corentin Bernadou", "creativeinc": "Creative Inc",
    "doronsupply": "Doron Supply", "outerbloc": "Outerbloc",
    "teenage-engineering": "Teenage Engineering", "thepudding": "The Pudding",
    "worksinprogress": "Works in Progress", "stripepress": "Stripe Press",
    "liquiddeath": "Liquid Death", "cashapp": "Cash App", "ourplace": "Our Place",
    "v0": "v0", "shadcn": "shadcn/ui",
}

def display_name(slug):
    return NAME.get(slug, slug[:1].upper() + slug[1:])

def host_of(url):
    import re
    h = re.sub(r"^https?://", "", url or "").strip("/")
    h = re.sub(r"^www\.", "", h)
    return h.split("/")[0]

def clean_award(a):
    import re
    a = re.sub(r"\s*\(", " · ", a or "")
    return a.replace(")", "").strip()

def parse_fm(md):
    import yaml
    parts = md.read_text().split("---", 2)
    if len(parts) < 3 or parts[0].strip():
        raise ValueError(f"{md.name}: missing or malformed frontmatter")
    return yaml.safe_load(parts[1])

def transcode(src, dst, w):
    im = Image.open(src).convert("RGBA")
    bg = Image.new("RGB", im.size, (255, 255, 255))
    bg.paste(im, mask=im.split()[3])
    ow, oh = bg.size
    LIMIT = 16383  # WebP max dimension; ultra-tall pages get width-shrunk to fit, whole page kept
    scale = min(1, w / ow, LIMIT / oh)  # never upscale a capture narrower than the target width
    tw, th = round(ow * scale), round(oh * scale)
    bg = bg.resize((tw, th), Image.LANCZOS)
    dst.parent.mkdir(parents=True, exist_ok=True)
    bg.save(dst, "WEBP", quality=Q, method=6)
    return tw, th, ow, oh

def collect():
    items = []
    skipped = []
    bad = []
    for corpus in ("production", "expressive"):
        for md in sorted(CORPUS.glob(f"{corpus}/exemplars/*.md")):
            try:
                fm = parse_fm(md)
            except Exception as e:
                bad.append(f"{corpus}/{md.name}: {e}")
                continue
            slug = fm["slug"]
            sdir = (md.parent / fm["screenshots"]).resolve()
            # screenshots are git-ignored private references; skip exemplars whose
            # captures aren't present on this box rather than crashing the build.
            shots = {}
            if not NO_SHOTS:
                if not (sdir / "desktop.png").exists() or not (sdir / "mobile.png").exists():
                    skipped.append(f"{corpus}/{slug}")
                    continue
                dw, dh, dow, doh = transcode(sdir / "desktop.png", IMG / corpus / slug / "d.webp", DESK_W)
                mw, mh, mow, moh = transcode(sdir / "mobile.png", IMG / corpus / slug / "m.webp", MOB_W)
                shots = {
                    "d": {"src": f"img/{corpus}/{slug}/d.webp", "w": dw, "h": dh, "ow": dow, "oh": doh},
                    "m": {"src": f"img/{corpus}/{slug}/m.webp", "w": mw, "h": mh, "ow": mow, "oh": moh},
                }
            items.append({
                "slug": slug, "corpus": corpus, "name": display_name(slug),
                "url": fm["url"], "host": host_of(fm["url"]),
                "award": clean_award(fm.get("award_type")),
                "tags": fm.get("tags") or [],
                "when": fm.get("when_to_use") or [],
                "dirs": fm.get("directions") or [],
                "a11y": fm.get("a11y") or [],
                "patterns": fm.get("patterns") or [],
                "captured": str(fm.get("captured") or ""),
                **shots,
            })
    if skipped:
        print(f"skipped {len(skipped)} exemplar(s) without local screenshots: {', '.join(skipped)}")
    for b in bad:
        print(f"BAD frontmatter, exemplar skipped: {b}", file=sys.stderr)
    if STRICT and (skipped or bad or not items):
        sys.exit(f"--strict: refusing to build a partial site "
                 f"({len(items)} built, {len(skipped)} missing screenshots, {len(bad)} bad frontmatter)")
    return items

def card(e):
    esc = html.escape
    tags = "".join(f"<li>{esc(t)}</li>" for t in e["tags"][:4])
    npat = len(e["patterns"])
    search = " ".join([e["slug"], e["name"], e["host"], e["corpus"], e["award"],
                       *e["tags"], *e["patterns"], *e["dirs"], *e["when"]]).lower()
    if "d" in e:
        preview = f'''<span class="device device--desktop">
            <span class="device__bar"><i></i><i></i><i></i><span class="device__addr mono">{esc(e['host'])}</span></span>
            <span class="device__screen">
              <img class="device__cap" loading="lazy" decoding="async" width="{e['d']['w']}" height="{e['d']['h']}" src="{e['d']['src']}" alt="{esc(e['name'])} — desktop">
            </span>
          </span>
          <span class="device device--phone">
            <span class="device__screen">
              <img class="device__cap" loading="lazy" decoding="async" width="{e['m']['w']}" height="{e['m']['h']}" src="{e['m']['src']}" alt="{esc(e['name'])} — mobile">
            </span>
          </span>'''
    else:
        # text-only card (no captures): a browser frame holding the name, the first
        # "when to use" line and up to three patterns, so the grid keeps its rhythm.
        pats = "".join(f"<li>{esc(p)}</li>" for p in e["patterns"][:3])
        when = esc(e["when"][0]) if e["when"] else ""
        preview = f'''<span class="device device--desktop device--text">
            <span class="device__bar"><i></i><i></i><i></i><span class="device__addr mono">{esc(e['host'])}</span></span>
            <span class="device__screen device__screen--text">
              <span class="text-prev__name">{esc(e['name'])}</span>
              <span class="text-prev__when">{when}</span>
              <ul class="text-prev__pats mono">{pats}</ul>
            </span>
          </span>'''
    return f'''      <li class="card" data-corpus="{e['corpus']}" data-search="{esc(search)}">
        <a class="card__shot" href="{esc(e['url'])}" data-slug="{esc(e['slug'])}" aria-label="Preview {esc(e['name'])}">
          {preview}
          <span class="card__expand" aria-hidden="true"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg></span>
        </a>
        <div class="card__meta">
          <div class="card__top">
            <h2 class="card__name">{esc(e['name'])}</h2>
            <span class="corpus corpus--{e['corpus']}"><i></i>{e['corpus'].capitalize()}</span>
          </div>
          <p class="card__award">{esc(e['award'])}</p>
          <ul class="card__tags">{tags}</ul>
          <div class="card__foot">
            <span class="mono card__pat">{npat} pattern{'' if npat==1 else 's'}</span>
            <a class="mono card__link" href="{esc(e['url'])}" target="_blank" rel="noopener noreferrer">{esc(e['host'])} <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M9 7h8v8"/></svg></a>
          </div>
        </div>
      </li>'''

FOOT_NOTE = ("Reference set for the web-design-taste corpus. Each card links to the live site."
             if NO_SHOTS else
             "Private reference set — captured for the web-design-taste corpus. Not redistributed.")
DESC_SHOTS = "" if NO_SHOTS else ", desktop and mobile,"

def page(items):
    n = len(items)
    nprod = sum(1 for e in items if e["corpus"] == "production")
    nexpr = n - nprod
    npat = len({(e["corpus"], p) for e in items for p in e["patterns"]})
    cards = "\n".join(card(e) for e in items)
    data = {e["slug"] + ":" + e["corpus"]: e for e in items}
    # "</" must not appear inside an inline <script> block: a literal "</script>" in any
    # corpus string would terminate the tag (page corruption / stored XSS via corpus content).
    blob = json.dumps(data, separators=(",", ":")).replace("</", "<\\/")
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Exemplar directory — the taste corpus</title>
  <meta name="description" content="Every reference site in the web-design-taste corpus: {n} real interfaces{DESC_SHOTS} with the principles and motion patterns each one teaches.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&family=Newsreader:ital,opsz@0,6..72;1,6..72&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <header class="masthead">
    <div class="wrap">
      <p class="kicker mono">Web-design-taste · corpus</p>
      <h1 class="masthead__title">The exemplar directory</h1>
      <dl class="stats">
        <div><dt class="mono">Exemplars</dt><dd>{n}</dd></div>
        <div><dt class="mono">Production</dt><dd>{nprod}</dd></div>
        <div><dt class="mono">Expressive</dt><dd>{nexpr}</dd></div>
        <div><dt class="mono">Named patterns</dt><dd>{npat}</dd></div>
      </dl>
    </div>
  </header>

  <div class="controls">
    <div class="wrap controls__inner">
      <div class="search">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
        <input id="q" type="search" placeholder="Search name, tag, or pattern…" aria-label="Search exemplars" autocomplete="off">
      </div>
      <div class="segmented" role="group" aria-label="Filter by corpus">
        <button class="seg is-active" data-corpus="all" aria-pressed="true">All <span class="mono">{n}</span></button>
        <button class="seg" data-corpus="production" aria-pressed="false">Production <span class="mono">{nprod}</span></button>
        <button class="seg" data-corpus="expressive" aria-pressed="false">Expressive <span class="mono">{nexpr}</span></button>
      </div>
    </div>
  </div>

  <main class="wrap">
    <ol class="grid" id="grid">
{cards}
    </ol>
    <p class="empty" id="empty" hidden>No exemplar matches <b id="empty-q"></b>.</p>
  </main>

  <footer class="foot">
    <div class="wrap foot__inner">
      <span class="mono">{FOOT_NOTE}</span>
      <span class="mono">{n} exemplars · {nprod} production · {nexpr} expressive</span>
    </div>
  </footer>

  <dialog class="lb" id="lb" aria-label="Exemplar preview">
    <div class="lb__panel">
      <button class="lb__close" id="lb-close" aria-label="Close preview">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>
      </button>
      <div class="lb__shots" id="lb-shots"></div>
      <aside class="lb__meta" id="lb-meta"></aside>
    </div>
  </dialog>

  <script type="application/json" id="ex-data">{blob}</script>
  <script src="js/app.js" defer></script>
</body>
</html>
'''

def prune_orphans(items):
    """Remove webp output for exemplars no longer in the corpus (renamed/removed)."""
    expected = {IMG / e["corpus"] / e["slug"] / n for e in items for n in ("d.webp", "m.webp")}
    removed = 0
    for f in IMG.glob("**/*.webp"):
        if f not in expected:
            f.unlink()
            removed += 1
    # drop now-empty slug/corpus dirs
    for d in sorted((p for p in IMG.glob("**/") if p != IMG), reverse=True):
        try:
            d.rmdir()
        except OSError:
            pass
    if removed:
        print(f"pruned {removed} orphaned webp file(s)")

def main():
    items = collect()
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "index.html").write_text(page(items))
    (OUT / "data.json").write_text(json.dumps(items, indent=0))
    # deploying elsewhere: ship the hand-written css/js alongside the output
    if OUT != SRC:
        for sub in ("css", "js"):
            shutil.copytree(SRC / sub, OUT / sub, dirs_exist_ok=True)
    if NO_SHOTS and IMG.exists():
        shutil.rmtree(IMG)  # never ship captures left over from an earlier build
    elif IMG.exists():
        prune_orphans(items)
    total = sum(f.stat().st_size for f in IMG.glob("**/*.webp"))
    print(f"built {len(items)} exemplars · {len(list(IMG.glob('**/*.webp')))} webp · {total/1e6:.1f} MB images -> {OUT}")

if __name__ == "__main__":
    main()
