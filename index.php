<?php
declare(strict_types=1);

/**
 * Fog IITK — "Now". Current conditions and short-range visibility forecast.
 * Phase 2 redesign. Implements docs/FOG_IITK_WEBSITE_AUDIT.md §33.
 *
 * Every number on this page is read from PostgreSQL through includes/fog_db.php
 * with pg_query_params. No page-level SQL is built by string concatenation
 * except the visitor counters below, which are now parameterised too.
 *
 * Nothing here changes an API contract, a model, a database schema or a URL.
 */

require_once __DIR__ . '/includes/fog_db.php';
require_once __DIR__ . '/includes/fog_chart.php';
require_once __DIR__ . '/includes/india_map.php';

/* Session + the legacy admin flag. Unchanged: this include is shared with the
   12 other pages and its contract is out of scope for this phase. */
include __DIR__ . '/apis/start_admin.php';

/* ------------------------------------------------------- visitor counters ---
   Same tables, same semantics, same rows written as before. The only change is
   that the values are now bound parameters instead of being concatenated into
   the SQL -- the previous form let any client inject through X-Forwarded-For
   and User-Agent (audit SEC-7). Nothing is displayed from these tables: the
   visitor counter is gone from the page (audit UX-15). */
(function (): void {
    $conn = fog_db();
    if ($conn === null) { return; }

    $ip = $_SERVER['HTTP_CLIENT_IP']
        ?? $_SERVER['HTTP_X_FORWARDED_FOR']
        ?? $_SERVER['REMOTE_ADDR']
        ?? '127.0.0.1';
    $ip = substr(trim((string) $ip), 0, 50);

    $client   = (string) ($_SERVER['HTTP_USER_AGENT'] ?? '');
    $osParts  = explode(';', $client);
    $os       = isset($osParts[1]) ? trim($osParts[1], ' ') : 'Unknown';
    $uaParts  = explode(' ', $client);
    $browser  = trim(trim((string) end($uaParts), ' '), '"');
    $now      = date('Y-m-d H:i:s');
    $today    = date('Y-m-d');

    if (!isset($_SESSION['sess_id']) || $_SESSION['sess_id'] !== session_id()) {
        $_SESSION['sess_id'] = session_id();
        $seen = @pg_query_params($conn, 'SELECT ip FROM public.visitor_data WHERE ip = $1', [$ip]);
        if ($seen !== false) {
            if (pg_fetch_row($seen) === false) {
                @pg_query_params(
                    $conn,
                    'INSERT INTO public.visitor_data(ip, last_login, date_joined, visits, os, browser)
                     VALUES ($1, $2, $3, 1, ARRAY[$4]::character varying[], ARRAY[$5]::character varying[])',
                    [$ip, $now, $now, $os, $browser]
                );
            } else {
                @pg_query_params(
                    $conn,
                    'UPDATE public.visitor_data SET last_login = $2, visits = visits + 1 WHERE ip = $1',
                    [$ip, $now]
                );
            }
            pg_free_result($seen);
        }
    }

    if (!isset($_SESSION['last_page_visited']) || $_SESSION['last_page_visited'] !== 'index') {
        $day = @pg_query_params($conn, 'SELECT "date" FROM public.visits WHERE "date" = $1', [$today]);
        if ($day !== false) {
            if (pg_fetch_row($day) === false) {
                @pg_query_params(
                    $conn,
                    'INSERT INTO public.visits("index", past_prediction, compare_results, iit_kanpur, about, "date")
                     VALUES (0, 0, 0, 0, 0, $1)',
                    [$today]
                );
            } else {
                @pg_query_params(
                    $conn,
                    'UPDATE public.visits SET "index" = "index" + 1 WHERE "date" = $1',
                    [$today]
                );
            }
            pg_free_result($day);
        }
        $_SESSION['last_page_visited'] = 'index';
    }
})();

/* ------------------------------------------------------------ page state --- */

$dbUp    = fog_db_available();
$station = fog_resolve_station($_GET['station'] ?? null);
$sid     = $station['id']   ?? null;
$sname   = $station['name'] ?? 'Station unavailable';

