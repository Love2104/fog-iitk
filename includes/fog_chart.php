<?php
declare(strict_types=1);

/**
 * Fog IITK — server-rendered visibility chart.
 * Implements docs/FOG_IITK_WEBSITE_AUDIT.md §41.1.
 *
 * Why SVG on the server rather than a chart library: the homepage currently
 * ships Highstock AND amCharts 3 AND amCharts 4 to draw four small series
 * (audit PERF-1). This renders the same information with no JavaScript, no
 * layout shift, no library, and it survives a JS failure -- which matters here
 * because the fog state is the product (§33.3).
 *
 * Deliberate choices, all from §41.1:
 *   - square-root vertical scale, so the 0-1 km band that actually defines fog
 *     gets a third of the height instead of a tenth;
 *   - THREE severity zones, not one band. Fog is not a single state: 1 km
 *     closes an approach, 200 m is dense, 50 m stops road traffic. The bands
 *     0-0.05, 0.05-0.2 and 0.2-1 km are shaded separately and each threshold
 *     gets a labelled rule on the right-hand edge. Above 1 km nothing is
 *     drawn -- "clear" needs no ink;
 *   - gaps in the record are drawn as GAPS, never bridged, and the hole is
 *     HATCHED across the full plot height. A blank strip reads as "clear",
 *     which is the opposite of what a missing observation means;
 *   - observed and forecast can never be confused: observation is a plain
 *     trace, forecast is a separate polyline carrying a diamond node on every
 *     model step, because a forecast is a handful of discrete predictions and
 *     should not pretend to be a continuous measurement;
 *   - two vertical seams, both optional: the current instant ("NOW", with a
 *     flag so it is legible without a legend) and the forecast run time
 *     ("run"). The run seam is suppressed when it falls within 30px of NOW,
 *     because two rules that close together read as one smudge;
 *   - when the observation density exceeds the pixel budget, buckets carry the
 *     MINIMUM visibility, never the mean -- averaging hides fog events.
 *
 * No inline colour: every fill and stroke comes from a class the stylesheet
 * owns, so the chart follows the page theme without a second source of truth.
 * The file is ASCII-only; anything else goes in as a numeric entity.
 */

const FOG_CHART_W       = 1000.0;
const FOG_CHART_H       = 360.0;
const FOG_CHART_LEFT    = 64.0;
const FOG_CHART_RIGHT   = 30.0;
const FOG_CHART_TOP     = 24.0;
const FOG_CHART_BOTTOM  = 52.0;
const FOG_CHART_MAXPTS  = 1200;

function fog_chart_ticks(float $vmax): array
{
    $all = [0.0, 0.05, 0.2, 0.5, 1.0, 2.0, 5.0, 10.0, 20.0];
    $out = [];
    foreach ($all as $t) {
        if ($t <= $vmax + 1e-9) { $out[] = $t; }
    }
    return $out;
}

function fog_chart_label_km(float $v): string
{
    if ($v <= 0.0)  { return '0'; }
    if ($v < 1.0)   { return rtrim(rtrim(number_format($v, 2, '.', ''), '0'), '.'); }
    return (string) (int) round($v);
}

/**
 * Reduce to at most FOG_CHART_MAXPTS buckets, keeping the worst (lowest)
 * visibility in each. Returns [points, bucketed(bool), bucket_seconds].
 */
function fog_chart_reduce(array $series, int $fromTs, int $toTs): array
{
    $n = count($series);
    if ($n <= FOG_CHART_MAXPTS) { return [$series, false, 0]; }

    $span = max(1, $toTs - $fromTs);
    $bucket = (int) ceil($span / FOG_CHART_MAXPTS);
    $bins = [];
    foreach ($series as $p) {
        $k = intdiv($p['t']->getTimestamp() - $fromTs, $bucket);
        if (!isset($bins[$k])) {
            $bins[$k] = $p;
        } elseif ($p['vis_km'] !== null
                  && ($bins[$k]['vis_km'] === null || $p['vis_km'] < $bins[$k]['vis_km'])) {
            $bins[$k] = $p;
        }
    }
    ksort($bins);
    return [array_values($bins), true, $bucket];
}

