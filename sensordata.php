<?php include 'apis/start_admin.php'; ?>
<?php 
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
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel="icon" type="image/png" href="./assets/img/iitk.png">
    <title>Sensor Data Analysis — IIT Kanpur Weather Station</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">

    <!-- Existing Dependencies -->
    <link href="https://use.fontawesome.com/releases/v5.0.6/css/all.css" rel="stylesheet">
    <link href="./assets/css/nucleo-icons.css" rel="stylesheet" />
    <link href="./assets/css/nucleo-svg.css" rel="stylesheet" />
    <link href="./assets/css/argon-design-system.css?v=1.2.0" rel="stylesheet" />
    <link href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/base/jquery-ui.css" rel="stylesheet" />

    <style>
        /* ============================================================
           DESIGN TOKENS
           ============================================================ */
        :root {
            --bg:           #f6f8fa;
            --surface:      #ffffff;
            --border:       #e2e8f0;
            --border-hover: #cbd5e1;
            --text-primary: #0f172a;
            --text-secondary: #475569;
            --text-muted:   #94a3b8;
            --accent:       #0f172a;
            --accent-subtle:#f1f5f9;
            --radius:       4px;
            --font-ui:      'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            --font-data:    'JetBrains Mono', 'SF Mono', 'Fira Code', monospace;
        }

        /* ============================================================
           RESET & BASE
           ============================================================ */
        body {
            font-family: var(--font-ui) !important;
            background-color: var(--bg) !important;
            color: var(--text-primary);
            overflow-x: hidden;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

        *, *::before, *::after { box-sizing: border-box; }

        .highcharts-credits { display: none; }

        /* ============================================================
           LAYOUT CONTAINER
           ============================================================ */
        .page-container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 24px 80px 24px;
        }

        /* ============================================================
           STATION METADATA BAR
           ============================================================ */
        .metadata-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 24px;
            background: var(--surface);
            border-bottom: 1px solid var(--border);
            font-family: var(--font-data);
            font-size: 11px;
            color: var(--text-muted);
            letter-spacing: 0.02em;
            max-width: 100%;
        }
        .metadata-bar .station-info {
            display: flex;
            align-items: center;
            gap: 16px;
        }
        .metadata-bar .station-info span {
            display: flex;
            align-items: center;
            gap: 4px;
        }
        .metadata-bar .sync-status {
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .sync-dot {
            width: 6px; height: 6px;
            border-radius: 50%;
            background: #22c55e;
            display: inline-block;
        }

        /* ============================================================
           STICKY SECTION NAVIGATOR
           ============================================================ */
        .section-nav {
            position: sticky;
            top: 74px;
            z-index: 1020;
            background: rgba(246, 248, 250, 0.92);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            border-bottom: 1px solid var(--border);
            padding: 0 24px;
            display: flex;
            align-items: stretch;
            gap: 0;
        }
        .section-nav a {
            padding: 12px 16px;
            color: var(--text-muted);
            font-weight: 500;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            border-bottom: 2px solid transparent;
            text-decoration: none;
            transition: color 0.15s, border-color 0.15s;
        }
        .section-nav a:hover {
            color: var(--text-secondary);
        }
        .section-nav a.active {
            color: var(--text-primary);
            border-bottom-color: var(--text-primary);
        }

        /* ============================================================
           SECTION HEADERS
           ============================================================ */
        .section-heading {
            font-size: 13px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            color: var(--text-secondary);
            margin: 40px 0 16px 0;
            padding-bottom: 8px;
            border-bottom: 1px solid var(--border);
        }

        /* ============================================================
           ANALYSIS PERIOD TOOLBAR
           ============================================================ */
        .toolbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            padding: 8px 12px;
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: var(--radius);
            margin-bottom: 16px;
            flex-wrap: wrap;
        }
        .toolbar-left, .toolbar-right {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .toolbar label {
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            color: var(--text-muted);
            font-weight: 600;
            margin: 0;
        }
        .toolbar input[type="text"],
        .toolbar input[type="date"] {
            font-family: var(--font-data);
            font-size: 12px;
            padding: 4px 8px;
            border: 1px solid var(--border);
            border-radius: var(--radius);
            background: var(--bg);
            color: var(--text-primary);
            width: 120px;
            height: 28px;
        }
        .toolbar input:focus {
            outline: none;
            border-color: var(--text-secondary);
        }
        .toolbar-btn {
            font-family: var(--font-data);
            font-size: 11px;
            font-weight: 500;
            padding: 4px 10px;
            height: 28px;
            border: 1px solid var(--border);
            border-radius: var(--radius);
            background: var(--surface);
            color: var(--text-secondary);
            cursor: pointer;
            transition: all 0.15s;
        }
        .toolbar-btn:hover {
            background: var(--accent-subtle);
            border-color: var(--border-hover);
        }
        .toolbar-btn.active, .toolbar-btn-primary {
            background: var(--accent);
            color: #fff;
            border-color: var(--accent);
        }

        /* ============================================================
           CHART PANELS
           ============================================================ */
        .chart-panel {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: var(--radius);
            margin-bottom: 12px;
            transition: border-color 0.2s;
        }
        .chart-panel:hover {
            border-color: var(--border-hover);
        }
        .chart-panel-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 16px;
            border-bottom: 1px solid var(--border);
            background: var(--accent-subtle);
            border-radius: var(--radius) var(--radius) 0 0;
        }
        .chart-panel-title {
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            color: var(--text-secondary);
        }
        .chart-panel-badge {
            font-family: var(--font-data);
            font-size: 10px;
            font-weight: 500;
            padding: 2px 6px;
            border-radius: var(--radius);
            background: var(--bg);
            border: 1px solid var(--border);
            color: var(--text-muted);
        }
        .chart-panel-body {
            padding: 8px 12px;
        }

        /* ============================================================
           CHART GRIDS
           ============================================================ */
        .chart-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 12px;
        }
        @media (min-width: 992px) {
            .chart-grid-2 { grid-template-columns: 1fr 1fr; }
            .chart-grid-3 { grid-template-columns: 1fr 1fr 1fr; }
        }
        .chart-full { grid-column: 1 / -1; }

        /* ============================================================
           AWS METRIC STRIP
           ============================================================ */
        .aws-strip {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 1px;
            background: var(--border);
            border: 1px solid var(--border);
            border-radius: var(--radius);
            overflow: hidden;
            margin-bottom: 16px;
        }
        .aws-metric-cell {
            background: var(--surface);
            padding: 12px 14px;
        }
        .aws-metric-label {
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            color: var(--text-muted);
            font-weight: 600;
            margin-bottom: 4px;
        }
        .aws-metric-value {
            font-family: var(--font-data);
            font-size: 18px;
            font-weight: 600;
            color: var(--text-primary);
            line-height: 1.2;
        }
        .aws-metric-unit {
            font-size: 11px;
            font-weight: 400;
            color: var(--text-muted);
            margin-left: 2px;
        }

        /* ============================================================
           AQI REFERENCE SCALE
           ============================================================ */
        .aqi-scale {
            display: flex;
            gap: 0;
            margin-top: 4px;
            border-radius: var(--radius);
            overflow: hidden;
            font-size: 9px;
            font-weight: 600;
            letter-spacing: 0.03em;
        }
        .aqi-scale span {
            flex: 1;
            text-align: center;
            padding: 3px 0;
            color: #fff;
        }

        /* ============================================================
           RESPONSIVE
           ============================================================ */
        @media (max-width: 768px) {
            .page-container { padding: 0 12px 60px 12px; }
            .metadata-bar { flex-direction: column; align-items: flex-start; gap: 4px; padding: 8px 12px; }
            .section-nav { gap: 0; padding: 0 8px; overflow-x: auto; scrollbar-width: none; }
            .section-nav::-webkit-scrollbar { display: none; }
            .section-nav a { white-space: nowrap; padding: 10px 12px; font-size: 10px; }
            .aws-strip { grid-template-columns: repeat(3, 1fr); }
            .chart-grid-2, .chart-grid-3 { grid-template-columns: 1fr; }
            .toolbar { flex-direction: column; align-items: stretch; }
            .toolbar-left, .toolbar-right { flex-wrap: wrap; }
        }
        @media (max-width: 480px) {
            .aws-strip { grid-template-columns: repeat(2, 1fr); }
        }

        /* ============================================================
           HIGHCHARTS OVERRIDES
           ============================================================ */
        .highcharts-background { fill: transparent !important; }
        .highcharts-range-selector-buttons text {
            font-family: var(--font-data) !important;
            font-size: 10px !important;
            fill: var(--text-muted) !important;
        }
        .highcharts-button-normal rect {
            fill: transparent !important;
            stroke: var(--border) !important;
            rx: 3 !important;
            ry: 3 !important;
        }
        .highcharts-button-pressed rect {
            fill: var(--accent-subtle) !important;
            stroke: var(--border-hover) !important;
        }
        .highcharts-button-pressed text {
            fill: var(--text-primary) !important;
            font-weight: 600 !important;
        }
        .highcharts-navigator-mask-inside {
            fill: rgba(15, 23, 42, 0.04) !important;
        }
        .highcharts-navigator-outline {
            stroke: var(--border) !important;
        }
        .highcharts-grid-line {
            stroke: #f1f5f9 !important;
            stroke-dasharray: 4, 4 !important;
        }
        .highcharts-axis-line {
            stroke: var(--border) !important;
        }
        .highcharts-tick {
            stroke: var(--border) !important;
        }
        .highcharts-axis-labels text {
            font-family: var(--font-data) !important;
            font-size: 10px !important;
            fill: var(--text-muted) !important;
        }
        .highcharts-legend-item text {
            font-family: var(--font-ui) !important;
            font-size: 11px !important;
            fill: var(--text-secondary) !important;
            font-weight: 500 !important;
        }
        .highcharts-tooltip-box {
            fill: rgba(255,255,255,0.96) !important;
            stroke: var(--border) !important;
        }
        .highcharts-tooltip text {
            font-family: var(--font-data) !important;
            font-size: 11px !important;
        }

        /* jQuery UI datepicker overrides */
        .ui-datepicker { font-family: var(--font-ui) !important; font-size: 12px !important; }
    </style>