$period   = $sid !== null ? fog_record_period($sid) : null;
$latest   = $sid !== null ? fog_latest_observation($sid) : null;
$ladder   = $sid !== null ? fog_forecast_ladder($sid) : null;
$feeds    = $sid !== null ? fog_feed_status($sid) : [];
$campus   = ($sid === 'VIKN') ? fog_campus_visibility() : null;

$GLOBALS['fog_status_feeds'] = $feeds ?: null;

/* --- window -------------------------------------------------------------- */

$tz = fog_tz_ist();
function fog_date_param(?string $v, DateTimeZone $tz): ?DateTimeImmutable
{
    if ($v === null || $v === '') { return null; }
    $d = DateTimeImmutable::createFromFormat('!Y-m-d', $v, $tz);
    return $d === false ? null : $d;
}

$anchor = ($period !== null && $period['last'] !== null)
    ? $period['last']->setTimezone($tz)
    : new DateTimeImmutable('now', $tz);
$defaultTo   = new DateTimeImmutable($anchor->format('Y-m-d') . ' 00:00:00', $tz);
$defaultTo   = $defaultTo->modify('+1 day');
$defaultFrom = $defaultTo->modify('-7 days');

$winFrom = fog_date_param($_GET['from'] ?? null, $tz) ?? $defaultFrom;
$winTo   = fog_date_param($_GET['to'] ?? null, $tz)   ?? $defaultTo;
if ($winTo <= $winFrom) { $winTo = $winFrom->modify('+1 day'); }
if ($winTo->getTimestamp() - $winFrom->getTimestamp() > 400 * 86400) {
    $winFrom = $winTo->modify('-400 days');
}

$series = ($sid !== null)
    ? fog_visibility_series($sid, $winFrom->format('Y-m-d'), $winTo->format('Y-m-d'))
    : null;

/* The forecast run is only drawn on the chart when it actually falls inside the
   window being displayed. Overlaying a run from a different month would be a
   lie dressed as a comparison. */
$chartForecast = [];
$chartBase     = null;
if (is_array($ladder) && !empty($ladder['steps']) && $ladder['base'] !== null
    && $ladder['base'] >= $winFrom && $ladder['base'] <= $winTo) {
    $chartBase = $ladder['base'];
    foreach ($ladder['steps'] as $st) {
        /* fog_chart_render() reads the instant under 't'; the ladder calls it
           'time'. Normalise here rather than leaving the chart to guess. */
        if ($st['time'] !== null && $st['vis_km'] !== null) {
            $chartForecast[] = ['t' => $st['time'], 'vis_km' => $st['vis_km']];
        }
    }
}

$chart = ($series !== null && $series !== [])
    ? fog_chart_render($series, $winFrom, $winTo, $chartForecast, $chartBase)
    : null;

/* --- the reading --------------------------------------------------------- */

$visKm      = null;
$obsTime    = null;
$readSource = null;
$readNote   = null;
$readCadence = FOG_CADENCE_METAR;

if ($latest === null) {
    $readNote = 'service';
} elseif ($latest === []) {
    if (is_array($campus) && $campus !== [] && $campus['vis_km'] !== null) {
        $visKm       = $campus['vis_km'];
        $obsTime     = $campus['time'];
        $readSource  = 'IITK campus visibility sensor (MOR)';
        $readCadence = FOG_CADENCE_CAMPUS;
        $readNote    = $campus['saturated'] ? 'campus-saturated' : 'campus';
    } else {
        $readNote = 'no-record';
    }
} else {
    $visKm      = $latest['vis_km'];
    $obsTime    = $latest['time'];
    $readSource = 'Airport METAR (IEM ASOS)';
    if ($visKm === null) { $readNote = 'no-visibility'; }
}

$state    = fog_state_for_km($visKm);
$obsAge   = fog_age_seconds($obsTime);
$obsTone  = ($obsTime === null) ? 'error' : fog_age_tone($obsAge, $readCadence);
$isStale  = $obsTone !== 'ok';
/* $fogDensity replaced */