/**
 * Build the chart. $forecast is an optional list of ['t'=>DateTimeImmutable,
 * 'vis_km'=>float] drawn as its own polyline with a diamond on every step,
 * plus $forecastBase for the run seam; both are only passed in when the
 * forecast run actually falls inside the window. The ladder rows produced by
 * fog_db call that instant 'time', so either key is accepted.
 */
function fog_chart_render(
    array $series,
    DateTimeImmutable $from,
    DateTimeImmutable $to,
    array $forecast = [],
    ?DateTimeImmutable $forecastBase = null
): array {
    $fromTs = $from->getTimestamp();
    $toTs   = $to->getTimestamp();
    $spanTs = max(1, $toTs - $fromTs);

    [$pts, $bucketed, $bucketSecs] = fog_chart_reduce($series, $fromTs, $toTs);

    $vals = [];
    foreach ($pts as $p) { if ($p['vis_km'] !== null) { $vals[] = $p['vis_km']; } }
    foreach ($forecast as $p) { if ($p['vis_km'] !== null) { $vals[] = $p['vis_km']; } }

    $vmax = 10.0;
    if ($vals) {
        $observedMax = max($vals);
        $vmax = $observedMax <= 10.0 ? 10.0 : 20.0;
    }

    $plotL = FOG_CHART_LEFT;
    $plotR = FOG_CHART_W - FOG_CHART_RIGHT;
    $plotT = FOG_CHART_TOP;
    $plotB = FOG_CHART_H - FOG_CHART_BOTTOM;
    $plotW = $plotR - $plotL;
    $plotH = $plotB - $plotT;

    $sx = static function (int $ts) use ($plotL, $plotW, $fromTs, $spanTs): float {
        return $plotL + ($ts - $fromTs) / $spanTs * $plotW;
    };
    /* Square-root scale: fog gets the room it deserves. */
    $sy = static function (float $v) use ($plotB, $plotH, $vmax): float {
        $v = max(0.0, min($v, $vmax));
        return $plotB - sqrt($v / $vmax) * $plotH;
    };

    $r = static function (float $n): string { return rtrim(rtrim(number_format($n, 1, '.', ''), '0'), '.'); };

    /* --- median cadence, for gap detection ------------------------------- */
    $deltas = [];
    for ($i = 1, $c = count($pts); $i < $c; $i++) {
        $deltas[] = $pts[$i]['t']->getTimestamp() - $pts[$i - 1]['t']->getTimestamp();
    }
    sort($deltas);
    $median = $deltas ? $deltas[intdiv(count($deltas), 2)] : 1800;
    $gapLimit = max(5400, $median * 3);

    /* --- paths ----------------------------------------------------------- */
    $segments = [];
    $voids    = [];
    $current  = [];
    $prevTs   = null;
    foreach ($pts as $p) {
        $ts  = $p['t']->getTimestamp();
        $gap = ($prevTs !== null && ($ts - $prevTs) > $gapLimit);
        if ($gap) {
            /* Clamped to the plot rect: a hatch bleeding into the margin would
               read as chart furniture rather than as absent data. Sub-pixel
               slivers are dropped -- they are noise, not information. */
            $x0 = max($plotL, $sx($prevTs));
            $x1 = min($plotR, $sx($ts));
            if ($x1 - $x0 >= 0.5) { $voids[] = [$x0, $x1]; }
        }
        $broken = ($p['vis_km'] === null) || $gap;
        if ($broken && $current) { $segments[] = $current; $current = []; }
        if ($p['vis_km'] !== null) {
            $current[] = $r($sx($ts)) . ',' . $r($sy($p['vis_km']));
            $prevTs = $ts;
        } else {
            $prevTs = null;
        }
    }
    if ($current) { $segments[] = $current; }

    $obsPath = '';
    foreach ($segments as $seg) {
        if (count($seg) === 1) {
            /* A lone sample is still a measurement: draw it as a point. */
            [$x, $y] = explode(',', $seg[0]);
            $obsPath .= 'M' . ($x - 0.6) . ',' . $y . 'L' . ($x + 0.6) . ',' . $y;
        } else {
            $obsPath .= 'M' . implode('L', $seg);
        }
    }

    /* Node coordinates are kept as numbers, not as path text, because each
       forecast step also gets a diamond marker of its own further down. */
    $fcstPath = '';
    $fcstXY   = [];
    foreach ($forecast as $p) {
        if (($p['vis_km'] ?? null) === null) { continue; }
        /* The ladder rows built by fog_db call the instant 'time'; the
           documented contract here is 't'. Accept either rather than fatal on
           whichever caller is not holding it the way this file expects. */
        $ft = $p['t'] ?? $p['time'] ?? null;
        if (!$ft instanceof DateTimeImmutable) { continue; }
        $fcstXY[] = [$sx($ft->getTimestamp()), $sy($p['vis_km'])];
    }
    if (count($fcstXY) > 1) {
        $bits = [];
        foreach ($fcstXY as $xy) { $bits[] = $r($xy[0]) . ',' . $r($xy[1]); }
        $fcstPath = 'M' . implode('L', $bits);
    }

    /* --- day boundaries --------------------------------------------------- */
    $days = [];
    $tz = fog_tz_ist();
    $cursor = (new DateTimeImmutable($from->setTimezone($tz)->format('Y-m-d') . ' 00:00:00', $tz));
    $totalDays = max(1, (int) ceil($spanTs / 86400));
    /* Every day keeps its rule; only the labels are thinned. Past roughly a
       dozen they touch and the axis turns to mud. */
    $stride = max(1, (int) ceil($totalDays / 12));
    $i = 0;
    $lastMonth = null;
    while ($cursor->getTimestamp() <= $toTs) {
        if ($cursor->getTimestamp() >= $fromTs) {
            $labelled = ($i % $stride === 0);
            $mkey = $cursor->format('Y-m');
            /* Month and year ride under the FIRST label of each month only:
               repeating them on every tick is noise the reader already has. */
            $days[] = ['x'     => $sx($cursor->getTimestamp()),
                       'day'   => $labelled ? $cursor->format('j') : null,
                       'month' => ($labelled && $mkey !== $lastMonth) ? $cursor->format('M Y') : null];
            if ($labelled) { $lastMonth = $mkey; }
        }
        $cursor = $cursor->modify('+1 day');
        $i++;
    }

    /* --- markup ----------------------------------------------------------- */
    /* Severity bands and their rules, worst last. Lower bound, upper bound and
       the right-hand caption; the em dash is a numeric entity so this file
       stays ASCII. Captions are literals, never data, so they are NOT run
       through fog_e -- that would double-escape the entity. */
    $zones = [
        ['zone zone-fog',       'thr thr-1',         0.2,  1.0,  '1 km &#8212; fog'],
        ['zone zone-dense',     'thr thr-dense',     0.05, 0.2,  '200 m &#8212; dense'],
        ['zone zone-verydense', 'thr thr-verydense', 0.0,  0.05, '50 m &#8212; very dense'],
    ];

    $svg  = '<svg class="fog-chart" viewBox="0 0 ' . (int) FOG_CHART_W . ' ' . (int) FOG_CHART_H . '"'
          . ' role="img" preserveAspectRatio="xMidYMid meet"'
          . ' aria-label="' . fog_e(fog_chart_alt($series, $from, $to)) . '">';

    /* The hatch is declared once and coloured by CSS (fill: url(#fog-void)),
       so not one colour value leaks into the markup. */
    $svg .= '<defs><pattern id="fog-void" width="7" height="7" patternUnits="userSpaceOnUse"'
          . ' patternTransform="rotate(45)">'
          . '<line class="void-line" x1="0" y1="0" x2="0" y2="7"/></pattern></defs>';

    /* Zones first, so everything else sits on top of them. Nothing is drawn
       above 1 km: clear air is the absence of ink, not a colour. */
    foreach ($zones as $z) {
        $yTop = $sy($z[3]);
        $yBot = $sy($z[2]);
        $svg .= '<rect class="' . $z[0] . '" x="' . $r($plotL) . '" y="' . $r($yTop) . '"'
              . ' width="' . $r($plotW) . '" height="' . $r($yBot - $yTop) . '"/>';
    }

    /* Then the holes, over the zones: a missing record is missing at every
       severity, so the hatch covers the full plot height. */
    foreach ($voids as $v) {
        $svg .= '<rect class="void" x="' . $r($v[0]) . '" y="' . $r($plotT) . '"'
              . ' width="' . $r($v[1] - $v[0]) . '" height="' . $r($plotH) . '"/>';
    }

    foreach ($days as $d) {
        $svg .= '<line class="grid" x1="' . $r($d['x']) . '" y1="' . $r($plotT)
              . '" x2="' . $r($d['x']) . '" y2="' . $r($plotB) . '"/>';
    }

    /* Value rules and their labels. Where a threshold rule is about to land on
       the same pixel the plain rule is skipped -- two strokes in one place is
       just a thicker, muddier line. */
    $thrVals = [];
    foreach ($zones as $z) { $thrVals[] = $z[3]; }
    foreach (fog_chart_ticks($vmax) as $t) {
        $y = $sy($t);
        if ($t > 0.0 && !in_array($t, $thrVals, true)) {
            $svg .= '<line class="grid" x1="' . $r($plotL) . '" y1="' . $r($y)
                  . '" x2="' . $r($plotR) . '" y2="' . $r($y) . '"/>';
        }
        $svg .= '<text x="' . $r($plotL - 8) . '" y="' . $r($y + 3.2) . '" text-anchor="end">'
              . fog_chart_label_km($t) . '</text>';
    }

    foreach ($zones as $z) {
        $y = $sy($z[3]);
        $svg .= '<line class="' . $z[1] . '" x1="' . $r($plotL) . '" y1="' . $r($y)
              . '" x2="' . $r($plotR) . '" y2="' . $r($y) . '"/>';
    }

    /* Measurement before model: if the two overlap, the forecast is the one
       that should be seen to depart from the record. */
    if ($obsPath !== '')  { $svg .= '<path class="obs" d="' . $obsPath . '"/>'; }
    if ($fcstPath !== '') { $svg .= '<path class="fcst" d="' . $fcstPath . '"/>'; }
    /* A diamond on every model step -- discrete predictions, not a measured
       trace, and a shape the round hover dot can never be mistaken for. Drawn
       even for a lone step, for the same reason a lone sample gets a tick. */
    foreach ($fcstXY as $xy) {
        if ($xy[0] < $plotL || $xy[0] > $plotR) { continue; }
        $svg .= '<rect class="fcst-node" x="' . $r($xy[0] - 2.5) . '" y="' . $r($xy[1] - 2.5) . '"'
              . ' width="5" height="5" transform="rotate(45 ' . $r($xy[0]) . ' ' . $r($xy[1]) . ')"/>';
    }

    /* --- seams ------------------------------------------------------------ */
    $nowX = null;
    $nowTs = time();
    if ($nowTs >= $fromTs && $nowTs <= $toTs) {
        $nowX = $sx($nowTs);
        $svg .= '<line class="now" x1="' . $r($nowX) . '" y1="' . $r($plotT)
              . '" x2="' . $r($nowX) . '" y2="' . $r($plotB) . '"/>';
        /* The flag is clamped inside the plot so it cannot hang off the edge
           when the window ends a few minutes from now. */
        $fx = max($plotL, min($nowX - 17.0, $plotR - 34.0));
        $fy = $plotT - 16.0;
        $svg .= '<rect class="now-flag" x="' . $r($fx) . '" y="' . $r($fy) . '" width="34" height="14"/>';
        $svg .= '<text class="now-flag-lab" x="' . $r($fx + 17.0) . '" y="' . $r($fy + 10.0)
              . '" text-anchor="middle">NOW</text>';
    }

    if ($forecastBase !== null) {
        $bx = $sx($forecastBase->getTimestamp());
        /* Two rules within 30px read as one smudge, and of the pair the run
           seam is the one the reader can do without. */
        $crowded = ($nowX !== null && abs($bx - $nowX) < 30.0);
        if ($bx >= $plotL && $bx <= $plotR && !$crowded) {
            $svg .= '<line class="seam" x1="' . $r($bx) . '" y1="' . $r($plotT)
                  . '" x2="' . $r($bx) . '" y2="' . $r($plotB) . '"/>';
            $svg .= '<text class="seam-lab" x="' . $r(max($plotL + 10.0, min($bx, $plotR - 10.0)))
                  . '" y="' . $r($plotT - 5.0) . '" text-anchor="middle">run</text>';
        }
    }

    /* --- axes -------------------------------------------------------------- */
    $svg .= '<line class="axis" x1="' . $r($plotL) . '" y1="' . $r($plotB)
          . '" x2="' . $r($plotR) . '" y2="' . $r($plotB) . '"/>';

    foreach ($days as $d) {
        if ($d['day'] === null) { continue; }
        $svg .= '<text class="ax" x="' . $r($d['x']) . '" y="' . $r($plotB + 15) . '" text-anchor="middle">'
              . fog_e($d['day']) . '</text>';
        if ($d['month'] !== null) {
            $svg .= '<text class="ax-mon" x="' . $r($d['x']) . '" y="' . $r($plotB + 28)
                  . '" text-anchor="middle">' . fog_e($d['month']) . '</text>';
        }
    }

    $midY = ($plotT + $plotB) / 2.0;
    $svg .= '<text class="axis-title" x="16" y="' . $r($midY) . '" text-anchor="middle"'
          . ' transform="rotate(-90 16 ' . $r($midY) . ')">Visibility (km)</text>';
    /* Every instant on this page is IST. Say it once, under the dates, rather
       than suffixing every tick. */
    $svg .= '<text class="ax-tz" x="' . $r($plotL) . '" y="' . $r($plotB + 42) . '">IST (UTC+05:30)</text>';

    /* Threshold captions last: nothing may overprint the only text that says
       what the bands mean. */
    foreach ($zones as $z) {
        $svg .= '<text class="thr-lab" x="' . $r($plotR) . '" y="' . $r($sy($z[3]) - 4.0)
              . '" text-anchor="end">' . $z[4] . '</text>';
    }

    $svg .= '<line class="hover-line" x1="0" y1="' . $r($plotT) . '" x2="0" y2="' . $r($plotB) . '"/>';
    $svg .= '<circle class="hover-dot" cx="0" cy="0" r="3"/>';
    $svg .= '</svg>';

    /* Series for the hover readout. Two numbers per point, nothing else. */
    $json = [];
    foreach ($pts as $p) {
        $json[] = [$p['t']->getTimestamp() * 1000,
                   $p['vis_km'] === null ? null : round($p['vis_km'], 3)];
    }

    return [
        'svg'        => $svg,
        'points'     => $json,
        'geometry'   => ['l' => $plotL, 'r' => $plotR, 't' => $plotT, 'b' => $plotB,
                         'from' => $fromTs * 1000, 'to' => $toTs * 1000, 'vmax' => $vmax],
        'bucketed'   => $bucketed,
        'bucket_min' => $bucketed ? (int) round($bucketSecs / 60) : 0,
        'n'          => count($series),
        'gaps'       => max(0, count($segments) - 1),
        /* Hatched holes only. Lower than 'gaps', which also counts breaks
           caused by a record that exists but carries no value. */
        'void_count' => count($voids),
    ];
}

