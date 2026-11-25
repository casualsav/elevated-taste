/* Generated from tokens.json (base) — do not edit by hand. Run: node tokens/build.mjs --tailwind
 *
 * Consuming projects wire this in as a Tailwind preset:
 *   // tailwind.config.js
 *   module.exports = { presets: [require('./tokens/tailwind.preset.mjs')] };
 *   // or ESM: import tokensPreset from './tokens/tailwind.preset.mjs'
 * You then get token-named utilities: bg-surface, text-muted, p-6, rounded-lg, …
 * Values are var(--token) refs, so tokens.css remains the source of truth — ship it too.
 */
export default {
  "theme": {
    "extend": {
      "colors": {
        "bg": {
          "DEFAULT": "var(--color-bg)",
          "dark": "var(--color-bg-dark)"
        },
        "surface": {
          "2": "var(--color-surface-2)",
          "DEFAULT": "var(--color-surface)",
          "inverse": "var(--color-surface-inverse)",
          "dark": "var(--color-surface-dark)",
          "dark-2": "var(--color-surface-dark-2)"
        },
        "fg": {
          "DEFAULT": "var(--color-fg)",
          "inverse": "var(--color-fg-inverse)",
          "on-dark": "var(--color-fg-on-dark)"
        },
        "muted": {
          "DEFAULT": "var(--color-muted)",
          "on-dark": "var(--color-muted-on-dark)"
        },
        "subtle": "var(--color-subtle)",
        "border": {
          "DEFAULT": "var(--color-border)",
          "inverse": "var(--color-border-inverse)",
          "on-dark": "var(--color-border-on-dark)",
          "strong": "var(--color-border-strong)"
        },
        "accent": {
          "DEFAULT": "var(--color-accent)",
          "fg": "var(--color-accent-fg)"
        },
        "success": "var(--color-success)",
        "warning": "var(--color-warning)",
        "danger": "var(--color-danger)",
        "focus": "var(--color-focus)",
        "hairline": "var(--color-hairline)"
      },
      "spacing": {
        "1": "var(--space-1)",
        "2": "var(--space-2)",
        "3": "var(--space-3)",
        "4": "var(--space-4)",
        "5": "var(--space-5)",
        "6": "var(--space-6)",
        "7": "var(--space-7)",
        "8": "var(--space-8)",
        "9": "var(--space-9)",
        "10": "var(--space-10)"
      },
      "fontSize": {
        "xs": "var(--text-xs)",
        "sm": "var(--text-sm)",
        "base": "var(--text-base)",
        "md": "var(--text-md)",
        "lg": "var(--text-lg)",
        "xl": "var(--text-xl)",
        "2xl": "var(--text-2xl)",
        "3xl": "var(--text-3xl)",
        "4xl": "var(--text-4xl)",
        "5xl": "var(--text-5xl)",
        "display": "var(--text-display)"
      },
      "borderRadius": {
        "sm": "var(--radius-sm)",
        "md": "var(--radius-md)",
        "lg": "var(--radius-lg)",
        "xl": "var(--radius-xl)",
        "full": "var(--radius-full)"
      },
      "boxShadow": {
        "sm": "var(--shadow-sm)",
        "md": "var(--shadow-md)",
        "lg": "var(--shadow-lg)"
      },
      "transitionTimingFunction": {
        "standard": "var(--ease-standard)",
        "entrance": "var(--ease-entrance)",
        "exit": "var(--ease-exit)"
      },
      "transitionDuration": {
        "fast": "var(--duration-fast)",
        "base": "var(--duration-base)",
        "slow": "var(--duration-slow)"
      },
      "letterSpacing": {
        "tight": "var(--tracking-tight)",
        "normal": "var(--tracking-normal)",
        "wide": "var(--tracking-wide)",
        "display": "var(--tracking-display)",
        "heading": "var(--tracking-heading)",
        "ui": "var(--tracking-ui)",
        "body": "var(--tracking-body)",
        "caps": "var(--tracking-caps)"
      }
    }
  }
};