[$visNum, $visUnit] = fog_vis_display($visKm);

/* --------------------------------------------------------- the rail ------
   Visibility is read here on five equal segments: 0-50 m, 50-200 m,
   200 m - 1 km, 1-5 km, 5-10 km. The spacing is deliberately NOT linear in
   distance. It is linear in operational consequence, because the difference
   between 50 m and 200 m matters enormously and the difference between 8 km
   and 9 km matters not at all. The tick labels make the scale explicit, and
   the same five segments are reused for every forecast lead time. */

const FOG_RAIL_BOUNDS   = [0.0, 0.05, 0.2, 1.0, 5.0, 10.0];
const FOG_RAIL_ZONES    = ['verydense', 'dense', 'fog', 'clear', 'clear2'];
const FOG_RAIL_TICKS    = ['0', '50 m', '200 m', '1 km', '5 km', '10 km+'];
const FOG_RAIL_GATE_PCT = 60.0;   /* where the 1 km threshold falls */

/** Position of a visibility, in percent along the rail. Null stays null. */
function fog_rail_pos(?float $km): ?float
{
    if ($km === null) { return null; }
    $b = FOG_RAIL_BOUNDS;
    $n = count($b) - 1;
    $v = max(0.0, min($km, $b[$n]));
    for ($i = 1; $i <= $n; $i++) {
        if ($v <= $b[$i] || $i === $n) {
            $lo   = $b[$i - 1];
            $hi   = $b[$i];
            $frac = $hi > $lo ? ($v - $lo) / ($hi - $lo) : 0.0;
            return (($i - 1) + max(0.0, min(1.0, $frac))) / $n * 100.0;
        }
    }
    return null;
}

/** Percent, formatted for a style attribute. */
function fog_pct(float $p): string { return number_format($p, 2, '.', '') . '%'; }


$railPos = fog_rail_pos($visKm);
$fogDensity = $railPos !== null ? round(1.0 - ($railPos / 100.0), 3) : 'null';


/* --- presets ------------------------------------------------------------- */
$presetBase = $anchor;
$presets = [
    '24 h'   => [$defaultTo->modify('-1 day'),   $defaultTo],
    '7 d'    => [$defaultTo->modify('-7 days'),  $defaultTo],
    '30 d'   => [$defaultTo->modify('-30 days'), $defaultTo],
];
if ($period !== null && $period['first'] !== null) {
    $seasonYear = (int) $presetBase->format('n') >= 11
        ? (int) $presetBase->format('Y')
        : (int) $presetBase->format('Y') - 1;
    $presets['Fog season'] = [
        new DateTimeImmutable($seasonYear . '-11-01 00:00:00', $tz),
        new DateTimeImmutable(($seasonYear + 1) . '-03-01 00:00:00', $tz),
    ];
}

function fog_win_url(?string $sid, DateTimeImmutable $f, DateTimeImmutable $t): string
{
    return 'index.php?station=' . rawurlencode((string) $sid)
         . '&amp;from=' . $f->format('Y-m-d') . '&amp;to=' . $t->format('Y-m-d');
}
function fog_preset_active(DateTimeImmutable $a, DateTimeImmutable $b,
                           DateTimeImmutable $f, DateTimeImmutable $t): bool
{
    return $a->format('Y-m-d') === $f->format('Y-m-d') && $b->format('Y-m-d') === $t->format('Y-m-d');
}

$stations = fog_stations() ?? [];
$pageTitle = $dbUp
    ? $sname . ' &middot; current fog conditions &middot; Fog IITK'
    : 'Current fog conditions &middot; Fog IITK';

