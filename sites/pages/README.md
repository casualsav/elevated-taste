# sites/pages — the exemplar directory

A static directory of every exemplar in the corpus, deployed at
**[taste.extant.cc](https://taste.extant.cc)** via GitHub Pages (legacy:
`extant.cc/taste` / `www.extant.cc/taste` / `pages.extant.cc` on host-run Caddy,
see below). Each card shows the exemplar's desktop capture in a browser frame
plus a mobile picture-in-picture; clicking opens a lightbox with both
full-length captures and the principles / patterns that exemplar teaches.
Search + corpus filter at the top.

## Hosting (GitHub Pages, deploy-on-merge — canonical)

`.github/workflows/deploy-site.yml` builds the site in CI on every merge to
`main` that touches exemplars (or this directory) and publishes it to GitHub
Pages. Screenshots come from the orphan **`captures`** branch:

- **One-time seed** from the capture box (the only place the pre-Actions
  screenshots exist): `bash tooling/push-captures.sh`
- Every evolve workflow run appends its new captures to the same branch
  automatically.

One-time repo setup: **Settings → Pages → Source: "GitHub Actions"**, custom
domain `taste.extant.cc`; DNS: `CNAME taste → casualsav.github.io`. The build
runs `--strict`, so a partial/empty site can never replace the live one. Caddy
can keep a redirect from `extant.cc/taste` to `taste.extant.cc` during the
transition.

## Source vs. generated

Tracked (the site's source of truth):

- `build.py` — reads exemplar frontmatter from `corpus/{production,expressive}`,
  transcodes the desktop + mobile captures to lazy WebP, and emits the page.
- `css/style.css`, `js/app.js` — hand-written. Production corpus + minimalist
  tokens; the HTML shell + card template live inside `build.py`.

Generated, **git-ignored** (see `.gitignore`): `index.html`, `data.json`, `img/`.
`img/` is derived from `corpus/*/screenshots/`, which are private references and
not redistributed — so, like the screenshots themselves, the built site is never
committed. Rebuild it from a fresh checkout with one command.

## Build & deploy

```bash
# build in place (sites/pages/) for local preview
python3 sites/pages/build.py

# deploy into the live web root (also copies css/ + js/)
PAGES_OUT=/var/www/sites/pages python3 sites/pages/build.py
```

Build requires **Pillow + PyYAML** (present in the host's system `python3`).

## Hosting (host-run Caddy, slug model — legacy)

Caddy runs **on the host** (`systemctl status caddy`, config `/etc/caddy/Caddyfile`).
The canonical URL is **`extant.cc/taste`** — on the apex (and `www`) the `/taste`
path is rewritten (`handle_path`) to serve `/var/www/sites/pages/`. The build's
asset paths are relative, so the same build serves unchanged under `/taste/`.
All other hosts keep the *slug* model: `/var/www/sites/<slug>/` ⇒ `<slug>.extant.cc`
(so `pages.extant.cc` ⇒ `/var/www/sites/pages/` still works).

> **DNS:** the apex `extant.cc` needs an A record → the host IP for `extant.cc/taste`
> to resolve (and for its on-demand cert to validate). Until that's added,
> `www.extant.cc/taste` (www has an A record) and `pages.extant.cc` both work.

How it works:
- `:443` terminates HTTPS with **on-demand TLS**; `root` is set per request to
  `/var/www/sites/{http.request.host.labels.2}` (the subdomain label).
- On-demand cert issuance is approved by a local beacon: `:8880` returns `200`
  for any host (`on_demand_tls { ask http://127.0.0.1:8880 }`). Tighten this if
  the box ever serves untrusted domains.
- `caddy` is `systemctl enable`d, so it survives reboot; `rules.v4` is persisted
  so the stale DNAT doesn't return.

```bash
# after a corpus change: rebuild straight into the live web root, then it's live
sudo PAGES_OUT=/var/www/sites/pages python3 sites/pages/build.py
curl -s -o /dev/null -w '%{http_code}\n' https://www.extant.cc/taste/   # expect 200
```

Note: `build.py` skips any exemplar whose (git-ignored) screenshots aren't on
this box, so a fresh checkout that hasn't re-captured will build a partial site.
