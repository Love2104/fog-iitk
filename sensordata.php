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
<link rel="stylesheet" href="assets/css/theme.css">
<script>
(function () {
  try {
    var t = localStorage.getItem('fog-theme');
    if (t === 'dark' || t === 'light') {
      document.documentElement.setAttribute('data-theme', t);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  } catch (e) {}
})();
</script>
</head>
<body class="index-page site-page">

<?php if (!defined('FOG_HEAD_DONE')) define('FOG_HEAD_DONE', true); include __DIR__ . '/navbar.php'; ?>

<main class="page sensor-page">
    
    <header class="page-header">
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
                <span>&rarr;</span>
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
            <h2 class="fc-science-result-title">01 &mdash; ABOVE-GROUND OBSERVATIONS</h2>
            <div class="fc-science-eyebrow">VISIBILITY &middot; TEMPERATURE &middot; HUMIDITY &middot; PARTICULATE MATTER</div>
        </header>

        <div class="chart-wrapper"><div id="chart-vis" class="chart-container"></div><div class="chart-empty-state" id="empty-chart-vis"><div class="empty-state-title">NO OBSERVATIONS FOR THIS PERIOD</div><div class="empty-state-desc">Selected: <span class="empty-sel-start"></span> &rarr; <span class="empty-sel-end"></span><br>Latest available: <span class="empty-latest-date"></span></div><button class="empty-state-btn" onclick="snapToLatest()">VIEW LATEST AVAILABLE DATA</button></div></div>
        <div class="chart-wrapper"><div id="chart-temp-layer" class="chart-container"></div><div class="chart-empty-state" id="empty-chart-temp-layer"><div class="empty-state-title">NO OBSERVATIONS FOR THIS PERIOD</div><div class="empty-state-desc">Selected: <span class="empty-sel-start"></span> &rarr; <span class="empty-sel-end"></span><br>Latest available: <span class="empty-latest-date"></span></div><button class="empty-state-btn" onclick="snapToLatest()">VIEW LATEST AVAILABLE DATA</button></div></div>
        <div class="chart-wrapper"><div id="chart-hum-layer" class="chart-container"></div><div class="chart-empty-state" id="empty-chart-hum-layer"><div class="empty-state-title">NO OBSERVATIONS FOR THIS PERIOD</div><div class="empty-state-desc">Selected: <span class="empty-sel-start"></span> &rarr; <span class="empty-sel-end"></span><br>Latest available: <span class="empty-latest-date"></span></div><button class="empty-state-btn" onclick="snapToLatest()">VIEW LATEST AVAILABLE DATA</button></div></div>
        <div class="chart-wrapper"><div id="chart-pm" class="chart-container"></div><div class="chart-empty-state" id="empty-chart-pm"><div class="empty-state-title">NO OBSERVATIONS FOR THIS PERIOD</div><div class="empty-state-desc">Selected: <span class="empty-sel-start"></span> &rarr; <span class="empty-sel-end"></span><br>Latest available: <span class="empty-latest-date"></span></div><button class="empty-state-btn" onclick="snapToLatest()">VIEW LATEST AVAILABLE DATA</button></div></div>
        <div class="chart-wrapper"><div id="chart-nc" class="chart-container"></div><div class="chart-empty-state" id="empty-chart-nc"><div class="empty-state-title">NO OBSERVATIONS FOR THIS PERIOD</div><div class="empty-state-desc">Selected: <span class="empty-sel-start"></span> &rarr; <span class="empty-sel-end"></span><br>Latest available: <span class="empty-latest-date"></span></div><button class="empty-state-btn" onclick="snapToLatest()">VIEW LATEST AVAILABLE DATA</button></div></div>
    </section>

    <!-- Section 2: Below Ground -->
    <section class="chart-section" id="sec-below">
        <header class="fc-science-header">
            <h2 class="fc-science-result-title">02 &mdash; BELOW-GROUND OBSERVATIONS</h2>
            <div class="fc-science-eyebrow">SOIL MOISTURE &middot; TEMPERATURE &middot; BEC &middot; RDP/IDP</div>
        </header>

        <div class="chart-wrapper"><div id="chart-soil-moisture" class="chart-container"></div><div class="chart-empty-state" id="empty-chart-soil-moisture"><div class="empty-state-title">NO OBSERVATIONS FOR THIS PERIOD</div><div class="empty-state-desc">Selected: <span class="empty-sel-start"></span> &rarr; <span class="empty-sel-end"></span><br>Latest available: <span class="empty-latest-date"></span></div><button class="empty-state-btn" onclick="snapToLatest()">VIEW LATEST AVAILABLE DATA</button></div></div>
        <div class="chart-wrapper"><div id="chart-soil-temp" class="chart-container"></div><div class="chart-empty-state" id="empty-chart-soil-temp"><div class="empty-state-title">NO OBSERVATIONS FOR THIS PERIOD</div><div class="empty-state-desc">Selected: <span class="empty-sel-start"></span> &rarr; <span class="empty-sel-end"></span><br>Latest available: <span class="empty-latest-date"></span></div><button class="empty-state-btn" onclick="snapToLatest()">VIEW LATEST AVAILABLE DATA</button></div></div>
        <div class="chart-wrapper"><div id="chart-soil-bec" class="chart-container"></div><div class="chart-empty-state" id="empty-chart-soil-bec"><div class="empty-state-title">NO OBSERVATIONS FOR THIS PERIOD</div><div class="empty-state-desc">Selected: <span class="empty-sel-start"></span> &rarr; <span class="empty-sel-end"></span><br>Latest available: <span class="empty-latest-date"></span></div><button class="empty-state-btn" onclick="snapToLatest()">VIEW LATEST AVAILABLE DATA</button></div></div>
        <div class="chart-wrapper"><div id="chart-soil-dielectric" class="chart-container"></div><div class="chart-empty-state" id="empty-chart-soil-dielectric"><div class="empty-state-title">NO OBSERVATIONS FOR THIS PERIOD</div><div class="empty-state-desc">Selected: <span class="empty-sel-start"></span> &rarr; <span class="empty-sel-end"></span><br>Latest available: <span class="empty-latest-date"></span></div><button class="empty-state-btn" onclick="snapToLatest()">VIEW LATEST AVAILABLE DATA</button></div></div>
    </section>

    <!-- Section 3: AWS -->
    <section class="chart-section" id="sec-aws">
        <header class="fc-science-header">
            <h2 class="fc-science-result-title">03 &mdash; AUTOMATED WEATHER STATION</h2>
            <div class="fc-science-eyebrow">TEMP &middot; HUMIDITY &middot; WIND &middot; RAIN &middot; SUNSHINE &middot; PRESSURE</div>
        </header>

        <div class="chart-wrapper"><div id="chart-aws-temp" class="chart-container"></div><div class="chart-empty-state" id="empty-chart-aws-temp"><div class="empty-state-title">NO OBSERVATIONS FOR THIS PERIOD</div><div class="empty-state-desc">Selected: <span class="empty-sel-start"></span> &rarr; <span class="empty-sel-end"></span><br>Latest available: <span class="empty-latest-date"></span></div><button class="empty-state-btn" onclick="snapToLatest()">VIEW LATEST AVAILABLE DATA</button></div></div>
        <div class="chart-wrapper"><div id="chart-aws-hum" class="chart-container"></div><div class="chart-empty-state" id="empty-chart-aws-hum"><div class="empty-state-title">NO OBSERVATIONS FOR THIS PERIOD</div><div class="empty-state-desc">Selected: <span class="empty-sel-start"></span> &rarr; <span class="empty-sel-end"></span><br>Latest available: <span class="empty-latest-date"></span></div><button class="empty-state-btn" onclick="snapToLatest()">VIEW LATEST AVAILABLE DATA</button></div></div>
        <div class="chart-wrapper"><div id="chart-aws-wind" class="chart-container"></div><div class="chart-empty-state" id="empty-chart-aws-wind"><div class="empty-state-title">NO OBSERVATIONS FOR THIS PERIOD</div><div class="empty-state-desc">Selected: <span class="empty-sel-start"></span> &rarr; <span class="empty-sel-end"></span><br>Latest available: <span class="empty-latest-date"></span></div><button class="empty-state-btn" onclick="snapToLatest()">VIEW LATEST AVAILABLE DATA</button></div></div>
        <div class="chart-wrapper"><div id="chart-aws-rain" class="chart-container"></div><div class="chart-empty-state" id="empty-chart-aws-rain"><div class="empty-state-title">NO OBSERVATIONS FOR THIS PERIOD</div><div class="empty-state-desc">Selected: <span class="empty-sel-start"></span> &rarr; <span class="empty-sel-end"></span><br>Latest available: <span class="empty-latest-date"></span></div><button class="empty-state-btn" onclick="snapToLatest()">VIEW LATEST AVAILABLE DATA</button></div></div>
        <div class="chart-wrapper"><div id="chart-aws-sun" class="chart-container"></div><div class="chart-empty-state" id="empty-chart-aws-sun"><div class="empty-state-title">NO OBSERVATIONS FOR THIS PERIOD</div><div class="empty-state-desc">Selected: <span class="empty-sel-start"></span> &rarr; <span class="empty-sel-end"></span><br>Latest available: <span class="empty-latest-date"></span></div><button class="empty-state-btn" onclick="snapToLatest()">VIEW LATEST AVAILABLE DATA</button></div></div>
        <div class="chart-wrapper"><div id="chart-aws-pres" class="chart-container"></div><div class="chart-empty-state" id="empty-chart-aws-pres"><div class="empty-state-title">NO OBSERVATIONS FOR THIS PERIOD</div><div class="empty-state-desc">Selected: <span class="empty-sel-start"></span> &rarr; <span class="empty-sel-end"></span><br>Latest available: <span class="empty-latest-date"></span></div><button class="empty-state-btn" onclick="snapToLatest()">VIEW LATEST AVAILABLE DATA</button></div></div>
    </section>

</main>
<?php include __DIR__ . "/footer.php"; ?>

<script src="./assets/js/core/jquery.min.js"></script>
<script src="https://code.highcharts.com/stock/highstock.js"></script>
<script src="https://code.highcharts.com/modules/exporting.js"></script>
<!-- New clean JS -->
<script src="js/sensordata_app.js"></script>

</body>
</html>
