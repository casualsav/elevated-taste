# Production Design Systems — Reference

Source-backed reference for production-grade design systems. Every install/import command below is preserved verbatim from a real, shippable package. Use these to ground decisions in production reality, not training-data fiction. These anchor the `production` corpus.

> Rule of thumb: reach for one of these when the brief is an app, tool, dashboard, government service, or anything where consistency, accessibility, and component coverage matter more than a bespoke look. For pure marketing/landing expression, a system may be too rigid — but Primer Brand and Radix Themes are good middle grounds.

---

## Decision guide

Pick by the dominant constraint of the project:

| If the project is… | Pick | Why |
| --- | --- | --- |
| Owned-code React (you want the components *in* your repo) | **shadcn/ui** | Copies real component source into your project — you own and edit it; no runtime dependency lock-in. |
| Enterprise, data-dense (tables, dashboards, internal tools) | **IBM Carbon** | Built for data-heavy enterprise UIs; dense layouts, deep component set, strong design tokens. |
| Government / accessibility-first (public sector) | **GOV.UK Frontend** (UK) or **USWDS** (US) | Accessibility and plain-language are first-class; battle-tested on high-traffic public services. |
| GitHub-style devtool UI | **Primer CSS** (product UI) / **Primer Brand** (marketing) | GitHub's own system; the right look for developer tools and dev-facing products. |
| Fastest-to-ship, low custom styling | **Radix Themes** or **Bootstrap 5.3** | Radix = modern, accessible, themeable out of the box; Bootstrap = grid + components with zero ramp-up. |
| Material 3 look (Google-flavored) | **Material Web (M3)** | Official M3 web components. |
| Microsoft / Fluent ecosystem | **Fluent UI** (React v9 or web components) | Official Microsoft system; pick React for React apps, web components for framework-free. |
| Atlassian-style product UI | **Atlassian Design System (Atlaskit)** | The Jira/Confluence look; token-driven. |
| Shopify app embedded in Shopify admin | **Shopify Polaris (web components)** | Required to match the Shopify admin shell. |

Quick mental model: **own the code → shadcn/ui** · **data-dense enterprise → Carbon** · **gov/a11y → GOV.UK / USWDS** · **devtool → Primer** · **ship now → Radix / Bootstrap**.

---

## Systems

Each entry: **best-for**, the real install/import command (verbatim), and when to choose it.

### Material Web (Material 3)
- **Best for:** Apps that want Google's Material 3 language, delivered as standard web components (framework-agnostic).
- **Install:**
  ```bash
  npm install @material/web
  ```
- **Choose when:** You want an official M3 implementation and are comfortable with web components rather than a React-first API. Good cross-framework fit.

### Fluent UI — React (v9)
- **Best for:** React apps inside the Microsoft/Fluent ecosystem.
- **Install:**
  ```bash
  npm install @fluentui/react-components
  ```
- **Choose when:** You're building a React product and want Microsoft's official, accessible component library with first-class React ergonomics.

### Fluent UI — Web Components (framework-free)
- **Best for:** Non-React (or no-framework) projects that still want the Fluent look.
- **Install:**
  ```bash
  npm install @fluentui/web-components @fluentui/tokens
  ```
- **Choose when:** You need Fluent outside React — vanilla, or paired with Angular/Vue/Svelte. Ship `@fluentui/tokens` alongside for theming.

### IBM Carbon
- **Best for:** Enterprise, data-dense applications — dashboards, internal tools, admin consoles with heavy tables.
- **Install:**
  ```bash
  npm install @carbon/react @carbon/styles
  ```
- **Choose when:** The product is information-dense and enterprise-grade, and you want a deep component set plus a mature token system. The default pick for "serious internal tool."

### Radix Themes
- **Best for:** Modern, accessible React UIs that need to look good and ship fast with minimal custom CSS.
- **Install:**
  ```bash
  npm install @radix-ui/themes
  ```
- **Choose when:** You want accessibility and theming handled out of the box and a polished default aesthetic — a strong middle ground between a rigid enterprise system and fully bespoke. (Distinct from Radix Primitives, which are unstyled; Themes is the styled layer.)

### shadcn/ui (open code, owned components)
- **Best for:** React teams that want to *own* the component source in their own repo.
- **Install:**
  ```bash
  npx shadcn@latest init
  npx shadcn@latest add button card badge separator input
  ```
- **Choose when:** You want full control — the CLI copies real component code into your project so you can edit it freely, with no runtime library to lock into. The default for "I want my own design system, fast."

### Primer CSS (GitHub product/devtool UI)
- **Best for:** Developer tools and dev-facing product UI that should feel GitHub-native.
- **Install:**
  ```bash
  npm install --save @primer/css
  ```