</head>

<body id="page" class="index-page">

    <!-- Existing navbar (UNCHANGED) -->
    <?php include "navbar.php"; ?>

    <!-- Station Metadata Bar -->
    <div class="metadata-bar" style="margin-top: 75px;">
        <div class="station-info">
            <span>IIT KANPUR ATMOSPHERIC OBSERVATORY</span>
            <span>26.51°N  80.23°E</span>
            <span>ELEV 126 m</span>
        </div>
        <div class="sync-status">
            <span class="sync-dot"></span>
            <span id="sync-time">LIVE</span>
        </div>
    </div>

    <!-- Sticky Section Navigator -->
    <div class="section-nav">
        <a href="#section-sensors" class="nav-scroll active">Sensors</a>
        <a href="#section-belowground" class="nav-scroll">Below Ground</a>
        <a href="#section-aws" class="nav-scroll">AWS</a>
    </div>

    <div class="page-container">

        <!-- ====================================================
             SECTION 1: ABOVE-GROUND SENSORS
             ==================================================== -->
        <h2 id="section-sensors" class="section-heading">Above-Ground Sensors</h2>

        <!-- Toolbar -->
        <div class="toolbar">
            <div class="toolbar-left">
                <label>Range</label>
                <input type="text" id="sensor_start_date" placeholder="Start" autocomplete="off">
                <span style="color: var(--text-muted); font-size: 11px;">→</span>
                <input type="text" id="sensor_end_date" placeholder="End" autocomplete="off">
                <button class="toolbar-btn toolbar-btn-primary" onclick="sensor_sub()">Apply</button>
            </div>
            <div class="toolbar-right">
                <button class="toolbar-btn active" onclick="showdata2('1 DAY')">1D</button>
                <button class="toolbar-btn" onclick="showdata2('1 WEEK')">1W</button>
                <button class="toolbar-btn" onclick="showdata2('1 MONTH')">1M</button>
                <button class="toolbar-btn" onclick="showdata2('1 YEAR')">1Y</button>
                <button class="toolbar-btn" onclick="showdata2('ALL')">All</button>
            </div>
        </div>

        <!-- Visibility (Hero Chart) -->
        <div class="chart-panel">
            <div class="chart-panel-header">
                <span class="chart-panel-title">Visibility</span>
                <span class="chart-panel-badge">km</span>
            </div>
            <div class="chart-panel-body">
                <div id="Visibility" style="width:100%; height:380px;"></div>
            </div>
        </div>

        <!-- Layer Temperature + Layer Humidity (side by side) -->
        <div class="chart-grid chart-grid-2">
            <div class="chart-panel">
                <div class="chart-panel-header">
                    <span class="chart-panel-title">Layer Temperature</span>
                    <span class="chart-panel-badge">°C</span>
                </div>
                <div class="chart-panel-body">
                    <div id="Layer-Temperature" style="width:100%; height:300px;"></div>
                </div>
            </div>
            <div class="chart-panel">
                <div class="chart-panel-header">
                    <span class="chart-panel-title">Layer Humidity</span>
                    <span class="chart-panel-badge">%</span>
                </div>
                <div class="chart-panel-body">
                    <div id="Layer-Humidity" style="width:100%; height:300px;"></div>
                </div>
            </div>
        </div>

        <!-- PM + AQI (full width) -->
        <div class="chart-panel">
            <div class="chart-panel-header">
                <span class="chart-panel-title">Particulate Matter &amp; AQI</span>
                <span class="chart-panel-badge">μg/m³</span>
            </div>
            <div class="chart-panel-body">
                <div id="PM" style="width:100%; height:320px;"></div>
                <div class="aqi-scale" style="margin-top:8px;">
                    <span style="background:#22c55e;">0–50 Good</span>
                    <span style="background:#eab308;">51–100 Moderate</span>
                    <span style="background:#f97316;">101–200 Poor</span>
                    <span style="background:#ef4444;">201–300 Very Poor</span>
                    <span style="background:#7f1d1d;">301–500 Severe</span>
                </div>
            </div>
        </div>

        <!-- Particle Number Concentration (full width) -->
        <div class="chart-panel">
            <div class="chart-panel-header">
                <span class="chart-panel-title">Particle Number Concentration</span>
                <span class="chart-panel-badge">#/cm³</span>
            </div>
            <div class="chart-panel-body">
                <div id="NC" style="width:100%; height:300px;"></div>
            </div>
        </div>


        <!-- ====================================================
             SECTION 2: BELOW-GROUND SENSORS
             ==================================================== -->
        <h2 id="section-belowground" class="section-heading">Below-Ground Sensors</h2>

        <!-- Toolbar -->
        <div class="toolbar">
            <div class="toolbar-left">
                <label>Range</label>
                <input type="text" id="ground_start_date" placeholder="Start" autocomplete="off">
                <span style="color: var(--text-muted); font-size: 11px;">→</span>
                <input type="text" id="ground_end_date" placeholder="End" autocomplete="off">
                <button class="toolbar-btn toolbar-btn-primary" onclick="ground_sub()">Apply</button>
            </div>
            <div class="toolbar-right">
                <button class="toolbar-btn active" onclick="showdata1('1 DAY')">1D</button>
                <button class="toolbar-btn" onclick="showdata1('1 WEEK')">1W</button>
                <button class="toolbar-btn" onclick="showdata1('1 MONTH')">1M</button>
                <button class="toolbar-btn" onclick="showdata1('1 YEAR')">1Y</button>
                <button class="toolbar-btn" onclick="showdata1('ALL')">All</button>
            </div>
        </div>

        <!-- Soil Moisture (Hero) -->
        <div class="chart-panel">
            <div class="chart-panel-header">
                <span class="chart-panel-title">Soil Moisture</span>
                <span class="chart-panel-badge">VWC</span>
            </div>
            <div class="chart-panel-body">
                <div id="Soil Moisture" style="width:100%; height:350px;"></div>
            </div>
        </div>

        <!-- Soil Temp + BECTC (side by side) -->
        <div class="chart-grid chart-grid-2">
            <div class="chart-panel">
                <div class="chart-panel-header">
                    <span class="chart-panel-title">Soil Temperature</span>
                    <span class="chart-panel-badge">°C</span>
                </div>
                <div class="chart-panel-body">
                    <div id="Temp" style="width:100%; height:280px;"></div>
                </div>
            </div>
            <div class="chart-panel">
                <div class="chart-panel-header">
                    <span class="chart-panel-title">Bulk Electrical Conductivity</span>
                    <span class="chart-panel-badge">S/m</span>
                </div>
                <div class="chart-panel-body">
                    <div id="BECTC" style="width:100%; height:280px;"></div>
                </div>
            </div>
        </div>

        <!-- RDP + IDP (side by side) -->
        <div class="chart-grid chart-grid-2">
            <div class="chart-panel">
                <div class="chart-panel-header">
                    <span class="chart-panel-title">Real Dielectric Permittivity</span>
                    <span class="chart-panel-badge">RDP</span>
                </div>
                <div class="chart-panel-body">
                    <div id="RDP" style="width:100%; height:280px;"></div>
                </div>
            </div>
            <div class="chart-panel">
                <div class="chart-panel-header">
                    <span class="chart-panel-title">Imaginary Dielectric Permittivity</span>
                    <span class="chart-panel-badge">IDP</span>
                </div>
                <div class="chart-panel-body">
                    <div id="IDP" style="width:100%; height:280px;"></div>
                </div>
            </div>
        </div>


        <!-- ====================================================
             SECTION 3: AWS (AUTOMATIC WEATHER STATION)
             ==================================================== -->
        <h2 id="section-aws" class="section-heading">Automatic Weather Station</h2>

        <!-- Toolbar -->
        <div class="toolbar">
            <div class="toolbar-left">
                <label>Range</label>
                <input type="text" id="aws_start_date" placeholder="Start" autocomplete="off">
                <span style="color: var(--text-muted); font-size: 11px;">→</span>
                <input type="text" id="aws_end_date" placeholder="End" autocomplete="off">
                <button class="toolbar-btn toolbar-btn-primary" onclick="aws_sub()">Apply</button>
            </div>
            <div class="toolbar-right">
                <button class="toolbar-btn active" onclick="showdata('1 DAY')">1D</button>
                <button class="toolbar-btn" onclick="showdata('1 WEEK')">1W</button>
                <button class="toolbar-btn" onclick="showdata('1 MONTH')">1M</button>
                <button class="toolbar-btn" onclick="showdata('1 YEAR')">1Y</button>
                <button class="toolbar-btn" onclick="showdata('ALL')">All</button>
            </div>
        </div>

        <!-- AWS Summary Strip -->
        <div class="aws-strip" id="aws-summary">
            <div class="aws-metric-cell">
                <div class="aws-metric-label">Temperature</div>
                <div class="aws-metric-value" id="aws-val-temp">—<span class="aws-metric-unit">°C</span></div>
            </div>
            <div class="aws-metric-cell">
                <div class="aws-metric-label">Humidity</div>
                <div class="aws-metric-value" id="aws-val-hum">—<span class="aws-metric-unit">%</span></div>
            </div>
            <div class="aws-metric-cell">
                <div class="aws-metric-label">Wind</div>
                <div class="aws-metric-value" id="aws-val-wind">—<span class="aws-metric-unit">m/s</span></div>
            </div>
            <div class="aws-metric-cell">
                <div class="aws-metric-label">Pressure</div>
                <div class="aws-metric-value" id="aws-val-pres">—<span class="aws-metric-unit">hPa</span></div>
            </div>
            <div class="aws-metric-cell">
                <div class="aws-metric-label">Rain</div>
                <div class="aws-metric-value" id="aws-val-rain">—<span class="aws-metric-unit">mm</span></div>
            </div>
            <div class="aws-metric-cell">
                <div class="aws-metric-label">Sunshine</div>
                <div class="aws-metric-value" id="aws-val-sun">—<span class="aws-metric-unit">W/m²</span></div>
            </div>
        </div>

        <!-- Temperature + Humidity (side by side) -->
        <div class="chart-grid chart-grid-2">
            <div class="chart-panel">
                <div class="chart-panel-header">
                    <span class="chart-panel-title">Temperature</span>
                    <span class="chart-panel-badge">°C</span>
                </div>
                <div class="chart-panel-body">
                    <div id="Temperature" style="width:100%; height:300px;"></div>
                </div>
            </div>
            <div class="chart-panel">
                <div class="chart-panel-header">
                    <span class="chart-panel-title">Humidity</span>
                    <span class="chart-panel-badge">%</span>
                </div>
                <div class="chart-panel-body">
                    <div id="Humidity" style="width:100%; height:300px;"></div>
                </div>
            </div>
        </div>

        <!-- Wind + Sunshine (side by side) -->
        <div class="chart-grid chart-grid-2">
            <div class="chart-panel">
                <div class="chart-panel-header">
                    <span class="chart-panel-title">Wind Speed &amp; Direction</span>
                    <span class="chart-panel-badge">m/s</span>
                </div>
                <div class="chart-panel-body">
                    <div id="Wind" style="width:100%; height:300px;"></div>
                </div>
            </div>
            <div class="chart-panel">
                <div class="chart-panel-header">
                    <span class="chart-panel-title">Solar Radiation</span>
                    <span class="chart-panel-badge">W/m²</span>
                </div>
                <div class="chart-panel-body">
                    <div id="Sunshine" style="width:100%; height:300px;"></div>
                </div>
            </div>
        </div>

        <!-- Pressure + Rain (side by side) -->
        <div class="chart-grid chart-grid-2">
            <div class="chart-panel">
                <div class="chart-panel-header">
                    <span class="chart-panel-title">Atmospheric Pressure</span>
                    <span class="chart-panel-badge">hPa</span>
                </div>
                <div class="chart-panel-body">
                    <div id="Atmospheric Pressure" style="width:100%; height:300px;"></div>
                </div>
            </div>
            <div class="chart-panel">
                <div class="chart-panel-header">
                    <span class="chart-panel-title">Precipitation</span>
                    <span class="chart-panel-badge">mm</span>
                </div>
                <div class="chart-panel-body">
                    <div id="Rain" style="width:100%; height:300px;"></div>
                </div>
            </div>
        </div>

    </div><!-- /.page-container -->


    <!-- Scripts (unchanged dependency chain) -->
    <script src="./assets/js/core/jquery.min.js" type="text/javascript"></script>
    <script src="./assets/js/core/popper.min.js" type="text/javascript"></script>
    <script src="./assets/js/core/bootstrap.min.js" type="text/javascript"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
    <script src="https://code.highcharts.com/stock/highstock.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <!-- Real data script (commented out for design preview — uncomment to restore) -->
    <!-- <script src="./js/sensordata3.js"></script> -->

    <script>
    $(document).ready(function() {

        // ============================================================
        // NAVIGATION: Smooth scroll + scroll spy + toolbar toggles
        // ============================================================
        $('.nav-scroll').on('click', function(e) {
            e.preventDefault();
            $('.nav-scroll').removeClass('active');
            $(this).addClass('active');
            var target = $(this).attr('href');
            $('html, body').animate({ scrollTop: $(target).offset().top - 120 }, 400);
        });

        $(window).scroll(function() {
            var scrollDistance = $(window).scrollTop() + 140;
            var sections = ['#section-sensors', '#section-belowground', '#section-aws'];
            for (var i = sections.length - 1; i >= 0; i--) {
                var el = $(sections[i]);
                if (el.length && el.offset().top <= scrollDistance) {
                    $('.nav-scroll').removeClass('active');
                    $('.nav-scroll').eq(i).addClass('active');
                    break;
                }
            }
        });

        $('.toolbar-right .toolbar-btn').on('click', function() {
            $(this).closest('.toolbar-right').find('.toolbar-btn').removeClass('active');
            $(this).addClass('active');
        });

        $('#sensor_start_date, #sensor_end_date, #ground_start_date, #ground_end_date, #aws_start_date, #aws_end_date').datepicker({
            dateFormat: 'yy-mm-dd'
        });

        // ============================================================
        // MOCK DATA GENERATION UTILITIES
        // ============================================================
        var now = Date.now();
        var DAY = 86400000;
        var HALF_HOUR = 1800000;

        // Generate realistic time-series data
        function genSeries(startOffset, count, interval, baseFn) {
            var data = [];
            var start = now - startOffset;
            for (var i = 0; i < count; i++) {
                var t = start + (i * interval);
                var hour = new Date(t).getHours();
                data.push([t, baseFn(i, hour, count)]);
            }
            return data;
        }

        // Diurnal temperature pattern (warm afternoon, cool night)
        function tempPattern(i, hour, count) {
            var base = 26 + 6 * Math.sin((hour - 6) * Math.PI / 12);
            return +(base + (Math.random() - 0.5) * 2).toFixed(1);
        }
        function humPattern(i, hour) {
            var base = 72 - 20 * Math.sin((hour - 6) * Math.PI / 12);
            return +(base + (Math.random() - 0.5) * 5).toFixed(1);
        }

        // Highcharts global theme
        Highcharts.setOptions({
            chart: {
                style: { fontFamily: "'JetBrains Mono', monospace" },
                backgroundColor: 'transparent'
            },
            credits: { enabled: false },
            title: { text: null },
            colors: ['#0f172a', '#475569', '#94a3b8', '#0ea5e9', '#6366f1'],
            xAxis: {
                lineWidth: 1, lineColor: '#e2e8f0', tickColor: '#e2e8f0',
                labels: { style: { color: '#94a3b8', fontSize: '10px' } },
                crosshair: { color: 'rgba(15,23,42,0.08)', width: 1 }
            },
            yAxis: {
                gridLineColor: '#f1f5f9', gridLineDashStyle: 'Dash',
                labels: { style: { color: '#94a3b8', fontSize: '10px' } },
                title: { text: null }
            },
            tooltip: {
                backgroundColor: 'rgba(255,255,255,0.97)', borderColor: '#e2e8f0',
                borderRadius: 4, shadow: false,
                style: { color: '#0f172a', fontSize: '11px' }
            },
            legend: {
                itemStyle: { color: '#475569', fontWeight: '500', fontFamily: "'Inter', sans-serif", fontSize: '11px' },
                itemHoverStyle: { color: '#0f172a' }
            },
            plotOptions: {
                series: {
                    lineWidth: 1.5,
                    states: { hover: { lineWidth: 2.5 } },
                    marker: { enabled: false, radius: 2 },
                    animation: { duration: 800 }
                },
                area: { fillOpacity: 0.08 },
                column: { borderWidth: 0, borderRadius: 1 }
            },
            navigator: {
                maskFill: 'rgba(15, 23, 42, 0.04)',
                outlineColor: '#e2e8f0',
                handles: { backgroundColor: '#e2e8f0', borderColor: '#94a3b8' },
                series: { lineWidth: 1, color: '#94a3b8' }
            },
            scrollbar: { enabled: false },
            rangeSelector: {
                enabled: true, selected: 0,
                buttonTheme: {
                    fill: 'none', stroke: '#e2e8f0', 'stroke-width': 1, r: 3,
                    style: { color: '#94a3b8', fontSize: '10px', fontWeight: '500' },
                    states: {
                        hover: { fill: '#f1f5f9', style: { color: '#0f172a' } },
                        select: { fill: '#f1f5f9', stroke: '#cbd5e1', style: { color: '#0f172a', fontWeight: '600' } }
                    }
                },
                inputEnabled: false,
                buttons: [
                    { type: 'day', count: 1, text: '1D' },
                    { type: 'week', count: 1, text: '1W' },
                    { type: 'month', count: 1, text: '1M' },
                    { type: 'all', text: 'All' }
                ]
            }
        });


        // ============================================================
        // SECTION 1: ABOVE-GROUND SENSORS (mock charts)
        // ============================================================

        // VISIBILITY — 7 day, half-hourly, with fog threshold
        var visData = genSeries(7 * DAY, 336, HALF_HOUR, function(i, hour) {
            var base = 2.5 + 1.5 * Math.sin((hour - 4) * Math.PI / 10);
            if (hour >= 1 && hour <= 6) base *= 0.3; // fog events at night
            return +(base + (Math.random() - 0.5) * 0.8).toFixed(2);
        });

        Highcharts.stockChart('Visibility', {
            chart: { height: null },
            yAxis: {
                plotLines: [{ value: 1.0, color: '#ef4444', width: 1, dashStyle: 'Dash', zIndex: 5,
                    label: { text: '1 km fog threshold', align: 'right', style: { color: '#ef4444', fontSize: '9px' } }
                }],
                min: 0
            },
            series: [{
                name: 'Visibility',
                data: visData,
                type: 'area',
                color: '#0ea5e9',
                fillColor: { linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [[0, 'rgba(14,165,233,0.12)'], [1, 'rgba(14,165,233,0)']]
                },
                lineWidth: 1.5,
                threshold: null
            }]
        });

        // LAYER TEMPERATURE — 3 layers (1m, 2m, 4m)
        Highcharts.stockChart('Layer-Temperature', {
            chart: { height: null },
            colors: ['#0f172a', '#64748b', '#cbd5e1'],
            series: [
                { name: 'Layer 1 · 1m', data: genSeries(DAY, 48, HALF_HOUR, function(i, h) { return tempPattern(i, h) + 1; }) },
                { name: 'Layer 2 · 2m', data: genSeries(DAY, 48, HALF_HOUR, function(i, h) { return tempPattern(i, h); }) },
                { name: 'Layer 3 · 4m', data: genSeries(DAY, 48, HALF_HOUR, function(i, h) { return tempPattern(i, h) - 0.8; }) }
            ]
        });

        // LAYER HUMIDITY — 3 layers
        Highcharts.stockChart('Layer-Humidity', {
            chart: { height: null },
            colors: ['#3b82f6', '#60a5fa', '#bfdbfe'],
            series: [
                { name: 'Layer 1 · 1m', data: genSeries(DAY, 48, HALF_HOUR, function(i, h) { return humPattern(i, h) + 3; }) },
                { name: 'Layer 2 · 2m', data: genSeries(DAY, 48, HALF_HOUR, function(i, h) { return humPattern(i, h); }) },
                { name: 'Layer 3 · 4m', data: genSeries(DAY, 48, HALF_HOUR, function(i, h) { return humPattern(i, h) - 2; }) }
            ]
        });

        // PM + AQI
        var aqiData = genSeries(DAY, 48, HALF_HOUR, function(i, h) {
            var base = 120 + 60 * Math.sin((h - 8) * Math.PI / 16);
            return Math.round(base + (Math.random() - 0.5) * 40);
        });
        Highcharts.stockChart('PM', {
            chart: { height: null },
            colors: ['#e2e8f0', '#ef4444', '#f97316', '#eab308', '#0ea5e9'],
            series: [
                { name: 'AQI', data: aqiData, type: 'column', color: '#e2e8f0', borderRadius: 1 },
                { name: 'PM 1.0', data: genSeries(DAY, 48, HALF_HOUR, function(i,h) { return +(30 + Math.random() * 25).toFixed(1); }) },
                { name: 'PM 2.5', data: genSeries(DAY, 48, HALF_HOUR, function(i,h) { return +(50 + Math.random() * 40).toFixed(1); }), color: '#ef4444' },
                { name: 'PM 4.0', data: genSeries(DAY, 48, HALF_HOUR, function(i,h) { return +(60 + Math.random() * 50).toFixed(1); }), color: '#f97316' },
                { name: 'PM 10.0', data: genSeries(DAY, 48, HALF_HOUR, function(i,h) { return +(80 + Math.random() * 60).toFixed(1); }), color: '#eab308' }
            ]
        });

        // PARTICLE NUMBER CONCENTRATION
        Highcharts.stockChart('NC', {
            chart: { height: null },
            colors: ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe'],
            series: [
                { name: 'NC 0.5', data: genSeries(DAY, 48, HALF_HOUR, function() { return Math.round(800 + Math.random() * 400); }) },
                { name: 'NC 1.0', data: genSeries(DAY, 48, HALF_HOUR, function() { return Math.round(300 + Math.random() * 200); }) },
                { name: 'NC 2.5', data: genSeries(DAY, 48, HALF_HOUR, function() { return Math.round(80 + Math.random() * 60); }) },
                { name: 'NC 4.0', data: genSeries(DAY, 48, HALF_HOUR, function() { return Math.round(20 + Math.random() * 15); }) },
                { name: 'NC 10.0', data: genSeries(DAY, 48, HALF_HOUR, function() { return Math.round(5 + Math.random() * 8); }) }
            ]
        });


        // ============================================================
        // SECTION 2: BELOW-GROUND SENSORS (mock charts)
        // ============================================================

        // SOIL MOISTURE
        Highcharts.stockChart('Soil Moisture', {
            chart: { height: null },
            yAxis: { title: { text: null } },
            series: [{
                name: 'VWC',
                data: genSeries(7 * DAY, 336, HALF_HOUR, function(i) {
                    return +(0.28 + 0.04 * Math.sin(i * 0.05) + (Math.random() - 0.5) * 0.01).toFixed(3);
                }),
                type: 'area',
                color: '#10b981',
                fillColor: { linearGradient: { x1:0, y1:0, x2:0, y2:1 },
                    stops: [[0, 'rgba(16,185,129,0.12)'], [1, 'rgba(16,185,129,0)']]
                }
            }]
        });

        // SOIL TEMPERATURE
        Highcharts.stockChart('Temp', {
            chart: { height: null },
            series: [{
                name: 'Soil Temp',
                data: genSeries(DAY, 48, HALF_HOUR, function(i, h) {
                    return +(22 + 2 * Math.sin((h - 8) * Math.PI / 14) + (Math.random() - 0.5) * 0.5).toFixed(1);
                }),
                color: '#f59e0b'
            }]
        });

        // BECTC
        Highcharts.stockChart('BECTC', {
            chart: { height: null },
            series: [{
                name: 'BEC',
                data: genSeries(DAY, 48, HALF_HOUR, function(i) {
                    return +(0.05 + 0.01 * Math.sin(i * 0.15) + (Math.random() - 0.5) * 0.003).toFixed(4);
                }),
                color: '#0f172a'
            }]
        });

        // RDP
        Highcharts.stockChart('RDP', {
            chart: { height: null },
            series: [{
                name: 'RDP',
                data: genSeries(DAY, 48, HALF_HOUR, function(i) {
                    return +(18 + 2 * Math.sin(i * 0.08) + (Math.random() - 0.5) * 0.5).toFixed(2);
                }),
                color: '#7c3aed'
            }]
        });

        // IDP
        Highcharts.stockChart('IDP', {
            chart: { height: null },
            series: [{
                name: 'IDP',
                data: genSeries(DAY, 48, HALF_HOUR, function(i) {
                    return +(3.5 + 0.8 * Math.sin(i * 0.1) + (Math.random() - 0.5) * 0.3).toFixed(2);
                }),
                color: '#a78bfa'
            }]
        });


        // ============================================================
        // SECTION 3: AWS (mock charts + summary strip)
        // ============================================================

        // Populate AWS Summary Strip with mock latest values
        document.getElementById('aws-val-temp').innerHTML = '28.4<span class="aws-metric-unit">°C</span>';
        document.getElementById('aws-val-hum').innerHTML = '63.2<span class="aws-metric-unit">%</span>';
        document.getElementById('aws-val-wind').innerHTML = '2.8<span class="aws-metric-unit">m/s</span>';
        document.getElementById('aws-val-pres').innerHTML = '1009<span class="aws-metric-unit">hPa</span>';
        document.getElementById('aws-val-rain').innerHTML = '0.0<span class="aws-metric-unit">mm</span>';
        document.getElementById('aws-val-sun').innerHTML = '482<span class="aws-metric-unit">W/m²</span>';
        document.getElementById('sync-time').textContent = 'SYNCED 14:30 IST';

        // AWS TEMPERATURE
        Highcharts.stockChart('Temperature', {
            chart: { height: null },
            series: [{
                name: 'Temperature',
                data: genSeries(DAY, 48, HALF_HOUR, tempPattern),
                color: '#0f172a',
                type: 'area',
                fillColor: { linearGradient: {x1:0,y1:0,x2:0,y2:1},
                    stops: [[0, 'rgba(15,23,42,0.08)'], [1, 'rgba(15,23,42,0)']]
                }
            }]
        });

        // AWS HUMIDITY
        Highcharts.stockChart('Humidity', {
            chart: { height: null },
            series: [{
                name: 'Humidity',
                data: genSeries(DAY, 48, HALF_HOUR, humPattern),
                color: '#3b82f6',
                type: 'area',
                fillColor: { linearGradient: {x1:0,y1:0,x2:0,y2:1},
                    stops: [[0, 'rgba(59,130,246,0.08)'], [1, 'rgba(59,130,246,0)']]
                }
            }]
        });

        // AWS WIND (speed + direction)
        Highcharts.stockChart('Wind', {
            chart: { height: null },
            series: [{
                name: 'Wind Speed',
                data: genSeries(DAY, 48, HALF_HOUR, function(i, h) {
                    return +(1.5 + 3 * Math.abs(Math.sin(h * 0.3)) + Math.random() * 1.5).toFixed(1);
                }),
                color: '#0f172a'
            }]
        });

        // AWS SUNSHINE
        Highcharts.stockChart('Sunshine', {
            chart: { height: null },
            series: [{
                name: 'Solar Radiation',
                data: genSeries(DAY, 48, HALF_HOUR, function(i, h) {
                    if (h < 6 || h > 18) return 0;
                    return Math.round(800 * Math.sin((h - 6) * Math.PI / 12) + (Math.random() - 0.5) * 50);
                }),
                type: 'area',
                color: '#f59e0b',
                fillColor: { linearGradient: {x1:0,y1:0,x2:0,y2:1},
                    stops: [[0, 'rgba(245,158,11,0.15)'], [1, 'rgba(245,158,11,0)']]
                }
            }]
        });

        // AWS ATMOSPHERIC PRESSURE
        Highcharts.stockChart('Atmospheric Pressure', {
            chart: { height: null },
            series: [{
                name: 'Pressure',
                data: genSeries(DAY, 48, HALF_HOUR, function(i) {
                    return +(1009 + 3 * Math.sin(i * 0.1) + (Math.random() - 0.5) * 0.5).toFixed(1);
                }),
                color: '#0f172a'
            }]
        });

        // AWS RAIN
        Highcharts.stockChart('Rain', {
            chart: { height: null },
            series: [{
                name: 'Rainfall',
                data: genSeries(DAY, 48, HALF_HOUR, function(i, h) {
                    // Occasional rain events
                    if (h >= 14 && h <= 17 && Math.random() > 0.6) return +(Math.random() * 8).toFixed(1);
                    return 0;
                }),
                type: 'column',
                color: '#3b82f6',
                borderRadius: 1
            }]
        });

        // Set date inputs to reasonable defaults
        var d = new Date();
        var s = new Date(); s.setDate(d.getDate() - 1);
        function fmt(dt) { return dt.getFullYear() + '-' + String(dt.getMonth()+1).padStart(2,'0') + '-' + String(dt.getDate()).padStart(2,'0'); }
        $('#sensor_start_date, #ground_start_date, #aws_start_date').val(fmt(s));
        $('#sensor_end_date, #ground_end_date, #aws_end_date').val(fmt(d));

    });
    </script>

</body>
</html>

