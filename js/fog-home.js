/* Fog IITK — homepage behaviour.
 * The page is fully readable with this file absent: the reading, the metrics,
 * the forecast ladder, the chart and the map are all server-rendered. This adds
 * a hover readout on the chart and keeps the two date fields consistent.
 */
(function () {
  'use strict';

  /* ---- header height sync ------------------------------------------------ */
  function syncHeaderHeight() {
    var header = document.querySelector('.fognav');
    var status = document.querySelector('.fognav-status');
    if (header) {
      var bottom = header.getBoundingClientRect().bottom;
      if (status) {
        var statusBottom = status.getBoundingClientRect().bottom;
        if (statusBottom > bottom) { bottom = statusBottom; }
      }
      document.documentElement.style.setProperty('--header-h', bottom + 'px');
    }
  }
  syncHeaderHeight();
  window.addEventListener('resize', syncHeaderHeight);
  if ('fonts' in document) {
    document.fonts.ready.then(syncHeaderHeight);
  }

  /* ---- station picker ---------------------------------------------------- */
  var picker = document.querySelector('.station-picker');
  if (picker) {
    var search = picker.querySelector('.station-search');
    var rows = picker.querySelectorAll('.station-row');
    var groups = picker.querySelectorAll('.station-group');
    var emptyState = picker.querySelector('.station-empty');
    
    document.addEventListener('click', function(e) {
      if (!picker.contains(e.target)) {
        picker.removeAttribute('open');
      }
    });
    
    picker.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && picker.hasAttribute('open')) {
        picker.removeAttribute('open');
        picker.querySelector('summary').focus();
        e.preventDefault();
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Home' || e.key === 'End') {
        var visibleRows = Array.prototype.filter.call(rows, function(r) { return r.style.display !== 'none'; });
        if (!visibleRows.length) return;
        
        var currentIndex = visibleRows.indexOf(document.activeElement);
        var nextIndex = -1;
        
        if (e.key === 'ArrowDown') {
          nextIndex = currentIndex < visibleRows.length - 1 ? currentIndex + 1 : 0;
        } else if (e.key === 'ArrowUp') {
          nextIndex = currentIndex > 0 ? currentIndex - 1 : visibleRows.length - 1;
        } else if (e.key === 'Home') {
          nextIndex = 0;
        } else if (e.key === 'End') {
          nextIndex = visibleRows.length - 1;
        }
        
        e.preventDefault();
        visibleRows[nextIndex].focus();
      }
    });

    picker.addEventListener('toggle', function() {
      if (picker.open && search) {
        search.value = '';
        search.dispatchEvent(new Event('input'));
        setTimeout(function() { search.focus(); }, 10);
      }
    });

    if (search) {
      search.addEventListener('input', function() {
        var q = search.value.toLowerCase();
        var anyVisible = false;
        rows.forEach(function(r) {
          if (r.textContent.toLowerCase().indexOf(q) === -1) {
            r.style.display = 'none';
          } else {
            r.style.display = '';
            anyVisible = true;
          }
        });
        groups.forEach(function(g) {
          g.style.display = q ? 'none' : '';
        });
        if (emptyState) {
          emptyState.style.display = anyVisible ? 'none' : 'block';
        }
      });
    }
  }

  /* ---- count-up animation ------------------------------------------------ */
  function runCountUp() {
    var el = document.querySelector('.js-count-up');
    var wrap = document.querySelector('.hero-reading');
    if (!el || !wrap) return;
    
    // Hide parts from SR since parent .hero-reading has the full aria-label
    el.setAttribute('aria-hidden', 'true');
    var unitEl = document.querySelector('.hero-unit');
    if (unitEl) unitEl.setAttribute('aria-hidden', 'true');
    
    // Progressive enhancement: skipped if reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    
    var valStr = wrap.getAttribute('data-fog-value');
    var finalVal = parseFloat(valStr);
    if (isNaN(finalVal)) return;
    
    var decimals = valStr.indexOf('.') !== -1 ? valStr.split('.')[1].length : 0;
    
    // Reserve final width to prevent jitter
    el.style.display = 'inline-block';
    el.style.minWidth = el.offsetWidth + 'px';
    
    var duration = 1200; // ms
    var fps = 60;
    var steps = Math.floor(duration / (1000 / fps));
    var step = 0;
    
    var easeOut = function(t) { return 1 - Math.pow(1 - t, 4); };
    
    var timer = setInterval(function() {
      step++;
      var progress = step / steps;
      var current = finalVal * easeOut(progress);
      el.textContent = current.toFixed(decimals);
      
      if (step >= steps) {
        clearInterval(timer);
        el.textContent = valStr;
        // Clean up
        el.style.minWidth = '';
        el.style.display = '';
      }
    }, 1000 / fps);
  }
  
  runCountUp();

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

  var obsPath = svg.querySelector('.obs');
  if (obsPath) {
    var d = obsPath.getAttribute('d');
    if (d) {
      var defs = svg.querySelector('defs');
      if (!defs) {
        defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        svg.insertBefore(defs, svg.firstChild);
      }
      if (!defs.querySelector('#obs-gradient')) {
        var grad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        grad.setAttribute('id', 'obs-gradient');
        grad.setAttribute('x1', '0'); grad.setAttribute('y1', '0');
        grad.setAttribute('x2', '0'); grad.setAttribute('y2', '1');
        
        var stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%'); stop1.setAttribute('stop-color', 'var(--measured)'); stop1.setAttribute('stop-opacity', '1');
        var stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '100%'); stop2.setAttribute('stop-color', 'var(--measured)'); stop2.setAttribute('stop-opacity', '0');
        grad.appendChild(stop1); grad.appendChild(stop2);
        defs.appendChild(grad);
      }

      var areaD = d.split('M').filter(Boolean).map(function(seg) {
        var pts = seg.trim().split('L');
        if (!pts.length) return '';
        var firstX = pts[0].split(',')[0];
        var lastX = pts[pts.length - 1].split(',')[0];
        return 'M' + seg + ' L' + lastX + ',' + geo.b + ' L' + firstX + ',' + geo.b + ' Z';
      }).join(' ');

      var areaPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      areaPath.setAttribute('class', 'obs-area');
      areaPath.setAttribute('d', areaD);
      obsPath.parentNode.insertBefore(areaPath, obsPath);
    }
  }

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

  /* ---- map pan & zoom ---------------------------------------------------- */
  var mapSvg = document.querySelector('.fog-map');
  if (mapSvg) {
    mapSvg.style.cursor = 'grab';
    var isPanning = false;
    var startX = 0, startY = 0;
    var vb = mapSvg.getAttribute('viewBox').split(' ').map(parseFloat);
    var origVB = vb.slice();

    mapSvg.addEventListener('pointerdown', function(e) {
      isPanning = true;
      startX = e.clientX;
      startY = e.clientY;
      mapSvg.style.cursor = 'grabbing';
      e.preventDefault();
    });

    window.addEventListener('pointermove', function(e) {
      if (!isPanning) return;
      var dx = e.clientX - startX;
      var dy = e.clientY - startY;
      
      var rect = mapSvg.getBoundingClientRect();
      var scaleX = vb[2] / rect.width;
      var scaleY = vb[3] / rect.height;
      
      vb[0] -= dx * scaleX;
      vb[1] -= dy * scaleY;
      
      mapSvg.setAttribute('viewBox', vb.join(' '));
      startX = e.clientX;
      startY = e.clientY;
      
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        mapSvg.classList.add('is-dragged');
      }
    });

    window.addEventListener('pointerup', function(e) {
      isPanning = false;
      mapSvg.style.cursor = 'grab';
      setTimeout(function() { mapSvg.classList.remove('is-dragged'); }, 10);
    });

    mapSvg.addEventListener('wheel', function(e) {
      e.preventDefault();
      var rect = mapSvg.getBoundingClientRect();
      var mx = e.clientX - rect.left;
      var my = e.clientY - rect.top;
      
      var px = vb[0] + (mx / rect.width) * vb[2];
      var py = vb[1] + (my / rect.height) * vb[3];
      
      var zoom = Math.exp(e.deltaY * 0.001);
      
      var newW = vb[2] * zoom;
      var newH = vb[3] * zoom;
      
      if (newW > origVB[2] * 3 || newW < origVB[2] * 0.05) return;
      
      vb[0] = px - (mx / rect.width) * newW;
      vb[1] = py - (my / rect.height) * newH;
      vb[2] = newW;
      vb[3] = newH;
      
      mapSvg.setAttribute('viewBox', vb.join(' '));
    }, { passive: false });

    mapSvg.addEventListener('click', function(e) {
      if (mapSvg.classList.contains('is-dragged')) {
        e.preventDefault();
      }
    });

    var controls = document.createElement('div');
    controls.className = 'map-zoom-controls';
    controls.innerHTML = '<button type="button" class="zoom-in" aria-label="Zoom in">+</button><button type="button" class="zoom-out" aria-label="Zoom out">-</button><button type="button" class="zoom-reset" aria-label="Reset zoom">↺</button>';
    mapSvg.parentNode.style.position = 'relative';
    mapSvg.parentNode.appendChild(controls);

    controls.querySelector('.zoom-in').addEventListener('click', function() {
      zoomCenter(0.6);
    });
    controls.querySelector('.zoom-out').addEventListener('click', function() {
      zoomCenter(1.6);
    });
    controls.querySelector('.zoom-reset').addEventListener('click', function() {
      vb = origVB.slice();
      mapSvg.setAttribute('viewBox', vb.join(' '));
      mapSvg.style.transition = 'viewBox 0.3s ease';
      setTimeout(function() { mapSvg.style.transition = ''; }, 300);
    });

    function zoomCenter(zoom) {
      var newW = vb[2] * zoom;
      var newH = vb[3] * zoom;
      if (newW > origVB[2] * 3 || newW < origVB[2] * 0.05) return;
      vb[0] = vb[0] + (vb[2] - newW) / 2;
      vb[1] = vb[1] + (vb[3] - newH) / 2;
      vb[2] = newW;
      vb[3] = newH;
      mapSvg.setAttribute('viewBox', vb.join(' '));
    }
  }
})();