- **Choose when:** You're building a devtool or product surface and want GitHub's product look (the in-app UI, not marketing pages).

### Primer Brand (GitHub marketing UI)
- **Best for:** Marketing and brand pages in the GitHub/Primer visual language.
- **Install:**
  ```bash
  npm install @primer/react-brand
  ```
- **Choose when:** You need expressive marketing/landing surfaces (not in-app product UI) that still align with the Primer brand — the marketing counterpart to Primer CSS.

### GOV.UK Frontend
- **Best for:** UK government / public-sector services where accessibility and plain language are mandatory.
- **Install:**
  ```bash
  npm install govuk-frontend
  ```
- **Choose when:** You're building (or matching) a UK public service. Accessibility-first, exhaustively tested on high-traffic services, opinionated for clarity over decoration.

### USWDS (US Web Design System)
- **Best for:** US federal/government services and accessibility-first public sites.
- **Install:**
  ```bash
  npm install uswds
  ```
- **Choose when:** You're building for a US government context, or you simply want a rigorously accessible, Section-508-minded system with a complete component set.

### Atlassian Design System (Atlaskit)
- **Best for:** Products that should feel like Jira/Confluence/Atlassian tooling.
- **Install:**
  ```bash
  yarn add @atlaskit/css-reset @atlaskit/tokens @atlaskit/button @atlaskit/badge @atlaskit/section-message @atlaskit/card
  ```
- **Choose when:** You're inside or adjacent to the Atlassian ecosystem and want its token-driven, product-grade components. Note the per-component package model — add only the packages you use.

### Bootstrap 5.3
- **Best for:** Fastest-to-ship sites/apps where a familiar grid and component set beats a custom look.
- **Install:**
  ```bash
  npm install bootstrap
  ```
- **Choose when:** You need a known, low-ramp framework for a grid plus standard components and don't need a distinctive aesthetic. Maximum ubiquity and documentation.

### Shopify Polaris (Web Components — Shopify apps only)
- **Best for:** Apps embedded inside the Shopify admin that must match its shell.
- **Install:** Polaris web components are loaded via the Shopify CDN, not npm. Add to your app HTML `<head>`:
  ```html
  <meta name="shopify-api-key" content="%SHOPIFY_API_KEY%" />
  <script src="https://cdn.shopify.com/shopifycloud/polaris.js"></script>
  ```
- **Choose when:** You're building a Shopify app and need to blend into the Shopify admin UI. Outside that context, do not use Polaris — it only makes sense embedded in Shopify.

---

## Canonical sources (read before reinventing)

When in doubt, consult the system's own docs rather than relying on memory.

| System | Canonical docs / repo |
| --- | --- |
| Material Web | `material-web.dev/theming/material-theming/` · `m3.material.io/develop/web` · github.com/material-components/material-web |
| Fluent UI | `fluent2.microsoft.design/get-started/develop` · `fluent2.microsoft.design/components/web/react/` · `learn.microsoft.com/en-us/fluent-ui/web-components/` · github.com/microsoft/fluentui |
| IBM Carbon | `carbondesignsystem.com` · `carbondesignsystem.com/developing/react-tutorial/overview/` · github.com/carbon-design-system/carbon |
| Radix Themes | `radix-ui.com/themes/docs/components/theme` · github.com/radix-ui/themes |
| shadcn/ui | `ui.shadcn.com/docs` · github.com/shadcn-ui/ui |
| Primer | `primer.style` · github.com/primer/css · github.com/primer/brand |
| GOV.UK Frontend | `design-system.service.gov.uk` · github.com/alphagov/govuk-frontend |
| USWDS | `designsystem.digital.gov/documentation/developers/` · github.com/uswds/uswds |
| Atlassian | `atlassian.design/get-started/develop` · `atlassian.design/tokens/design-tokens` · atlaskit.atlassian.com |
| Bootstrap | `getbootstrap.com/docs/5.3/layout/grid/` · `getbootstrap.com/docs/5.3/components/card/` |
| Shopify Polaris | `shopify.dev/docs/api/app-home/web-components` · github.com/Shopify/polaris-react |

---

## Note on Apple "Liquid Glass" (not a web design system)

There is **no** official Apple `liquid-glass.css` package for the web. Apple documents Liquid Glass only for Apple platforms (Human Interface Guidelines → Materials; Developer Documentation → Liquid Glass / Adopting Liquid Glass; SwiftUI → Material). On the web you can only build a **glassmorphism / frosted-glass approximation** with `backdrop-filter`, transparent backgrounds, layered borders, and highlight overlays — and you should label it as an approximation in code, never as official Apple Liquid Glass. Always provide a high-contrast fallback (`prefers-reduced-transparency`), since blur support is uneven.
