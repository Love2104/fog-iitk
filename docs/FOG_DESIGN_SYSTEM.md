# Fog IITK Design System (Redesign v2)

This document outlines the visual design, typography, spacing, and component patterns established during the `index.php` and `fognav` redesign. This system must be strictly followed when migrating or building other pages (e.g., Sensor Data, Spatial Fog, About).

## 1. Core Philosophy
- **Scientific / Editorial Aesthetic**: The UI must look like a premium weather intelligence dashboard or a high-end data instrument, NOT a generic Bootstrap admin panel.
- **Minimalist Structure**: Rely on subtle hairlines (`1px solid var(--rule)`), intentional white space, and distinct typography rather than heavy box-shadows or colored background cards.
- **Hardware-Accelerated UI**: Use CSS custom properties for theming (light/dark) seamlessly.

## 2. Typography
The interface utilizes a strict two-font system to separate narrative/UI text from hard data:

- **Primary UI Font**: `Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;`
  - Used for headings, labels, button text, and prose.
- **Data/Monospace Font**: `"IBM Plex Mono", "SFMono-Regular", Consolas, monospace;`
  - Used strictly for timestamps, raw readings, metric values, and scientific eyebrows.

### Standardized Scales (from `fog-redesign.css` & `fog-home.css`)
- **Primary Data Value** (`.fc-science-result-title`, `.hero-state`): `24px - 26px` (Semi-bold, tight tracking)
- **Secondary Data** (`.cond-val`): `22px - 28px` (Medium weight)
- **UI Base / Navbar** (`--fs-ui`): `15px`
- **Component Headings** (`.hero-super`, `.cond-label`): `14px - 15px` (Medium/Semi-bold)
- **Timeline/Meta** (`--fs-micro` / `.fognav-opt i`): `13px` (Medium weight, subtle tracking)
- **Scientific Eyebrows** (`.fc-science-eyebrow`): `13px` (Mono, Uppercase, strong letter-spacing `0.12em`)
- **Micro-Labels** (Scale ticks, legends): `11px - 12px`

## 3. Color Tokens
Always use CSS variables. Never hardcode hex codes.

### Ground & Surfaces
- `var(--paper)`: The absolute background layer (white in light mode, dark charcoal in dark).
- `var(--paper-2)`: Soft offset background for input fields, footers, and alternating rows.
- `var(--surface)`: Elevated layer for popovers and tooltips.

### Ink (Text & Icons)
- `var(--ink)`: Primary text (high contrast).
- `var(--ink-2)`: Secondary text (muted).
- `var(--ink-3)`: Tertiary text (labels, placeholders, unselected states).

### Data State Colors (Semantic)
- `var(--state-clear)`: Safe / No Fog (Green)
- `var(--state-fog)`: Fog / Warning (Ochre/Gold)
- `var(--state-dense)`: Dense Fog (Orange/Red)
- `var(--state-verydense)`: Very Dense Fog (Dark Red)

### Borders
- `var(--rule)`: Standard 1px hairline border used to separate sections.
- `var(--rule-2)`: Slightly stronger border for input focus states or distinct panels.

## 4. Layout & Spacing
- **Responsive Clamps**: Use `clamp()` for vertical padding to ensure comfortable breathing room across devices (e.g., `padding: clamp(24px, 4vh, 48px) 0;`).
- **Dashboard Grid**: The hero section uses a 45/55 split (Left: Map/Data, Right: Interactive tools) on desktop.
- **Forms & Inputs**: Inputs should have a `var(--paper-2)` background, `var(--rule)` border, and a subtle 8px border-radius (`var(--home-radius)`).
- **Buttons**: Primary buttons (`.fc-science-btn`) are flat, dark `var(--ink)` with `var(--paper)` text, no shadows, slightly rounded (8px).

## 5. Reusable Component Patterns

### Scientific Eyebrow
Use for section headers instead of giant `<h2>` tags.
```html
<header class="fc-science-header">
  <div class="fc-science-eyebrow">NEXT 6 HOURS &middot; VISIBILITY FORECAST</div>
</header>
```

### Sensor / Metric Card (Bento Grid)
Used for displaying simple data points.
```html
<div class="cond-cell">
  <div class="cond-label">TEMPERATURE</div>
  <div class="cond-val">24.5 <span class="unit">°C</span></div>
</div>
```

### Data Readouts
Use the subtle `.fc-sci-marker` dot to indicate live data or state.
```html
<div class="fc-science-result-title fc-clear">
  <span class="fc-sci-marker"></span>NO FOG EXPECTED
</div>
```

## 6. Migration Guide for Other Pages (Sensor Data, Spatial Fog)
When refactoring other pages:
1. **Remove** Bootstrap/Argon classes (`card`, `row`, `col-md-6`, `bg-white`, `shadow`).
2. **Replace** with structural semantic HTML (`<section>`, `<article>`) and custom CSS Grid/Flexbox layouts.
3. **Apply** the `.fc-science-*` or `.evidence-*` class patterns for controls and metadata.
4. **Ensure** light/dark mode compatibility by strictly adhering to `var(--...)` color tokens.
