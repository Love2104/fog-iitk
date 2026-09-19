<?php
/**
 * Fog IITK — shared navigation.
 * Implements docs/FOG_IITK_WEBSITE_AUDIT.md §32, §39, §43, §44.
 *
 * Information architecture is the live site's (audit §9.1), preserved
 * destination for destination. Nothing here adds, removes or renames a URL.
 *
 * Included by 12 pages that still run Bootstrap 4.3.1 + Argon, so:
 *   - every class is namespaced .fognav*, and fog-nav.css takes back the
 *     properties those frameworks set rather than assuming a clean slate;
 *   - the legacy contract holds: callers set $_GET['page'] before the include
 *     and that still selects the active section. The section is ALSO derived
 *     from the running script, which fixes the case where spatial_fog.php and
 *     fogcast_lite_forecast.php both pass "spatial".
 *
 * The station control is a real <form method="get" action="index.php">, so it
 * works with JavaScript switched off: the typed value lands on
 * index.php?station=..., where fog_resolve_station() already matches an ICAO
 * code or a station name. The suggestion list is revealed by CSS :focus-within,
 * so even the list needs no script. JavaScript adds filtering, arrow keys and
 * Escape — it is never the thing that makes the control work.
 */

require_once __DIR__ . '/includes/fog_db.php';

/* ------------------------------------------------------------- active section */

$fognav_script  = strtolower(basename((string) ($_SERVER['SCRIPT_NAME'] ?? 'index.php')));
$fognav_by_file = [
    'index.php' => 'home', 'index2.php' => 'home', 'index3.php' => 'home',

    'sensordata.php' => 'weather', 'sensordata3.php' => 'weather',

    'spatial_fog.php' => 'spatial', 'spatial_fog.html' => 'spatial',
    'fogcast_lite_forecast.php' => 'spatial',

    'camera_based_visibility_detection.php' => 'camera',

    'comparedata.php' => 'compare',
    'short_term_forecast_comp.php' => 'compare',
    'long_pred_comp.php' => 'compare', 'long_pred_comp.html' => 'compare',

    'long_term.php' => 'longterm', 'longterm.php' => 'longterm',
    'long_term_pred.php' => 'longterm', 'long_tem_test.php' => 'longterm',

    'about.php' => 'about', 'publication.php' => 'about',
    'contact_us.php' => 'about', 'new_messages.php' => 'about',
];
/* The legacy bar's ?page= values, kept working unchanged. */
$fognav_by_legacy = [
    'home' => 'home', 'iitk_station' => 'weather', 'spatial' => 'spatial',
    'camera' => 'camera', 'compare' => 'compare', 'long' => 'longterm',
    'about' => 'about',
];

$fognav_section = $fognav_by_file[$fognav_script] ?? null;
if ($fognav_section === null) {
    $fognav_legacy  = isset($_GET['page']) ? strtolower((string) $_GET['page']) : '';
    $fognav_section = $fognav_by_legacy[$fognav_legacy] ?? '';
}
$fognav_here = $fognav_script;

/* ------------------------------------------------------------------- sections */
/* Exactly the six destinations the live bar carries, in the live order.
   Spatial Fog and Compare Results and About are the three that have children
   on the live site; collapsing any of them would orphan a shipped page. */

/* ------------------------------------------------------------------- sections */
/* Exactly the six destinations the live bar carries, in the live order (audit
   §9.1). The keys MUST match $fognav_by_file above -- that pairing is what
   marks a section active. Spatial Fog, Compare Results and About are the three
   that have children on the live site; collapsing any of them would orphan a
   shipped page. */

