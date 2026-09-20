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
- **Editorial Data Journalism aesthetic** (e.g. Financial Times, NYT Upshot) for dashboards and metrics.

**The No-Fluff Rule.** No generic weather-app tropes, gradients, or emojis. Every element must serve a functional purpose. Avoid placing every metric inside heavy bordered cards.

# Typography
- Use `Instrument Sans` for all labels.
- Use `JetBrains Mono` for all numbers.

# Layout
- Max-width container of `1200px` (`--home-shell`).
- Responsive padding scaling from `16px` to `40px` (`clamp(16px, 4vw, 40px)`).
- **Data Grids:** Use strict alignment and typographic hierarchy instead of boxed containers. Metric strips should be borderless, utilizing hairline separators (`#E2E8F0`) only when necessary.

# Charting Design System
- **Renderer:** Prefer server-side SVG generation (e.g., `fog_chart.php`) over bloated client-side JS libraries (like Highcharts) for core static assets.
- **Main Data Series:** Crisp `2px` dark slate (`#0F172A`), never pure black. Use soft area fills (e.g., `rgba(15, 23, 42, 0.05)`).
- **Gridlines & Axes:** Vertical gridlines are discouraged. Horizontal gridlines must be faint hairlines (`#F1F5F9`). Axis labels use clean `11px` sans-serif text with ample padding.
- **Zones & Thresholds:** Use soft warning tones for critical zones (e.g., `rgba(254, 243, 199, 0.5)` for fog). Threshold boundaries use crisp `1px dashed #94A3B8` lines.
- **Annotations:** Avoid text-shadows, strokes, or heavy opaque fills. Labels should float cleanly, colored in muted slate (`#64748B`), and positioned deliberately (e.g., just above threshold lines). Interactive readouts should be implemented as floating tooltips positioned absolutely over the chart, completely detached from the document flow.

# Motion
- Entrance animations use `translateY(12px)` to `0` and fade in over `500ms var(--ease-out)`.
- Elements are staggered by `80ms` increments (`nth-child` delays).
- Animations are disabled when `prefers-reduced-motion` is active.
- Animations only execute if JavaScript is enabled (`html.js`), ensuring a fully visible fallback.
