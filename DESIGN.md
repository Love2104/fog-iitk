---
name: "Fog IITK Homepage"
description: "Premium, modern data product design for the Fog IITK homepage."
typography:
  sans:
    name: "Instrument Sans"
    fallbacks: "system-ui, -apple-system, sans-serif"
    role: "All labels, prose, and UI text."
  mono:
    name: "JetBrains Mono"
    fallbacks: "ui-monospace, monospace"
    role: "Every numeric value and data point."
spacing:
  shell: "1200px (max-width container)"
  content: "clamp(16px, 4vw, 40px) (responsive horizontal padding)"
rounded:
  default: "16px (--home-radius)"
  sm: "10px (--home-radius-sm)"
---

# Overview
A premium, factual data product interface that communicates current visibility and fog forecasts. The atmosphere of the page dynamically adjusts based on the current visibility using a `--fog-density` property, ranging from 0 (clear) to 1 (zero visibility).

**Key Characteristics:**
- Factual and plain data presentation.
- Dynamic atmosphere driven by real data.
- Progressive enhancement with graceful degradation.

**The No-Fluff Rule.** No generic weather-app tropes, gradients, or emojis. Every element must serve a functional purpose.

# Typography
- Use `Instrument Sans` for all labels.
- Use `JetBrains Mono` for all numbers.

# Layout
- Max-width container of `1200px` (`--home-shell`).
- Responsive padding scaling from `16px` to `40px` (`clamp(16px, 4vw, 40px)`).

# Motion
- Entrance animations use `translateY(12px)` to `0` and fade in over `500ms var(--ease-out)`.
- Elements are staggered by `80ms` increments (`nth-child` delays).
- Animations are disabled when `prefers-reduced-motion` is active.
- Animations only execute if JavaScript is enabled (`html.js`), ensuring a fully visible fallback.
