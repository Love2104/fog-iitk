<?php
declare(strict_types=1);

/**
 * Fog IITK — read-only PostgreSQL access layer for the redesigned homepage.
 * Phase 2. Implements the data contracts recorded in
 * docs/FOG_IITK_WEBSITE_AUDIT.md §10–§14 and §33.
 *
 * Rules this file follows, deliberately:
 *   - Every query is parameterised with pg_query_params(). No string-built SQL.
 *   - Every query is a SELECT. This layer never writes.
 *   - "Service unavailable" and "no rows for this selection" are DIFFERENT
 *     return values, because on this site they mean opposite things
 *     (audit REL-1: an empty result currently renders as clear weather).
 *   - Nothing here throws. A dead database degrades to an explicit NO DATA.
 *
 * TIMEZONE — read before touching any timestamp here.
 *   public.meteorological_data.date_time is `timestamp with time zone`, but the
 *   ingest wrote naive UTC wall-clock values into it under an Asia/Kolkata
 *   session, so PostgreSQL tagged them "+05:30". Proof, from the table's own
 *   raw METAR column:
 *       date_time = 2026-07-09 09:30:00+05:30
 *       metar_format = "VILK 090930Z 11006KT 3000 BR"    <- Z means UTC
 *   The digits are the true UTC time. True IST = digits + 05:30.
 *   Every existing chart on the site already compensates with Highcharts
 *   `timezoneOffset: -11*60` (undo the bogus +05:30, then add the real +05:30),
 *   so the conversion below matches what the site has always displayed.
 *   We read the wall clock with `AT TIME ZONE 'Asia/Kolkata'` and re-interpret
 *   it as UTC. Do not "simplify" this.
 *   public.visdata."Time" is a plain timestamp written by a tzlocal-aware
 *   ingest and is already IST — it must NOT be shifted.
 */

/* ---------------------------------------------------------------- connection */

const FOG_DB_HOST = 'localhost';
const FOG_DB_PORT = '5432';
const FOG_DB_NAME = 'fogprediction';

/** Fog thresholds, in kilometres. Site copy + QJRMS 2026 (<50 m = very dense). */
const FOG_THRESHOLD_KM   = 1.0;
const FOG_DENSE_KM       = 0.2;
const FOG_VERY_DENSE_KM  = 0.05;

/** Expected feed cadences, in seconds. A feed older than 3x is flagged. */
const FOG_CADENCE_METAR    = 1800;    /* METAR/SPECI, 30 min      */
const FOG_CADENCE_FORECAST = 1800;    /* GBR run, 30 min          */
const FOG_CADENCE_CAMPUS   = 300;     /* visibility sensor, 5 min */
const FOG_CADENCE_FOGINDEX = 86400;   /* fog index, daily         */

function fog_db()
{
    static $conn = null;
    static $tried = false;
    if ($tried) {
        return $conn;
    }
    $tried = true;

    /* Credentials come from the environment when it provides them. The literal
       fallback is the value already hard-coded in ~30 files of this repo; it is
       centralised here so that Phase 1 has exactly one place to change after the
       rotation the audit requires (§26, SEC-1). */
    $user = getenv('FOG_DB_USER');
    $pass = getenv('FOG_DB_PASSWORD');
    $host = getenv('FOG_DB_HOST') ?: FOG_DB_HOST;
    $port = getenv('FOG_DB_PORT') ?: FOG_DB_PORT;
    $name = getenv('FOG_DB_NAME') ?: FOG_DB_NAME;
    if ($user === false || $user === '') { $user = 'chaman'; }
    if ($pass === false || $pass === '') { $pass = 'chaman123'; }

    $dsn = sprintf(
        'host=%s port=%s dbname=%s user=%s password=%s connect_timeout=5',
        $host, $port, $name, $user, $pass
    );

    $c = @pg_connect($dsn);
    $conn = ($c === false) ? null : $c;
    return $conn;
}

function fog_db_available(): bool
{
    return fog_db() !== null;
}

/** Run a parameterised SELECT. Returns rows, or null if the query itself failed. */
function fog_select(string $sql, array $params = []): ?array
{
    $conn = fog_db();
    if ($conn === null) {
        return null;
    }
    $res = @pg_query_params($conn, $sql, $params);
    if ($res === false) {
        return null;
    }
    $rows = pg_fetch_all($res, PGSQL_ASSOC);
    pg_free_result($res);
    return $rows === false ? [] : $rows;
}