define('FOG_HEAD_DONE', true);
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title><?php echo $pageTitle; ?></title>
<meta name="description" content="Current visibility and fog state at <?php echo fog_e($sname); ?>, with the next six hours of predicted visibility, from IIT Kanpur's fog observation and forecasting programme.">
<link rel="icon" type="image/png" href="./assets/img/iitk.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&amp;family=Instrument+Sans:wght@400;500;600;700&amp;family=Source+Sans+3:wght@400;600;700&amp;family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&amp;display=swap">
<link href="./assets/css/nucleo-icons.css" rel="stylesheet">
<link href="./assets/css/nucleo-svg.css" rel="stylesheet">
<link id="pagestyle" href="./assets/css/argon-design-system.css?v=1.0.2" rel="stylesheet">
<link rel="stylesheet" href="css/main.css">
<link rel="stylesheet" href="assets/css/fog-home.css">
<link rel="stylesheet" href="assets/css/fog-redesign.css?v=1789772589">
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

<a class="fog-skip" href="#main">Skip to the current reading</a>

<?php include __DIR__ . '/navbar.php'; ?>

<main class="fog-home" id="main" style="--fog-density: <?php echo $fogDensity; ?>;">
  <div class="fog-atmos">
    <div class="fog-layer fog-layer-1"></div>
    <div class="fog-layer fog-layer-2"></div>
    <div class="fog-layer fog-layer-3"></div>
  </div>
  <div class="fog-shell">
    
    <!-- 1. DASHBOARD HERO -->
    <section class="dashboard-section" aria-labelledby="read-h">
      <div class="dashboard-grid">
        <div class="dashboard-left">
      <?php if ($isStale): ?>
      <div class="hero-stale-banner">
        Last observation <?php echo $obsAge !== null ? fog_e(fog_age_human($obsAge)) : 'unknown'; ?>. Not current.
      </div>
      <?php endif; ?>
      
      <div class="hero-super fog-reveal" style="margin-bottom: 8px;">
        <?php echo $isStale ? 'Last report' : 'Current visibility'; ?> &middot; <?php echo fog_e($sname); ?> (<?php echo fog_e((string) $sid); ?>)
      </div>
      
      <div class="hero-main fog-reveal hero-reading" data-fog-value="<?php echo fog_e((string) $visNum); ?>">
        <?php $visParts = explode('.', (string) $visNum, 2); ?>
        <span class="num hero-num js-count-up" style="font-family: var(--ff-sans); font-variant-numeric: tabular-nums;"><?php echo fog_e($visParts[0]); ?><?php if (isset($visParts[1])): ?>.<?php echo fog_e($visParts[1]); ?><?php endif; ?></span>
        <span class="unit hero-unit"><?php echo fog_e($visUnit); ?> visibility</span>
      </div>

      <div class="hero-state" style="color: var(--state-<?php echo $isStale ? 'nodata' : ($state === 'nodata' || $state === 'clear' ? 'clear' : fog_e($state)); ?>);">
        <?php echo $isStale ? 'LAST REPORT: ' : ''; ?><?php echo fog_e(strtoupper(fog_state_word($state))); ?>
      </div>

      <div class="hero-obs-time">
        <div class="data-status" data-stale="<?php echo $isStale ? 'true' : 'false'; ?>">
          <div class="data-status-dot" style="color: var(--state-<?php echo $isStale ? 'fog' : 'clear'; ?>);"></div>
          <?php echo $isStale ? 'Historical observation' : 'Live observation'; ?>
        </div>
        <div>
          Observed <?php echo $obsTime !== null ? fog_fmt($obsTime, 'd M Y') . ' &middot; ' . fog_fmt($obsTime, 'H:i') . ' IST' : 'nothing recorded'; ?>
        </div>
      </div>

      <?php if ($readNote !== null): ?>
        <div class="fog-caption" style="margin-top: 16px; color: var(--state-fog);">
          <?php if ($readNote === 'service'): ?>The observation service could not be reached.
          <?php elseif ($readNote === 'no-record'): ?>This station has no METAR record.
          <?php elseif ($readNote === 'no-visibility'): ?>The latest report omits visibility.
          <?php elseif ($readNote === 'campus-saturated'): ?>Measured by campus forward-scatter sensor (saturates at 2 km).
          <?php elseif ($readNote === 'campus'): ?>Measured by campus forward-scatter sensor.
          <?php endif; ?>
        </div>
      <?php endif; ?>

      <!-- Horizontal Continuous Scale -->
      <div class="fog-scale">
        <div class="fog-scale-track">
          <?php if ($railPos !== null): ?>
            <div class="scale-fill" style="width: <?php echo fog_pct($railPos); ?>"></div>
            <div class="fog-scale-marker" style="left: <?php echo fog_pct($railPos); ?>"></div>
          <?php endif; ?>
          <div class="scale-threshold" style="left: <?php echo fog_pct(FOG_RAIL_GATE_PCT); ?>"></div>
        </div>
          <div class="scale-labels">
            <span>0m</span>
            <span>50m</span>
            <span>200m</span>
            <span style="color: var(--state-fog);">1km</span>
            <span>5km</span>
            <span>10km+</span>
          </div>
        </div>
        </div> <!-- end dashboard-left -->
        
        <div class="dashboard-right fog-reveal">
          <div class="map-container" style="width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <?php
            $primary = []; $others = [];
            foreach ($stations as $s) {
                if ($s['validated']) { $primary[] = $s; } else { $others[] = $s; }
            }
            $otherDots = '';
            foreach ($others as $s) {
                if ($sid !== null && $s['id'] === $sid) { continue; }
                [$x, $y] = fog_map_project($s['lat'], $s['lon']);
                $otherDots .= sprintf('M%.1f %.1fm-2.4 0a2.4 2.4 0 1 0 4.8 0a2.4 2.4 0 1 0 -4.8 0', $x, $y);
            }
            ?>
            <svg class="fog-map" viewBox="<?php echo FOG_MAP_VIEWBOX; ?>" role="img" aria-label="Map of India showing observing locations." style="width: 100%; height: auto; max-height: 500px; display: block;">
              <path class="land" d="<?php echo fog_map_outline(); ?>"/>
              <path class="states" d="<?php echo fog_map_states(); ?>"/>
              <?php if ($otherDots !== ''): ?>
                <path class="dot" d="<?php echo $otherDots; ?>"/>
              <?php endif; ?>
              <?php foreach ($primary as $s):
                if ($sid !== null && $s['id'] === $sid) { continue; }
                [$x, $y] = fog_map_project($s['lat'], $s['lon']); ?>
                <a href="index.php?station=<?php echo fog_e(rawurlencode($s['id'])); ?>" aria-label="<?php echo fog_e($s['name']); ?>">
                  <title><?php echo fog_e($s['name'] . ' (' . $s['id'] . ')'); ?></title>
                  <circle class="hit" cx="<?php echo round($x, 1); ?>" cy="<?php echo round($y, 1); ?>" r="22"/>
                  <circle class="dot-validated" cx="<?php echo round($x, 1); ?>" cy="<?php echo round($y, 1); ?>" r="4"/>
                  <circle class="ring" cx="<?php echo round($x, 1); ?>" cy="<?php echo round($y, 1); ?>" r="9"/>
                </a>
              <?php endforeach; ?>
              <?php if ($station !== null):
                [$x, $y] = fog_map_project($station['lat'], $station['lon']); ?>
                <circle class="sel" cx="<?php echo round($x, 1); ?>" cy="<?php echo round($y, 1); ?>" r="5"/>
                <circle class="sel-ring" cx="<?php echo round($x, 1); ?>" cy="<?php echo round($y, 1); ?>" r="11"/>
                <text class="sel-label" x="<?php echo round($x + 17, 1); ?>" y="<?php echo round($y + 5, 1); ?>"><?php echo fog_e($station['name']); ?></text>
              <?php endif; ?>
            </svg>
            <?php if ($station !== null): ?>
            <div class="map-legend">
              <div class="map-legend-item"><div class="map-legend-dot map-legend-dot--validated"></div>Validated station</div>
              <div class="map-legend-item"><div class="map-legend-dot map-legend-dot--selected"></div>Selected</div>
            </div>
            <?php endif; ?>
          </div>
        </div> <!-- end dashboard-right -->
      </div>
    </section>

    <!-- 2. CURRENT CONDITIONS STRIP -->
    <section class="conditions-grid">
      <?php
      $o = ($latest !== null && $latest !== []) ? $latest : null;
      $spread = $o['spread_c'] ?? null;
      
      $metrics = [
          ['Temperature', $o['temp_c'] ?? null, 1, '&deg;C'],
          ['Dew point', $o['dew_c'] ?? null, 1, '&deg;C'],
          ['Depression', $spread, 1, 'K'],
          ['Humidity', $o['rh'] ?? null, 0, '%'],
          ['Wind', $o['wind_kmh'] ?? null, 0, 'km/h'],
          ['Pressure', $o['pressure'] ?? null, 0, 'hPa']
      ];
      foreach ($metrics as $m):
          [$label, $value, $dp, $unit] = $m;
          $isDep = ($label === 'Depression');
      ?>
      <div class="cond-cell fog-reveal">
        <div class="cond-label"><?php echo $label; ?></div>
        <div class="cond-val">
          <?php echo $value !== null ? fog_e(fog_dp($value, $dp)) : '--'; ?>
          <span class="unit"><?php echo $unit; ?></span>
        </div>
        <?php if ($isDep && $value !== null): 
            $depPct = max(0, min(100, ($value / 10) * 100));
        ?>
        <div class="depression-meter">
            <div class="depression-gradient"></div>
            <div class="depression-marker" style="left: <?php echo fog_e((string)$depPct); ?>%;"></div>
        </div>
        <?php endif; ?>
      </div>
      <?php endforeach; ?>
    </section>

    <!-- 3. FORECAST SECTION -->
    <!-- 3. FORECAST SECTION -->
    <section class="forecast-section" id="forecast">
      <div class="fc-science-layout">
        <header class="fc-science-header">
          <div class="fc-science-eyebrow">NEXT 6 HOURS &middot; VISIBILITY FORECAST</div>
        </header>

        <form class="fc-science-controls" method="get" action="index.php">
          <input type="hidden" name="station" value="<?php echo fog_e((string) $sid); ?>">
          
          <div class="fc-science-field">
            <label for="from">FROM</label>
            <input type="date" id="from" name="from" value="<?php echo $winFrom->format('Y-m-d'); ?>"
              <?php if ($period !== null && $period['first'] !== null): ?>
                min="<?php echo fog_fmt($period['first'], 'Y-m-d'); ?>"
                max="<?php echo fog_fmt($period['last'], 'Y-m-d'); ?>"
              <?php endif; ?>>
          </div>
          
          <div class="fc-science-field">
            <label for="to">TO</label>
            <input type="date" id="to" name="to" value="<?php echo $winTo->format('Y-m-d'); ?>"
              <?php if ($period !== null && $period['first'] !== null): ?>
                min="<?php echo fog_fmt($period['first'], 'Y-m-d'); ?>"
                max="<?php echo fog_fmt($period['last']->modify('+1 day'), 'Y-m-d'); ?>"
              <?php endif; ?>>
          </div>
          
          <button type="submit" class="fc-science-btn">Apply</button>
        </form>

        <div class="fc-science-range">
          <?php foreach ($presets as $label => $p): 
             $isActive = fog_preset_active($p[0], $p[1], $winFrom, $winTo);
          ?>
            <a href="index.php?station=<?php echo fog_e(rawurlencode((string) $sid)); ?>&amp;from=<?php echo fog_fmt($p[0], 'Y-m-d'); ?>&amp;to=<?php echo fog_fmt($p[1], 'Y-m-d'); ?>" 
               class="fc-science-range-item <?php echo $isActive ? 'is-active' : ''; ?>" 
               <?php echo $isActive ? 'aria-current="true"' : ''; ?>>
              <?php echo fog_e($label); ?>
            </a>
          <?php endforeach; ?>
        </div>

        <?php
          $fcMin = null; $fcMinStep = null; $fcFirstFog = null;
          if (is_array($ladder) && !empty($ladder['steps'])) {
            foreach ($ladder['steps'] as $st) {
                if ($st['vis_km'] === null) { continue; }
                if ($fcMin === null || $st['vis_km'] < $fcMin) { $fcMin = $st['vis_km']; $fcMinStep = $st; }
                if ($fcFirstFog === null && $st['vis_km'] < FOG_THRESHOLD_KM) { $fcFirstFog = $st; }
            }
          }
          
          $leadWord = static function (?array $st): string {
              if ($st === null) { return ''; }
              return $st['lead_min'] < 60
                  ? '+' . $st['lead_min'] . ' min'
                  : '+' . rtrim(rtrim(number_format($st['lead_min'] / 60, 1, '.', ''), '0'), '.') . ' h';
          };
        ?>

        <div class="fc-science-result">
          <?php if ($ladder === null || empty($ladder['steps'])): ?>
            <div class="fc-science-result-title fc-unavailable"><span class="fc-sci-marker"></span>FORECAST UNAVAILABLE</div>
            <p class="fc-science-result-desc">No prediction data available for this timeframe.</p>
          <?php elseif ($fcFirstFog !== null): ?>
            <div class="fc-science-result-title fc-fog"><span class="fc-sci-marker"></span>FOG PREDICTED FROM <?php echo fog_e(strtoupper($leadWord($fcFirstFog))); ?></div>
            <p class="fc-science-result-desc">Lowest predicted visibility <?php echo fog_dp($fcMin, 2); ?> km at <?php echo fog_e($leadWord($fcMinStep)); ?>.</p>
          <?php else: ?>
            <div class="fc-science-result-title fc-clear"><span class="fc-sci-marker"></span>NO FOG EXPECTED</div>
            <p class="fc-science-result-desc">Forecast visibility remains above the operational 1 km fog threshold throughout the current horizon. Lowest predicted is <?php echo fog_dp($fcMin, 2); ?> km.</p>
          <?php endif; ?>
        </div>
      </div>

      <!-- Hero Chart -->
      <?php if ($series !== null && $series !== []): ?>
      <div class="forecast-chart-container fog-plot">
        <div class="fog-chart-wrap" data-fog-chart data-geometry='<?php echo fog_e(json_encode($chart['geometry'], JSON_UNESCAPED_SLASHES)); ?>'>
          <?php echo $chart['svg']; ?>
        </div>
        <div class="fog-readout" data-fog-readout aria-live="polite"></div>
      </div>
      <?php endif; ?>

      <!-- Inline Timeline -->
      <?php if (is_array($ladder) && !empty($ladder['steps'])): ?>
      <div class="forecast-timeline fog-reveal" role="region" aria-label="Forecast timeline" tabindex="0">
        <?php foreach ($ladder['steps'] as $st): 
          if ($st['vis_km'] === null) continue;
          $lead = $st['lead_min'] < 60 ? '+' . $st['lead_min'] . 'm' : '+' . rtrim(rtrim(number_format($st['lead_min'] / 60, 1, '.', ''), '0'), '.') . 'h';
        ?>
        <div class="tl-step">
          <div class="tl-time"><?php echo $lead; ?></div>
          <div class="tl-val"><?php echo fog_dp($st['vis_km'], 2); ?> km</div>
        </div>
        <?php endforeach; ?>
      </div>
      <?php endif; ?>
    </section>

    <!-- 4. MODEL CONTEXT & RAW METAR -->
    <section class="evidence-section">
      <!-- Model Context -->
      <div class="evidence-block">
        <div class="evidence-title">MODEL CONTEXT</div>
        <?php if (is_array($ladder) && !empty($ladder['steps']) && $ladder['base'] !== null): ?>
        <dl class="evidence-dl">
          <div class="evidence-pair"><dt>Model</dt><dd>Gradient Boosting Regressor</dd></div>
          <div class="evidence-pair"><dt>Run</dt><dd><?php echo fog_fmt($ladder['base'], 'd M Y H:i'); ?> IST</dd></div>
          <div class="evidence-pair"><dt>Interval</dt><dd>30 min</dd></div>
          <?php if ($ladder['base_vis'] !== null): ?>
            <div class="evidence-pair"><dt>Observed at run</dt><dd><?php echo fog_dp($ladder['base_vis'], 2); ?> km</dd></div>
          <?php endif; ?>
        </dl>
        <?php else: ?>
        <p class="fog-caption">Forecast service unavailable.</p>
        <?php endif; ?>
      </div>

      <!-- Raw METAR -->
      <div class="evidence-block">
        <div class="evidence-title">OBSERVATION EVIDENCE</div>
        <dl class="evidence-dl">
           <div class="evidence-pair"><dt>Source</dt><dd><?php echo $readSource !== null ? fog_e($readSource) : 'Source unavailable'; ?></dd></div>
           <div class="evidence-pair"><dt>ICAO</dt><dd><?php echo fog_e((string) $sid); ?></dd></div>
           <div class="evidence-pair"><dt>Timestamp</dt><dd><?php echo $obsTime !== null ? fog_fmt($obsTime, 'd M Y') . ' &middot; ' . fog_fmt($obsTime, 'H:i') . ' IST' : 'N/A'; ?></dd></div>
        </dl>
        <?php if ($latest !== null && $latest !== [] && !empty($latest['metar'])): ?>
          <div class="metar-terminal">
            <?php
              $metarSafe = fog_e($latest['metar']);
              // Highlight wind: e.g. 27005KT or VRB02KT
              $metarSafe = preg_replace('/\b(\d{3}|VRB)(\d{2,3})(G\d{2,3})?(KT|MPS)\b/', '<span style="color:var(--state-clear);">$0</span>', $metarSafe);
              // Highlight visibility: e.g. 0800, 9999
              $metarSafe = preg_replace('/\b(\d{4})\b/', '<span style="color:var(--state-fog);">$0</span>', $metarSafe);
              // Highlight temperatures: e.g. 15/10, M02/M03
              $metarSafe = preg_replace('/\b(M?\d{2})\/(M?\d{2})\b/', '<span style="color:var(--state-dense);">$0</span>', $metarSafe);
              echo $metarSafe;
            ?>
          </div>
        <?php endif; ?>
      </div>
    </section>


  </div>
