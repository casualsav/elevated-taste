---
pattern: sticky-scrollspy-rail
from: urbit
corpus: expressive
safety: production-safe
trigger: in-view
tags: [navigation, docs, feature-section, motion]
---

## What it is
A pinned vertical **index rail** beside a long single-column read. The rail lists the page's sections (often under monospace category headers), stays fixed while the content scrolls past it, and **recolors the item for the section currently in view** — muted grey for the rest, ink/accent for the active one. It replaces a progress bar, breadcrumb, or floating "back to top" with a persistent, legible "you are here." On Urbit the rail groups *Self-Hosting → Command Line / Native Planet / Cloud Server …* and the active title shifts grey → olive as you scroll.

## Why it works
Orientation in a long page is a real cost; a sticky rail pays it once and keeps paying off. Driving the active state from an `IntersectionObserver` (not a scroll handler) means the work is event-driven and off the main thread, and animating only `color` keeps it on the cheap path — no layout, no paint storms. Color-as-state also doubles as a table of contents and a set of jump links, so one element carries navigation *and* feedback. Because every section observes itself, adding a section needs no JS changes.

## Reference implementation
```html
<div class="doc">
  <!-- pinned index rail -->
  <nav class="rail" aria-label="Sections">
    <p class="rail__group">Self-Hosting</p>
    <a class="rail__item" href="#command-line">Command Line</a>
    <a class="rail__item" href="#native-planet">Native Planet</a>
    <a class="rail__item" href="#cloud-server">Cloud Server</a>
    <p class="rail__group">Go Deeper</p>
    <a class="rail__item" href="#running">Running your Urbit</a>
  </nav>

  <!-- scrolling content -->
  <main class="content">
    <section id="command-line" class="spy"><h2>Command Line</h2><p>…</p></section>
    <section id="native-planet" class="spy"><h2>Native Planet</h2><p>…</p></section>
    <section id="cloud-server" class="spy"><h2>Cloud Server</h2><p>…</p></section>
    <section id="running" class="spy"><h2>Running your Urbit</h2><p>…</p></section>
  </main>
</div>

<style>
  .doc { display: grid; grid-template-columns: minmax(12rem, 18rem) minmax(0, var(--container, 864px)); gap: var(--space-8, 32px); }

  .rail { position: sticky; top: var(--space-6, 24px); align-self: start; height: max-content; display: flex; flex-direction: column; gap: var(--space-1, 4px); }
  .rail__group { font-family: var(--font-label, "Space Mono", monospace); font-size: var(--text-xs, 0.75rem); letter-spacing: 1px; color: var(--muted, #b2b2b2); margin: var(--space-4, 16px) 0 var(--space-1, 4px); }
  .rail__item {
    font-family: var(--font-body, "Skyling", sans-serif);
    font-size: var(--text-lg, 1.25rem);
    color: var(--muted, #b2b2b2);
    text-decoration: none;
    transition: color var(--dur-1, 150ms) var(--ease-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }
  /* active = the only place the accent is spent; pair with an underline so it
     doesn't rely on color alone (color-blind / contrast safety) */
  .rail__item.is-active { color: var(--accent, #5e604c); text-decoration: underline; }

  .spy { scroll-margin-top: var(--space-6, 24px); min-height: 60vh; }

  @media (max-width: 60rem) {
    .doc { grid-template-columns: 1fr; }
    .rail { position: static; flex-direction: row; flex-wrap: wrap; }
  }

  /* the active swap is an instant color change — nothing to disable for
     reduced motion, but kill the transition timing so it never eases */
  @media (prefers-reduced-motion: reduce) {
    .rail__item { transition: none; }
  }
</style>

<script>
  const items = new Map(
    [...document.querySelectorAll(".rail__item")].map(a => [a.getAttribute("href").slice(1), a])
  );
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        items.forEach(a => a.classList.remove("is-active"));
        items.get(e.target.id)?.classList.add("is-active");
      }
    }
  }, { rootMargin: "-40% 0px -55% 0px", threshold: 0 }); // active when section nears viewport center
  document.querySelectorAll(".spy").forEach(s => io.observe(s));
</script>
```