$fognav_menu = [
    'weather' => [
        'label' => 'IIT Kanpur Weather',
        'href'  => 'sensordata.php',
        'note'  => 'Campus instruments: visibility, profile, soil, AWS',
        'items' => [],
    ],
    'spatial' => [
        'label' => 'Spatial Fog',
        'note'  => 'Fog as a field, not a point',
        'items' => [
            ['spatial_fog.php',           'Real-time spatial fog', 'INSAT-3D/3S detection with uncertainty'],
            ['fogcast_lite_forecast.php', 'Forecast spatial fog',  'FogCast, 6 hours to 10 days, seven cities'],
        ],
    ],
    'camera' => [
        'label' => 'Camera-Based Fog',
        'href'  => 'camera_based_visibility_detection.php',
        'note'  => 'Airstrip cameras read against the 1 km threshold',
        'items' => [],
    ],
    'compare' => [
        'label' => 'Compare Results',
        'note'  => 'How the forecasts have actually performed',
        'items' => [
            ['comparedata.php',              'Real-time data comparison',      'Up to four stations, four variables'],
            ['short_term_forecast_comp.php', 'Short-term forecast comparison', 'Predicted against observed, by lead time'],
            ['long_pred_comp.php',           'Long-term forecast comparison',  'Fog index against the observed record'],
        ],
    ],
    'longterm' => [
        'label' => 'Long-Term Forecast',
        'href'  => 'long_term.php',
        'note'  => 'Fog index, 6 hours to 5 days, 21 lead times',
        'items' => [],
    ],
    'about' => [
        'label' => 'About',
        'note'  => 'The group behind the programme',
        'items' => [
            ['about.php',       'About us',           'Motivation, people and past members'],
            ['publication.php', 'Paper publications', 'Peer-reviewed output of the group'],
            ['contact_us.php',  'Contact us',         'Feedback and enquiries'],
        ],
    ],
];


/* apis/start_admin.php sets $admin before this include on the pages that use
   it. The feedback inbox stays admin-only, exactly as on the legacy bar. */
if (!empty($GLOBALS['admin'])) {
    $fognav_menu['about']['items'][] =
        ['new_messages.php', 'All feedbacks', ''];
}

/* ------------------------------------------------------------ station context */

$fognav_stations = fog_stations();
$fognav_current  = fog_resolve_station($_GET['station'] ?? null);

$fognav_primary = [];
$fognav_other   = [];
if ($fognav_stations !== null) {
    foreach ($fognav_stations as $s) {
        if ($s['validated']) { $fognav_primary[] = $s; } else { $fognav_other[] = $s; }
    }
}

/** Is this link the page we are on? */
function fognav_is_here(string $href, string $here): bool
{
    $path = strtolower(strtok($href, '#'));
    return $path !== '' && $path === $here;
}

/** One station row in the suggestion list. Identical markup in both groups. */
function fognav_option(array $s, ?array $current): void
{
    $sel = ($current !== null && $current['id'] === $s['id']);
    echo '<a class="fognav-opt" href="index.php?station=' . fog_e(rawurlencode($s['id'])) . '"'
       . ' data-name="' . fog_e(strtolower($s['name'] . ' ' . $s['id'])) . '"'
       . ($sel ? ' aria-current="true"' : '') . '>'
       . '<b>' . fog_e($s['name']) . '</b>'
       . '<i>' . fog_e($s['id']) . '</i>'
       . '</a>';
}
?>
<?php if (!defined('FOG_HEAD_DONE')): ?>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&amp;family=Source+Sans+3:wght@400;500;600;700&amp;family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&amp;display=swap">
<link rel="stylesheet" href="assets/css/fog-redesign.css">
<script>
(function () {
  try {
    var t = localStorage.getItem('fog-theme');
    if (t === 'dark' || t === 'light') { document.documentElement.setAttribute('data-theme', t); }
  } catch (e) {}
})();
</script>
<?php endif; ?>