/* ---------------------------------------------------------------------- time */

function fog_tz_ist(): DateTimeZone
{
    static $tz = null;
    if ($tz === null) { $tz = new DateTimeZone('Asia/Kolkata'); }
    return $tz;
}

/**
 * Turn the stored wall clock of a *_with_time_zone column (already pulled
 * through `AT TIME ZONE 'Asia/Kolkata'`) into the true instant. See the header.
 */
function fog_instant_from_metar(?string $wallClock): ?DateTimeImmutable
{
    if ($wallClock === null || $wallClock === '') { return null; }
    try {
        return new DateTimeImmutable($wallClock, new DateTimeZone('UTC'));
    } catch (Exception $e) {
        return null;
    }
}

/** For columns that are genuinely local (visdata."Time" and friends). */
function fog_instant_from_local(?string $wallClock): ?DateTimeImmutable
{
    if ($wallClock === null || $wallClock === '') { return null; }
    try {
        return new DateTimeImmutable($wallClock, fog_tz_ist());
    } catch (Exception $e) {
        return null;
    }
}

function fog_fmt(DateTimeImmutable $t, string $format = 'd M Y H:i'): string
{
    return $t->setTimezone(fog_tz_ist())->format($format);
}

function fog_age_seconds(?DateTimeImmutable $t): ?int
{
    if ($t === null) { return null; }
    return time() - $t->getTimestamp();
}

/** "14 min" / "6 h" / "71 days" / "8 months". Never a bare number. */
function fog_age_human(?int $seconds): string
{
    if ($seconds === null)  { return 'unknown'; }
    if ($seconds < 0)       { return 'in the future'; }
    if ($seconds < 90)      { return 'just now'; }
    if ($seconds < 5400)    { return max(1, (int) round($seconds / 60)) . ' min ago'; }
    if ($seconds < 172800)  { return max(1, (int) round($seconds / 3600)) . ' h ago'; }
    $days = (int) round($seconds / 86400);
    if ($days < 60)         { return $days . ' days ago'; }
    $months = (int) round($days / 30.44);
    if ($months < 24)       { return $months . ' months ago'; }
    return (int) round($days / 365.25) . ' years ago';
}

/** ok | warn | error, against the feed's own expected cadence. §33.3 */
function fog_age_tone(?int $seconds, int $cadence): string
{
    if ($seconds === null)            { return 'error'; }
    if ($seconds <= $cadence * 3)     { return 'ok'; }
    if ($seconds <= $cadence * 48)    { return 'warn'; }
    return 'error';
}

/* ------------------------------------------------------------------ stations */

/**
 * Every location that actually carries data, plus whether it is one of the 11
 * the prediction system is wired for (public.validity.status = 1).
 * The full list is kept deliberately: the site has always offered these
 * locations and the brief says not to drop them.
 */
