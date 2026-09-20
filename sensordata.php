<?php
// Track visits and session handling
include 'apis/start_admin.php';
$page='iit_kanpur';
$conn = @pg_connect("host=localhost port=5432 dbname=fogprediction user=chaman password=chaman123");  
if ($conn) {
    if (!isset($_SESSION['last_page_visited']) || $_SESSION['last_page_visited'] != $page) {
        $sql = 'Select * from visits where "date"='."'".date("Y-m-d")."'";
        $result = @pg_query($conn, $sql);
        if ($result) {
            $is_user = pg_fetch_row($result);
            if (!$is_user) {
                $sql = 'INSERT INTO public.visits(index, past_prediction, compare_results, iit_kanpur, about, "date") VALUES (0,0,0,0,0,'."'".date("Y-m-d")."'".');';
                @pg_query($conn, $sql);
            } else {
                $sql = 'UPDATE visits SET "iit_kanpur" = "iit_kanpur" + 1 WHERE "date" = '."'".date("Y-m-d")."'";
                @pg_query($conn, $sql);
            }
            $_SESSION['last_page_visited'] = $page;
        }
    }
    @pg_close($conn);
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Sensor Observations &middot; Fog IITK</title>
<link rel="icon" type="image/png" href="./assets/img/iitk.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<!-- Using standard fonts from design system -->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap">
<!-- Keep existing stylesheets for nav/base -->
<link href="./assets/css/nucleo-icons.css" rel="stylesheet">
<link id="pagestyle" href="./assets/css/argon-design-system.css?v=1.0.2" rel="stylesheet">
<link rel="stylesheet" href="css/main.css">
<link rel="stylesheet" href="assets/css/fog-redesign.css?v=1">
<link rel="stylesheet" href="assets/css/fog-home.css?v=1">

<style>
/* Scoped styles for sensor data page */
.sensor-page {
    max-width: 1200px;
    margin: 40px auto;
    padding: 0 24px;
}

.ed-page-title {
    font-family: var(--ff-sans);
    font-size: 36px;
    font-weight: 600;
    letter-spacing: -0.02em;
    color: #1E293B;
    margin: 0 0 8px 0;
    line-height: 1.1;
    animation: fadeSlideUp 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
    opacity: 0;
    transform: translateY(4px);
}
.ed-page-eyebrow {
    font-family: var(--ff-sans);
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #64748b;
    margin: 0;
    animation: fadeSlideUp 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) 0.05s forwards;
    opacity: 0;
    transform: translateY(4px);
}

.data-status-banner {
    display: flex;
    justify-content: flex-start;
    gap: 48px;
    align-items: center;
    padding: 0 0 12px 0;
    border-bottom: 1px solid var(--rule);
    margin-top: 24px;
    margin-bottom: 32px;
    animation: fadeSlideUp 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) 0.1s forwards;
    opacity: 0;
    transform: translateY(4px);
}
.ds-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
}
.ds-label {
    font-family: var(--ff-sans);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--ink-3);
}
.ds-val {
    font-family: var(--ff-mono);
    font-size: 13px;
    color: var(--ink);
}
.status-dot {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #10b981;
    margin-right: 6px;
    vertical-align: middle;
    animation: pulseActive 3s infinite ease-in-out;
}

.editorial-metric-row {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 40px;
    animation: fadeSlideUp 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) 0.15s forwards;
    opacity: 0;
    transform: translateY(4px);
}
.editorial-metric {
    display: flex;
    flex-direction: column;
    gap: 6px;
    border-left: 1px solid var(--rule);
    padding: 0 40px 0 20px;
}
.editorial-metric:first-child {
    border-left: none;
    padding-left: 0;
}
.ed-label {
    font-family: var(--ff-sans);
    font-size: 13px;
    font-weight: 500;
    color: var(--ink-2);
    letter-spacing: 0.08em;
    text-transform: uppercase;
}
.ed-val {
    font-family: var(--ff-sans);
    font-size: 34px;
    font-weight: 400;
    color: #1E293B;
    line-height: 1;
    transition: opacity 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), filter 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.editorial-metric.primary .ed-val {
    font-weight: 500;
    color: #059669; /* Observatory green accent */
}
.ed-val.loading-state {
    opacity: 0.4;
    filter: blur(2px);
}
.ed-unit {
    font-size: 14px;
    color: var(--ink-3);
    margin-left: 4px;
}
.ed-sub {
    font-family: var(--ff-sans);
    font-size: 13px;
    color: var(--ink-3);
}