</main>


<footer class="fog-foot">
    <div class="fog-foot-inner">
      <div class="foot-col">
        <h2>About</h2>
        <ul>
          <li><a href="index.php?station=VIAR">Amritsar</a></li>
          <li><a href="index.php?station=VIDP">Delhi</a></li>
          <li><a href="index.php?station=VEGY">Gaya</a></li>
          <li><a href="index.php?station=VIKN">Kanpur</a></li>
          <li><a href="index.php?station=VIJP">Jaipur</a></li>
        </ul>
      </div>
      <div class="foot-col">
        <h2>The Model</h2>
        <ul>
          <li><a href="about.php#fogcast">FogCast</a></li>
          <li><a href="about.php#spatial">Spatial Fog</a></li>
          <li><a href="about.php#compare">Compare Results</a></li>
        </ul>
      </div>
      <div class="foot-col">
        <h2>Network</h2>
        <ul>
          <li><a href="about.php#sensors">IITK sensors</a></li>
          <li><a href="about.php#insat">INSAT-3D/3S</a></li>
          <li><a href="about.php#cameras">Airstrip cameras</a></li>
          <li><a href="about.php#metar">Airport METAR</a></li>
        </ul>
      </div>
      <div class="foot-col">
        <h2>Project</h2>
        <ul>
          <li><a href="about.php#team">The group</a></li>
          <li><a href="about.php#publications">Publications</a></li>
          <li><a href="about.php#contact">Contact</a></li>
        </ul>
      </div>
    </div>
    <div class="foot-colophon" style="border-top: 1px solid var(--rule-2); margin-top: 32px; padding-top: 16px; color: var(--ink-3); font-size: 14px; text-align: center; max-width: var(--home-shell); margin-left: auto; margin-right: auto;">
      &copy; <?php echo date('Y'); ?> IIT Kanpur. All rights reserved.
    </div>
  </footer>

<?php if (is_array($chart)): ?>
<script type="application/json" id="fog-series"><?php
  echo json_encode($chart['points'], JSON_UNESCAPED_SLASHES); ?></script>
<?php endif; ?>
<script src="js/fog-home.js" defer></script>
</body>
</html>