/** One sentence describing the plot, for screen readers. §44 */
function fog_chart_alt(array $series, DateTimeImmutable $from, DateTimeImmutable $to): string
{
    $vals = [];
    $below = 0;
    foreach ($series as $p) {
        if ($p['vis_km'] === null) { continue; }
        $vals[] = $p['vis_km'];
        if ($p['vis_km'] < FOG_THRESHOLD_KM) { $below++; }
    }
    if (!$vals) {
        return 'Visibility chart for ' . fog_fmt($from, 'd M Y') . ' to ' . fog_fmt($to, 'd M Y')
             . '. No observations in this window.';
    }
    return sprintf(
        'Visibility from %s to %s IST: %d observations, lowest %s km, highest %s km, '
      . '%d observations below the 1 km fog threshold.',
        fog_fmt($from, 'd M Y'), fog_fmt($to, 'd M Y'),
        count($vals), number_format(min($vals), 2, '.', ''), number_format(max($vals), 1, '.', ''), $below
    );
}

/** Per-day summary — the non-visual equivalent of the plot. §44 */
function fog_chart_daily(array $series): array
{
    $days = [];
    foreach ($series as $p) {
        if ($p['vis_km'] === null) { continue; }
        $k = fog_fmt($p['t'], 'Y-m-d');
        if (!isset($days[$k])) {
            $days[$k] = ['date' => $k, 'min' => $p['vis_km'], 'max' => $p['vis_km'], 'n' => 0, 'fog' => 0];
        }
        $days[$k]['min'] = min($days[$k]['min'], $p['vis_km']);
        $days[$k]['max'] = max($days[$k]['max'], $p['vis_km']);
        $days[$k]['n']++;
        if ($p['vis_km'] < FOG_THRESHOLD_KM) { $days[$k]['fog']++; }
    }
    ksort($days);
    return array_values($days);
}