function fog_stations(): ?array
{
    static $cache = null;
    if ($cache !== null) { return $cache; }

    $rows = fog_select(
        'SELECT l.station_id,
                l.station_name,
                l.elevation_meter,
                l.iem_network,
                l.lat_lon[0] AS lat,
                l.lat_lon[1] AS lon,
                to_char(l.archive_begins AT TIME ZONE \'Asia/Kolkata\', \'YYYY\') AS archive_year,
                COALESCE(v.status, 0) AS status
           FROM public.location l
           LEFT JOIN public.validity v ON v.location_id = l.station_id
          WHERE l.lat_lon IS NOT NULL
          ORDER BY COALESCE(v.status, 0) DESC, l.station_name ASC'
    );
    if ($rows === null) { return null; }

    $out = [];
    foreach ($rows as $r) {
        $out[] = [
            'id'        => (string) $r['station_id'],
            'name'      => (string) $r['station_name'],
            'elevation' => $r['elevation_meter'] === null ? null : (float) $r['elevation_meter'],
            'network'   => $r['iem_network'] !== null && $r['iem_network'] !== '' ? (string) $r['iem_network'] : null,
            'lat'       => (float) $r['lat'],
            'lon'       => (float) $r['lon'],
            'archive'   => $r['archive_year'] !== null ? (string) $r['archive_year'] : null,
            'validated' => ((int) $r['status']) === 1,
        ];
    }
    $cache = $out;
    return $cache;
}

function fog_station(string $id): ?array
{
    $stations = fog_stations();
    if ($stations === null) { return null; }
    foreach ($stations as $s) {
        if (strcasecmp($s['id'], $id) === 0) { return $s; }
    }
    return null;
}

/**
 * Resolve ?station=. Accepts the ICAO id (the canonical form, used in URLs) and
 * falls back to the station name, because that is what every legacy endpoint
 * and every old bookmark uses. Default: Lucknow — the station with the longest
 * validated record and the one the published fog-index work is built on.
 */
function fog_resolve_station(?string $requested): ?array
{
    $stations = fog_stations();
    if ($stations === null) { return null; }

    $requested = $requested === null ? '' : trim($requested);
    if ($requested !== '' && preg_match('/^[A-Za-z0-9 _.\'-]{1,50}$/', $requested) === 1) {
        foreach ($stations as $s) {
            if (strcasecmp($s['id'], $requested) === 0) { return $s; }
        }
        foreach ($stations as $s) {
            if (strcasecmp($s['name'], $requested) === 0) { return $s; }
        }
    }
    foreach ($stations as $s) {
        if ($s['id'] === 'VILK') { return $s; }
    }
    return $stations[0] ?? null;
}

/* -------------------------------------------------------------- observations */

/** Unit conversions, matching apis/predict_live.php exactly (audit §11.3). */
function fog_miles_to_km(?float $mi): ?float   { return $mi === null ? null : $mi * 1.60934; }
function fog_f_to_c(?float $f): ?float         { return $f === null ? null : ($f - 32.0) * 5.0 / 9.0; }
function fog_knots_to_kmh(?float $kt): ?float  { return $kt === null ? null : $kt * 1.852; }
function fog_inhg_to_hpa(?float $in): ?float   { return $in === null ? null : $in * 33.8639; }
function fog_inch_to_mm(?float $in): ?float    { return $in === null ? null : $in * 25.4; }

function fog_num(?string $v): ?float
{
    if ($v === null || $v === '') { return null; }
    if (!is_numeric($v)) { return null; }
    $f = (float) $v;
    return is_finite($f) ? $f : null;
}

/**
 * The newest METAR row for a station, in display units.
 * Returns null on service failure, [] on "this station has no record".
 */
function fog_latest_observation(string $stationId): ?array
{
    $rows = fog_select(
        'SELECT to_char(date_time AT TIME ZONE \'Asia/Kolkata\', \'YYYY-MM-DD HH24:MI:SS\') AS wall,
                visibility_miles,
                air_temperature_fahrenheit,
                dew_point_temperature_fahrenheit,
                relative_humidity_percentage,
                wind_speed_knots,
                wind_direction_degrees,
                wind_gust_knots,
                pressure_altimeter_inches,
                sea_level_pressure_millibar,
                one_hour_precipitation,
                present_weather_codes,
                metar_format
           FROM public.meteorological_data
          WHERE station = $1
          ORDER BY date_time DESC
          LIMIT 1',
        [$stationId]
    );
    if ($rows === null) { return null; }
    if ($rows === [])   { return []; }

    $r = $rows[0];
    $tempC = fog_f_to_c(fog_num($r['air_temperature_fahrenheit']));
    $dewC  = fog_f_to_c(fog_num($r['dew_point_temperature_fahrenheit']));

    return [
        'time'       => fog_instant_from_metar($r['wall']),
        'vis_km'     => fog_miles_to_km(fog_num($r['visibility_miles'])),
        'temp_c'     => $tempC,
        'dew_c'      => $dewC,
        'spread_c'   => ($tempC === null || $dewC === null) ? null : $tempC - $dewC,
        'rh'         => fog_num($r['relative_humidity_percentage']),
        'wind_kmh'   => fog_knots_to_kmh(fog_num($r['wind_speed_knots'])),
        'wind_dir'   => fog_num($r['wind_direction_degrees']),
        'gust_kmh'   => fog_knots_to_kmh(fog_num($r['wind_gust_knots'])),
        'pressure'   => fog_inhg_to_hpa(fog_num($r['pressure_altimeter_inches']))
                        ?? fog_num($r['sea_level_pressure_millibar']),
        'rain_mm'    => fog_inch_to_mm(fog_num($r['one_hour_precipitation'])),
        'weather'    => $r['present_weather_codes'] !== null && $r['present_weather_codes'] !== ''
                        ? (string) $r['present_weather_codes'] : null,
        'metar'      => $r['metar_format'] !== null && $r['metar_format'] !== ''
                        ? (string) $r['metar_format'] : null,
    ];
}

/** First and last observation for a station — the real period of record. §33 block 8 */
function fog_record_period(string $stationId): ?array
{
    $rows = fog_select(
        'SELECT to_char(min(date_time) AT TIME ZONE \'Asia/Kolkata\', \'YYYY-MM-DD HH24:MI:SS\') AS first_wall,
                to_char(max(date_time) AT TIME ZONE \'Asia/Kolkata\', \'YYYY-MM-DD HH24:MI:SS\') AS last_wall
           FROM public.meteorological_data
          WHERE station = $1',
        [$stationId]
    );
    if ($rows === null || $rows === [] || $rows[0]['last_wall'] === null) { return null; }
    return [
        'first' => fog_instant_from_metar($rows[0]['first_wall']),
        'last'  => fog_instant_from_metar($rows[0]['last_wall']),
    ];
}

/**
 * Visibility series for the chart. $from/$to are Y-m-d strings in IST.
 * They are passed as bound parameters and compared against the stored wall
 * clock, so the window the user asks for is the window they get.
 */
function fog_visibility_series(string $stationId, string $from, string $to): ?array
{
    $rows = fog_select(
        'SELECT to_char(date_time AT TIME ZONE \'Asia/Kolkata\', \'YYYY-MM-DD HH24:MI:SS\') AS wall,
                visibility_miles,
                air_temperature_fahrenheit,
                relative_humidity_percentage
           FROM public.meteorological_data
          WHERE station = $1
            AND (date_time AT TIME ZONE \'Asia/Kolkata\') >= $2::timestamp
            AND (date_time AT TIME ZONE \'Asia/Kolkata\') <  $3::timestamp
          ORDER BY date_time ASC',
        [$stationId, $from . ' 00:00:00', $to . ' 00:00:00']
    );
    if ($rows === null) { return null; }

    $out = [];
    foreach ($rows as $r) {
        $t = fog_instant_from_metar($r['wall']);
        if ($t === null) { continue; }
        $out[] = [
            't'      => $t,
            'vis_km' => fog_miles_to_km(fog_num($r['visibility_miles'])),
            'temp_c' => fog_f_to_c(fog_num($r['air_temperature_fahrenheit'])),
            'rh'     => fog_num($r['relative_humidity_percentage']),
        ];
    }
    return $out;
}

/* ---------------------------------------------------------------- forecast */

/**
 * The short-term visibility forecast ladder. public.model maps model_id to a
 * lead time; 405/410/415/420/425 are the half-hour steps, 4 is +3 h and 460
 * is +6 h. predicted_vis is already in kilometres (verified: current_vis 5.01
 * against an observation of 3.11 miles = 5.005 km).
 */
function fog_forecast_ladder(string $stationId): ?array
{
    $leads = [405 => 30, 410 => 60, 415 => 90, 420 => 120, 425 => 150, 4 => 180, 460 => 360];

    $base = fog_select(
        'SELECT to_char(max(currenttime) AT TIME ZONE \'Asia/Kolkata\', \'YYYY-MM-DD HH24:MI:SS\') AS wall
           FROM public.three_hour_fog_prediction
          WHERE station_id = $1',
        [$stationId]
    );
    if ($base === null) { return null; }
    if ($base === [] || $base[0]['wall'] === null) { return []; }

    $baseWall = (string) $base[0]['wall'];

    $rows = fog_select(
        'SELECT p.model_id,
                p.predicted_vis,
                p.fog_type,
                p.current_vis,
                p.model_name,
                m.description,
                to_char(p.prediction_time AT TIME ZONE \'Asia/Kolkata\', \'YYYY-MM-DD HH24:MI:SS\') AS wall
           FROM public.three_hour_fog_prediction p
           LEFT JOIN public.model m ON m.model_id = p.model_id
          WHERE p.station_id = $1
            AND (p.currenttime AT TIME ZONE \'Asia/Kolkata\') = $2::timestamp
            AND p.model_id = ANY($3)
          ORDER BY p.prediction_time ASC',
        [$stationId, $baseWall, '{405,410,415,420,425,4,460}']
    );
    if ($rows === null) { return null; }

    $steps = [];
    foreach ($rows as $r) {
        $id = (int) $r['model_id'];
        if (!isset($leads[$id])) { continue; }
        $steps[$leads[$id]] = [
            'lead_min'   => $leads[$id],
            'time'       => fog_instant_from_metar($r['wall']),
            'vis_km'     => fog_num($r['predicted_vis']),
            'fog_type'   => $r['fog_type'] === null ? null : (int) $r['fog_type'],
            'model'      => $r['model_name'] !== null ? (string) $r['model_name'] : null,
            'model_note' => $r['description'] !== null ? (string) $r['description'] : null,
        ];
    }
    ksort($steps);

    return [
        'base'     => fog_instant_from_metar($baseWall),
        'base_vis' => isset($rows[0]) ? fog_num($rows[0]['current_vis']) : null,
        'steps'    => array_values($steps),
    ];
}

/* ------------------------------------------------------- IITK campus sensor */

/**
 * IIT Kanpur has no METAR record — VIKN is in the station list but has zero
 * rows in meteorological_data. Its visibility comes from the campus
 * forward-scatter sensor instead. MOR_avg is in kilometres and the instrument
 * saturates at 2 km, so a reading of exactly 2 means ">= 2 km", not "2 km".
 */
function fog_campus_visibility(): ?array
{
    $rows = fog_select(
        'SELECT to_char("Time", \'YYYY-MM-DD HH24:MI:SS\') AS wall,
                "MOR_avg", "MOR_instantaneous", "WeatherCode"
           FROM public.visdata
          WHERE "MOR_avg" IS NOT NULL
          ORDER BY "Time" DESC
          LIMIT 1'
    );
    if ($rows === null) { return null; }
    if ($rows === [])   { return []; }

    $mor = fog_num($rows[0]['MOR_avg']);
    return [
        'time'        => fog_instant_from_local($rows[0]['wall']),
        'vis_km'      => $mor,
        'vis_inst_km' => fog_num($rows[0]['MOR_instantaneous']),
        'saturated'   => $mor !== null && $mor >= 2.0,
        'code'        => $rows[0]['WeatherCode'] !== null && $rows[0]['WeatherCode'] !== ''
                         ? (string) $rows[0]['WeatherCode'] : null,
    ];
}

function fog_campus_met(): ?array
{
    $rows = fog_select(
        'SELECT to_char("Time", \'YYYY-MM-DD HH24:MI:SS\') AS wall,
                "L1_Temperature", "L1_Humidity"
           FROM public.metdata
          WHERE "L1_Temperature" IS NOT NULL
          ORDER BY "Time" DESC
          LIMIT 1'
    );
    if ($rows === null || $rows === []) { return $rows === null ? null : []; }
    return [
        'time'   => fog_instant_from_local($rows[0]['wall']),
        'temp_c' => fog_num($rows[0]['L1_Temperature']),
        'rh'     => fog_num($rows[0]['L1_Humidity']),
    ];
}

/* ------------------------------------------------------------- feed status */

/**
 * Freshness of every feed this page depends on. This is the status strip, and
 * it is the single most important thing the current site does not have:
 * four feeds have been silently broken for 71-250 days (audit §13.6).
 */
function fog_feed_status(string $stationId): array
{
    $feeds = [];

    $obs = fog_select(
        'SELECT to_char(max(date_time) AT TIME ZONE \'Asia/Kolkata\', \'YYYY-MM-DD HH24:MI:SS\') AS wall
           FROM public.meteorological_data WHERE station = $1',
        [$stationId]
    );
    $feeds['metar'] = [
        'label'   => 'Airport METAR',
        'cadence' => FOG_CADENCE_METAR,
        'time'    => ($obs === null || $obs === []) ? null : fog_instant_from_metar($obs[0]['wall']),
        'down'    => $obs === null,
    ];

    $fc = fog_select(
        'SELECT to_char(max(prediction_time) AT TIME ZONE \'Asia/Kolkata\', \'YYYY-MM-DD HH24:MI:SS\') AS wall
           FROM public.three_hour_fog_prediction WHERE station_id = $1',
        [$stationId]
    );
    $feeds['forecast'] = [
        'label'   => 'Short-term forecast',
        'cadence' => FOG_CADENCE_FORECAST,
        'time'    => ($fc === null || $fc === []) ? null : fog_instant_from_metar($fc[0]['wall']),
        'down'    => $fc === null,
    ];

    $fi = fog_select(
        'SELECT to_char(max(date_time), \'YYYY-MM-DD HH24:MI:SS\') AS wall
           FROM public.long_prediction1 WHERE station = $1',
        [$stationId]
    );
    $feeds['fogindex'] = [
        'label'   => 'Fog index',
        'cadence' => FOG_CADENCE_FOGINDEX,
        'time'    => ($fi === null || $fi === []) ? null : fog_instant_from_local($fi[0]['wall']),
        'down'    => $fi === null,
    ];

    $cs = fog_select('SELECT to_char(max("Time"), \'YYYY-MM-DD HH24:MI:SS\') AS wall FROM public.visdata');
    $feeds['campus'] = [
        'label'   => 'IITK visibility sensor',
        'cadence' => FOG_CADENCE_CAMPUS,
        'time'    => ($cs === null || $cs === []) ? null : fog_instant_from_local($cs[0]['wall']),
        'down'    => $cs === null,
    ];

    foreach ($feeds as $k => $f) {
        $age = fog_age_seconds($f['time']);
        $feeds[$k]['age']  = $age;
        $feeds[$k]['tone'] = $f['down'] ? 'error' : fog_age_tone($age, $f['cadence']);
    }
    return $feeds;
}

/* ----------------------------------------------------------- derived state */

/** clear | fog | dense | verydense | nodata. The threshold the site documents. */
function fog_state_for_km(?float $km): string
{
    if ($km === null)                    { return 'nodata'; }
    if ($km < FOG_VERY_DENSE_KM)         { return 'verydense'; }
    if ($km < FOG_DENSE_KM)              { return 'dense'; }
    if ($km < FOG_THRESHOLD_KM)          { return 'fog'; }
    return 'clear';
}

/** The word. Colour never carries the state on its own (audit A11Y-8). */
function fog_state_word(string $state): string
{
    switch ($state) {
        case 'clear':     return 'No fog';
        case 'fog':       return 'Fog';
        case 'dense':     return 'Dense fog';
        case 'verydense': return 'Very dense fog';
        default:          return 'No data';
    }
}

function fog_state_range(string $state): string
{
    switch ($state) {
        case 'clear':     return 'visibility at or above 1 km';
        case 'fog':       return 'visibility below 1 km';
        case 'dense':     return 'visibility below 200 m';
        case 'verydense': return 'visibility below 50 m';
        default:          return 'no observation available';
    }
}

/* -------------------------------------------------------------- formatting */

function fog_dp(?float $v, int $dp = 1): string
{
    return $v === null ? '—' : number_format($v, $dp, '.', '');
}

/** Visibility reads in metres below 1 km and kilometres above it. */
function fog_vis_display(?float $km): array
{
    if ($km === null) { return ['—', 'km']; }
    if ($km < 1.0)    { return [number_format($km * 1000, 0, '.', ''), 'm']; }
    return [number_format($km, $km < 10 ? 2 : 1, '.', ''), 'km'];
}

/** 16-point compass label, so wind direction is never a bare number. */
function fog_wind_compass(?float $deg): ?string
{
    if ($deg === null) { return null; }
    $points = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
    return $points[(int) round(fmod(($deg + 360.0), 360.0) / 22.5) % 16];
}

/**
 * public.location.iem_network holds the raw registry key, "IN__ASOS". That is
 * the right value for the station register, where it is labelled; in running
 * prose it reads as a leaked database artefact, so soften it there.
 */
function fog_network_label(?string $network): ?string
{
    if ($network === null || $network === '') { return null; }
    return $network === 'IN__ASOS' ? 'IEM ASOS' : $network;
}

function fog_coord(float $lat, float $lon): string
{
    return number_format(abs($lat), 4, '.', '') . '&deg; ' . ($lat >= 0 ? 'N' : 'S')
         . ', ' . number_format(abs($lon), 4, '.', '') . '&deg; ' . ($lon >= 0 ? 'E' : 'W');
}

function fog_e(?string $s): string
{
    return htmlspecialchars((string) $s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}
