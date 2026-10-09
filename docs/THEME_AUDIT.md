# Homepage style audit

The repository contains 1,164 tracked stylesheets, largely bundled vendor examples and nested historical copies. This audit lists the stylesheets that affected the live root homepage, then records every active font declaration and effect in the new homepage stylesheet.

## Stylesheets loaded by the homepage before this redesign

- `assets/css/nucleo-icons.css`
- `assets/css/nucleo-svg.css`
- `assets/css/argon-design-system.css`
- `css/main.css`
- `assets/css/fog-home.css`
- `assets/css/fog-redesign.css`
- `assets/css/fog-theme-compat.css`
- `assets/css/fog-home-refinement.css`
- `Google Fonts stylesheet (remote)`

## Active homepage stylesheet now

- `assets/css/theme.css` (locally hosted Inter and JetBrains Mono; no CSS framework loaded by index)

## Active font-family declarations (3 distinct)

- `'JetBrains Mono'`
- `Inter`
- `var(--ui)`

## Active font-size property values (16 distinct)

- `10px`
- `11px`
- `12px`
- `13px`
- `14px`
- `15px`
- `16px`
- `18px`
- `20px`
- `28px`
- `32px`
- `40px`
- `44px`
- `72px`
- `clamp(72px,18vw,108px)`
- `clamp(96px,17vw,160px)`

The display number uses `font: 600 clamp(96px,14vw,200px)/.9 var(--ui)` shorthand. All other shorthand sizes are among the values above.

## Gradients, shadows, backdrop filters in the active stylesheet

- Gradients: 0
- Box shadows: 1; `0 24px 48px rgba(0,0,0,.06)`
- Backdrop filters: 0
- Blur filters: 0

The chart's former decorative SVG gradient and area path were removed. Its line, keyboard readout, map controls, and data behavior remain intact.