<nav class="fognav" aria-label="Primary">
  <div class="fognav-bar">

    <a class="fognav-mark" href="index.php"<?php
       echo $fognav_section === 'home' ? ' aria-current="page"' : ''; ?>>
      <!-- An observing network above fog that thins as it settles. Three
           nodes in slate, because hue means provenance on this site and these
           are measurements; the fog is ink, losing reach and contrast downward.
           The waves are curves rather than rules on purpose: straight bands at
           this size read as lines of text, which is what the old mark looked
           like. Hover thins the fog. -->
      <svg class="fognav-glyph" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path class="g-net" d="M6.5 7.2 12 4.3l5.5 2.9"/>
        <circle class="g-node" cx="6.5" cy="7.2" r="2"/>
        <circle class="g-node" cx="12" cy="4.3" r="2"/>
        <circle class="g-node" cx="17.5" cy="7.2" r="2"/>
        <path class="g-fog g-f1" d="M2.8 12.9q3.05-2 6.1 0t6.1 0t6.1 0"/>
        <path class="g-fog g-f2" d="M2.8 16.9q3.05-2 6.1 0t6.1 0t6.1 0"/>
        <path class="g-fog g-f3" d="M2.8 20.6q3.05-2 6.1 0t6.1 0"/>
      </svg>
      <span class="fognav-mark-text">
        <span class="fognav-mark-name">fog</span>
        <span class="fognav-mark-org">IIT Kanpur</span>
      </span>
    </a>

    <!-- Station selector. The well is the instrument: type a station, Go loads
         it. The list below is revealed by :focus-within, so it needs no script. -->
    <div class="fognav-find" data-fognav-find>
      <form class="fognav-well" method="get" action="index.php" role="search" data-fognav-form>
        <span class="fognav-well-lab" aria-hidden="true">Station</span>
        <span class="fognav-well-field">
          <svg class="fognav-well-icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
            <circle cx="7" cy="7" r="4.4"/>
            <path d="M10.3 10.3 14 14"/>
          </svg>
          <label class="fog-sr" for="fognav-q">Station name or ICAO code</label>
          <input class="fognav-q" id="fognav-q" name="station" type="search"
                 placeholder="IIT Kanpur" autocomplete="off" spellcheck="false"
                 aria-expanded="false" aria-controls="fognav-results"
                 aria-autocomplete="list" data-fognav-filter>
        </span>
        <button class="fognav-go" type="submit">Go</button>
      </form>

      <div class="fognav-results" id="fognav-results" data-fognav-list>
        <p class="fog-sr" role="status" data-fognav-count></p>
        <?php if ($fognav_stations === null): ?>
          <p class="fognav-note">
            The station registry could not be read from the database, so the list
            is unavailable. This is a service fault, not an empty list &mdash; typing
            a station name or ICAO code still works.
          </p>
        <?php else: ?>
          <?php if ($fognav_current !== null): ?>
            <p class="fognav-note fognav-note-now">
              Showing <b><?php echo fog_e($fognav_current['name']); ?></b>
              <i><?php echo fog_e($fognav_current['id']); ?></i>
            </p>
          <?php endif; ?>
          <div class="fognav-results-scroll">
            <?php if ($fognav_primary): ?>
              <p class="fognav-group-label">Prediction network<i><?php echo count($fognav_primary); ?></i></p>
              <?php foreach ($fognav_primary as $s) { fognav_option($s, $fognav_current); } ?>
            <?php endif; ?>
            <?php if ($fognav_other): ?>
              <p class="fognav-group-label">Observation archive only<i><?php echo count($fognav_other); ?></i></p>
              <?php foreach ($fognav_other as $s) { fognav_option($s, $fognav_current); } ?>
            <?php endif; ?>
            <p class="fognav-note" data-fognav-noresult hidden>No station matches that.</p>
          </div>
        <?php endif; ?>
      </div>
    </div>

    <ul class="fognav-sections" data-fognav-track>
      <!-- One shared marker that slides between items. js/fog-nav.js measures
           the hovered or focused label and moves this; with the script absent
           it stays hidden and each item keeps its own underline. -->
      <span class="fognav-pill" data-fognav-pill aria-hidden="true"></span>
      <?php foreach ($fognav_menu as $key => $sec): ?>
        <li class="fognav-item" data-active="<?php echo $fognav_section === $key ? 'true' : 'false'; ?>">
          <?php if (empty($sec['items'])): ?>
            <a class="fognav-link" href="<?php echo fog_e($sec['href']); ?>"
               <?php echo $fognav_section === $key ? 'aria-current="page"' : ''; ?>><span><?php echo fog_e($sec['label']); ?></span></a>
          <?php else: ?>
            <details class="fognav-drop" data-fognav-drop>
              <summary class="fognav-toggle"><span><?php echo fog_e($sec['label']); ?></span><span class="fognav-caret" aria-hidden="true"></span></summary>
              <div class="fognav-panel" data-align="right">
                <p class="fognav-panel-note"><?php echo fog_e($sec['note']); ?></p>
                <?php foreach ($sec['items'] as $it): ?>
                  <a class="fognav-panel-item" href="<?php echo fog_e($it[0]); ?>"
                     <?php echo fognav_is_here($it[0], $fognav_here) ? 'aria-current="page"' : ''; ?>>
                    <strong><?php echo fog_e($it[1]); ?></strong>
                    <span><?php echo fog_e($it[2]); ?></span>
                  </a>
                <?php endforeach; ?>
              </div>
            </details>
          <?php endif; ?>
        </li>
      <?php endforeach; ?>
    </ul>

    <div class="fognav-tools">
      <button class="fognav-icon-btn" type="button" data-fognav-theme
              aria-label="Switch between the light and dark record">
        <svg class="fognav-icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5Z"/>
        </svg>
        <svg class="fognav-icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4.2"/>
          <path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.4 5.4l1.6 1.6M17 17l1.6 1.6M18.6 5.4 17 7M7 17l-1.6 1.6"/>
        </svg>
      </button>

      <details class="fognav-burger" data-fognav-drop>
        <summary aria-label="Sections"><span class="fognav-burger-lines" aria-hidden="true"></span></summary>
        <div class="fognav-sheet">
          <?php foreach ($fognav_menu as $key => $sec): ?>
            <div class="fognav-sheet-group">
              <?php if (empty($sec['items'])): ?>
                <a class="fognav-sheet-link" href="<?php echo fog_e($sec['href']); ?>"
                   <?php echo $fognav_section === $key ? 'aria-current="page"' : ''; ?>>
                  <?php echo fog_e($sec['label']); ?>
                  <em><?php echo fog_e($sec['note']); ?></em>
                </a>
              <?php else: ?>
                <p class="fognav-sheet-head"><?php echo fog_e($sec['label']); ?></p>
                <?php foreach ($sec['items'] as $it): ?>
                  <a class="fognav-sheet-link" href="<?php echo fog_e($it[0]); ?>"
                     <?php echo fognav_is_here($it[0], $fognav_here) ? 'aria-current="page"' : ''; ?>>
                    <?php echo fog_e($it[1]); ?>
                    <em><?php echo fog_e($it[2]); ?></em>
                  </a>
                <?php endforeach; ?>
              <?php endif; ?>
            </div>
          <?php endforeach; ?>
        </div>
      </details>
    </div>

  </div>

  <?php
  /* The status strip renders where the including page has already read the feed
     status (index.php does). It is never faked and never hidden by default. */
  $fognav_feeds = $GLOBALS['fog_status_feeds'] ?? null;
  if (is_array($fognav_feeds)):
      $fognav_lead = $fognav_feeds['metar'] ?? null;
  ?>
  <div class="fognav-status">
    <div class="fognav-status-inner" role="status">
      <?php foreach ($fognav_feeds as $f): ?>
        <?php /* fog_age_tone() returns ok|warn|error. A dead feed is the worst
                 case, so it must never fall through to the healthy dot. */ ?>
        <span class="fognav-feed" data-tone="<?php echo fog_e($f['down'] ? 'error' : $f['tone']); ?>">
          <span class="fognav-feed-dot" aria-hidden="true"></span>
          <span class="fognav-feed-lab"><?php echo fog_e($f['label']); ?></span>
          <span class="fognav-feed-val"><?php
            if ($f['down']) {
                echo 'unreachable';
            } elseif ($f['time'] === null) {
                echo 'no data';
            } else {
                echo fog_e(fog_age_human($f['age']));
            }
          ?></span>
        </span>
      <?php endforeach; ?>
      <?php if ($fognav_lead !== null && $fognav_lead['time'] !== null): ?>
        <span class="fognav-status-when">Latest observation <b><?php
          echo fog_fmt($fognav_lead['time'], 'd M H:i'); ?></b> IST</span>
      <?php endif; ?>
    </div>
  </div>
  <?php endif; ?>
</nav>
<script src="js/fog-nav.js" defer></script>
