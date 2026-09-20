#!/bin/bash
FILES=("comparedata.php" "short_term_forecast_comp.php" "long_pred_comp.php" "long_term.php" "spatial_fog.php" "fogcast_lite_forecast.php" "camera_based_visibility_detection.php" "publication.php" "about.php" "contact_us.php")

SNIPPET="<script>\n(function () {\n  try {\n    var t = localStorage.getItem('fog-theme');\n    if (t === 'dark' || t === 'light') { document.documentElement.setAttribute('data-theme', t); }\n  } catch (e) {}\n})();\n</script>"

for f in "${FILES[@]}"; do
    if grep -q "localStorage.getItem('fog-theme')" "$f"; then
        echo "$f already has theme script"
    else
        sed -i "/<\/head>/i \\$SNIPPET" "$f"
        echo "Injected into $f"
    fi
done