.ed-obs-window {
    display: flex;
    align-items: flex-end;
    gap: 16px;
    margin-bottom: 60px;
    animation: fadeSlideUp 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) 0.2s forwards;
    opacity: 0;
    transform: translateY(4px);
}
.ed-obs-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.ed-obs-label {
    font-family: var(--ff-sans);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #64748b;
}
.ed-date-inputs {
    display: flex;
    gap: 8px;
    align-items: center;
}
.ed-date-input {
    font-family: var(--ff-sans);
    font-size: 14px;
    color: #1E293B;
    background: #FAFAFA;
    border: 1px solid var(--rule);
    border-radius: 6px;
    padding: 8px 12px;
    height: 38px;
    box-sizing: border-box;
    transition: all 0.15s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.ed-date-input:focus {
    outline: none;
    border-color: #64748b;
    background: #FFFFFF;
}
.ed-apply-btn {
    font-family: var(--ff-sans);
    font-size: 14px;
    font-weight: 500;
    color: var(--paper);
    background: #1E293B;
    border: none;
    border-radius: 6px;
    height: 38px;
    padding: 0 16px;
    cursor: pointer;
    transition: all 0.15s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.ed-apply-btn:hover {
    background: #334155;
}
.ed-quick-ranges {
    display: flex;
    background: #FAFAFA;
    border: 1px solid var(--rule);
    border-radius: 6px;
    padding: 3px;
    height: 38px;
    box-sizing: border-box;
}
.ed-quick-range-opt {
    font-family: var(--ff-sans);
    font-size: 13px;
    font-weight: 500;
    color: #64748b;
    background: transparent;
    border: none;
    border-radius: 4px;
    padding: 0 12px;
    cursor: pointer;
    transition: all 0.15s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.ed-quick-range-opt:hover {
    color: #1E293B;
}
.ed-quick-range-opt.active {
    background: #FFFFFF;
    color: #1E293B;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

@keyframes fadeSlideUp {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
@keyframes pulseActive {
    0% { opacity: 0.7; }
    50% { opacity: 1; }
    100% { opacity: 0.7; }
}

.chart-section {
    margin-bottom: 60px;
    padding-top: 20px;
    border-top: 1px solid var(--rule);
}
.chart-container {
    height: 400px;
    margin-top: 16px;
    border: 1px solid var(--rule);
    border-radius: var(--home-radius);
    background: var(--paper);
    overflow: hidden;
}

@media(max-width: 768px) {
    .data-status-banner {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }
}
</style>
<script>
(function () {
  try {
    var t = localStorage.getItem('fog-theme');
    if (t === 'dark' || t === 'light') { document.documentElement.setAttribute('data-theme', t); }
  } catch (e) {}
})();
</script>
</head>
<body class="fog-body fog-app">

<?php include __DIR__ . '/navbar.php'; ?>

<main class="sensor-page">
    
    <header style="margin-bottom: 16px;">
        <h1 class="ed-page-title">WEATHER STATION OBSERVATIONS</h1>
        <div class="ed-page-eyebrow">IIT KANPUR OBSERVATORY &middot; <span id="sync-status">SYNCING...</span></div>
    </header>

    <div class="data-status-banner">
        <div class="ds-group">
            <div class="ds-label">DATA STATUS</div>
            <div class="ds-val"><span class="status-dot" id="status-dot"></span><strong id="val-data-status">CHECKING</strong></div>
        </div>
        <div class="ds-group">
            <div class="ds-label">LAST OBSERVED</div>
            <div class="ds-val" id="val-last-obs">--</div>
        </div>
        <div class="ds-group">
            <div class="ds-label">AGGREGATION</div>
            <div class="ds-val">5 min (Met) / 30 min (AWS)</div>
        </div>
    </div>

    <!-- Editorial Metric Strip -->
    <div class="editorial-metric-row">
        <div class="editorial-metric primary">
            <div class="ed-label">VISIBILITY</div>
            <div class="ed-val" id="val-vis">-- <span class="ed-unit">km</span></div>
            <div class="ed-sub">Observed visibility</div>
        </div>
        <div class="editorial-metric">
            <div class="ed-label">TEMPERATURE</div>
            <div class="ed-val" id="val-temp">-- <span class="ed-unit">°C</span></div>
            <div class="ed-sub">Observed</div>
        </div>
        <div class="editorial-metric">
            <div class="ed-label">HUMIDITY</div>
            <div class="ed-val" id="val-hum">-- <span class="ed-unit">%</span></div>
            <div class="ed-sub">Observed</div>
        </div>
        <div class="editorial-metric">
            <div class="ed-label">WIND</div>
            <div class="ed-val" id="val-wind">-- <span class="ed-unit">m/s</span></div>
            <div class="ed-sub">Observed</div>
        </div>
        <div class="editorial-metric">
            <div class="ed-label">PRESSURE</div>
            <div class="ed-val" id="val-pres">-- <span class="ed-unit">hPa</span></div>
            <div class="ed-sub">Observed</div>
        </div>
        <div class="editorial-metric">
            <div class="ed-label">PM 2.5</div>
            <div class="ed-val" id="val-pm25">-- <span class="ed-unit">µg/m³</span></div>
            <div class="ed-sub">Observed</div>
        </div>
    </div>

    <!-- Global Date Filter -->
    <div class="ed-obs-window">
        <div class="ed-obs-group">
            <div class="ed-obs-label">OBSERVATION WINDOW</div>
            <div class="ed-date-inputs">
                <input type="date" class="ed-date-input" id="win-start">
                <span style="color: var(--ink-3); margin: 0 4px;">&rarr;</span>
                <input type="date" class="ed-date-input" id="win-end">
                <button class="ed-apply-btn" id="btn-apply-dates">Apply</button>
            </div>
        </div>
        <div class="ed-quick-ranges">
            <button class="ed-quick-range-opt active" data-range="1">24 h</button>
            <button class="ed-quick-range-opt" data-range="7">7 d</button>
            <button class="ed-quick-range-opt" data-range="30">30 d</button>
        </div>
    </div>

    <!-- Section 1: Above Ground -->
    <section class="chart-section" id="sec-above">
        <header class="fc-science-header">
            <h2 class="fc-science-result-title" style="font-size: 20px;">01 &mdash; ABOVE-GROUND OBSERVATIONS</h2>
            <div class="fc-science-eyebrow">VISIBILITY &middot; TEMPERATURE &middot; HUMIDITY &middot; PARTICULATE MATTER</div>
        </header>

        <div id="chart-vis" class="chart-container"></div>
        <div id="chart-temp-layer" class="chart-container"></div>
        <div id="chart-hum-layer" class="chart-container"></div>
        <div id="chart-pm" class="chart-container"></div>
        <div id="chart-nc" class="chart-container"></div>
    </section>

    <!-- Section 2: Below Ground -->
    <section class="chart-section" id="sec-below">
        <header class="fc-science-header">
            <h2 class="fc-science-result-title" style="font-size: 20px;">02 &mdash; BELOW-GROUND OBSERVATIONS</h2>
            <div class="fc-science-eyebrow">SOIL MOISTURE &middot; TEMPERATURE &middot; BEC &middot; RDP/IDP</div>
        </header>

        <div id="chart-soil-moisture" class="chart-container"></div>
        <div id="chart-soil-temp" class="chart-container"></div>
        <div id="chart-soil-bec" class="chart-container"></div>
        <div id="chart-soil-dielectric" class="chart-container"></div>
    </section>

    <!-- Section 3: AWS -->
    <section class="chart-section" id="sec-aws">
        <header class="fc-science-header">
            <h2 class="fc-science-result-title" style="font-size: 20px;">03 &mdash; AUTOMATED WEATHER STATION</h2>
            <div class="fc-science-eyebrow">TEMP &middot; HUMIDITY &middot; WIND &middot; RAIN &middot; SUNSHINE &middot; PRESSURE</div>
        </header>

        <div id="chart-aws-temp" class="chart-container"></div>
        <div id="chart-aws-hum" class="chart-container"></div>
        <div id="chart-aws-wind" class="chart-container"></div>
        <div id="chart-aws-rain" class="chart-container"></div>
        <div id="chart-aws-sun" class="chart-container"></div>
        <div id="chart-aws-pres" class="chart-container"></div>
    </section>

</main>

<script src="./assets/js/core/jquery.min.js"></script>
<script src="https://code.highcharts.com/stock/highstock.js"></script>
<script src="https://code.highcharts.com/modules/exporting.js"></script>
<!-- New clean JS -->
<script src="js/sensordata_app.js"></script>

</body>
</html>
