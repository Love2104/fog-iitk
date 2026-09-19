/* Fog IITK — homepage behaviour.
 * The page is fully readable with this file absent: the reading, the metrics,
 * the forecast ladder, the chart and the map are all server-rendered. This adds
 * a hover readout on the chart and keeps the two date fields consistent.
 */
(function () {
  'use strict';

  /* ---- chart readout ----------------------------------------------------- */

  var wrap = document.querySelector('[data-fog-chart]');
  var out  = document.querySelector('[data-fog-readout]');
  var raw  = document.getElementById('fog-series');
  if (!wrap || !out || !raw) { return; }

  var points, geo;
  try {
    points = JSON.parse(raw.textContent);
    geo    = JSON.parse(wrap.getAttribute('data-geometry'));
  } catch (e) { return; }
  if (!points || !points.length || !geo) { return; }

  var svg  = wrap.querySelector('svg');
  var line = wrap.querySelector('.hover-line');
  var dot  = wrap.querySelector('.hover-dot');
  if (!svg || !line || !dot) { return; }

  var VIEW_W = 1000;
  var span   = Math.max(1, geo.to - geo.from);

  function sx(ts) { return geo.l + (ts - geo.from) / span * (geo.r - geo.l); }
  function sy(v)  { return geo.b - Math.sqrt(Math.max(0, Math.min(v, geo.vmax)) / geo.vmax) * (geo.b - geo.t); }

  var fmt = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
    hour12: false, timeZone: 'Asia/Kolkata'
  });

  function nearest(ts) {
    var lo = 0, hi = points.length - 1;
    while (lo < hi) {
      var mid = (lo + hi) >> 1;
      if (points[mid][0] < ts) { lo = mid + 1; } else { hi = mid; }
    }
    if (lo > 0 && Math.abs(points[lo - 1][0] - ts) < Math.abs(points[lo][0] - ts)) { lo--; }
    return points[lo];
  }

  function show(clientX) {
    var box = svg.getBoundingClientRect();
    if (!box.width) { return; }
    var x = (clientX - box.left) / box.width * VIEW_W;
    if (x < geo.l || x > geo.r) { hide(); return; }

    var ts = geo.from + (x - geo.l) / (geo.r - geo.l) * span;
    var p  = nearest(ts);
    if (!p) { hide(); return; }

    var px = sx(p[0]);
    line.setAttribute('x1', px);
    line.setAttribute('x2', px);

    var label;
    if (p[1] === null) {
      dot.setAttribute('cy', geo.b);
      dot.setAttribute('cx', px);
      label = '<b>no observation</b><span>gap in the record</span>';
    } else {
      dot.setAttribute('cx', px);
      dot.setAttribute('cy', sy(p[1]));
      var km = p[1];
      var reading = km < 1 ? Math.round(km * 1000) + ' m' : km.toFixed(2) + ' km';
      var state = km < 0.05 ? 'very dense fog'
                : km < 0.2  ? 'dense fog'
                : km < 1    ? 'fog'
                            : 'no fog';
      label = '<b>' + reading + '</b><span>' + state + '</span>';
    }
    svg.classList.add('is-hovering');
    out.innerHTML = '<time>' + fmt.format(new Date(p[0])) + ' IST</time>' + label
                  + '<span class="prov">measured</span>';
  }

  function hide() {
    svg.classList.remove('is-hovering');
    out.textContent = '';
  }

  wrap.addEventListener('pointermove', function (e) { show(e.clientX); });
  wrap.addEventListener('pointerdown', function (e) { show(e.clientX); });
  wrap.addEventListener('pointerleave', hide);

  /* The trace is reachable without a pointer: the wrapper is focusable and the
     arrow keys walk the series, with the readout announcing each value. */
  var idx = -1;
  function showIndex(i) {
    idx = Math.max(0, Math.min(i, points.length - 1));
    var p = points[idx];
    var px = sx(p[0]);
    line.setAttribute('x1', px);
    line.setAttribute('x2', px);
    dot.setAttribute('cx', px);
    dot.setAttribute('cy', p[1] === null ? geo.b : sy(p[1]));
    svg.classList.add('is-hovering');
    var reading, state;
    if (p[1] === null) { reading = 'no observation'; state = 'gap in the record'; }
    else {
      reading = p[1] < 1 ? Math.round(p[1] * 1000) + ' m' : p[1].toFixed(2) + ' km';
      state = p[1] < 0.05 ? 'very dense fog' : p[1] < 0.2 ? 'dense fog'
            : p[1] < 1 ? 'fog' : 'no fog';
    }
    out.innerHTML = '<time>' + fmt.format(new Date(p[0])) + ' IST</time><b>' + reading
                  + '</b><span>' + state + '</span><span class="prov">measured</span>';
  }
  wrap.setAttribute('tabindex', '0');
  wrap.setAttribute('role', 'application');
  wrap.setAttribute('aria-label', 'Visibility trace. Use the left and right arrow keys to read values.');
  wrap.addEventListener('keydown', function (e) {
    var step = e.shiftKey ? 10 : 1;
    if (e.key === 'ArrowRight')     { e.preventDefault(); showIndex(idx < 0 ? 0 : idx + step); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); showIndex(idx < 0 ? points.length - 1 : idx - step); }
    else if (e.key === 'Home')      { e.preventDefault(); showIndex(0); }
    else if (e.key === 'End')       { e.preventDefault(); showIndex(points.length - 1); }
    else if (e.key === 'Escape')    { idx = -1; hide(); }
  });
  wrap.addEventListener('blur', function () { idx = -1; hide(); });

  /* ---- date fields ------------------------------------------------------- */

  var from = document.getElementById('from');
  var to   = document.getElementById('to');
  if (from && to) {
    from.addEventListener('change', function () {
      if (to.value && from.value && to.value <= from.value) {
        var d = new Date(from.value + 'T00:00:00Z');
        d.setUTCDate(d.getUTCDate() + 1);
        to.value = d.toISOString().slice(0, 10);
      }
    });
  }
})();
