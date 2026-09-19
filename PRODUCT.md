# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Forecasters, aviation-adjacent researchers, students, and the campus community checking whether fog is affecting visibility right now.

## Product Purpose
Fog IITK, IIT Kanpur's fog observation and forecasting research programme. The home page shows current visibility and the next 6 hours of forecast for one selected airport station.

## Positioning
A research output, not an operational aviation product. All times are IST. 

## Operating Context
Opened quickly, often on a phone, during the Nov-Feb fog season. Must load fast and read at a glance.

## Capabilities and Constraints
- Plain PHP + vanilla CSS/JS.
- WCAG AA accessibility required.
- Every number must come from existing PHP variables.
- Voice is factual and plain; no marketing language.
- Missing values show "—" with a short reason.
- Never invent data.

## Brand Commitments
No generic weather-app fluff, gradient text, purple/pink gradients, identical card grids, emoji icons, or glow effects.

## Evidence on Hand
Uses existing `index.php` and its data integration via `fog_db.php`.

## Product Principles
1. **Factual and Fast:** Emphasize immediate readability and factual accuracy over decorative elements.
2. **Accessible by Default:** Ensure high contrast and clear state communication for all conditions.
3. **Graceful Degradation:** The core experience must work without JavaScript and across varied device capabilities.
