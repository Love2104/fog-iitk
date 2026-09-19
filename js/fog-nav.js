/* Fog IITK — navigation behaviour.
 * Progressive enhancement only. Every menu is a <details>/<summary>, every
 * destination is a real <a href>, the station control is a real GET form, and
 * the suggestion list is revealed by CSS :focus-within. The whole bar therefore
 * works with this file absent. What this adds: one-menu-at-a-time, Escape,
 * outside-click, type-to-filter, arrow-key traversal, the aria-expanded state
 * a combobox owes a screen reader, the travelling section marker, and the
 * theme switch.
 */
(function () {
  'use strict';

  /* The whole component, not just the bar: the status strip is a sibling of
     .fognav-bar, and scoping to the bar alone makes a click on the strip count
     as a click outside the navigation. */
  var nav = document.querySelector('.fognav');
  if (!nav) { return; }

  var drops  = Array.prototype.slice.call(nav.querySelectorAll('[data-fognav-drop]'));
  var filter = nav.querySelector('[data-fognav-filter]');

  function closeAll(except) {
    drops.forEach(function (d) { if (d !== except && d.open) { d.open = false; } });
  }

  /* One menu at a time, and opening a menu dismisses the station list -- the
     list is held open by focus, so it is dismissed by moving focus. */
  drops.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (!d.open) { return; }
      closeAll(d);
      if (filter && document.activeElement === filter) { filter.blur(); }
    });
  });

  document.addEventListener('click', function (e) {
    if (!nav.contains(e.target)) { closeAll(null); }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') { return; }
    var open = drops.filter(function (d) { return d.open; })[0];
    if (open) {
      open.open = false;
      var s = open.querySelector('summary');
      if (s) { s.focus(); }
    }
  });

  /* ---- Station combobox -------------------------------------------------- */

  var find = nav.querySelector('[data-fognav-find]');
  var list = nav.querySelector('[data-fognav-list]');

  if (filter && list && find) {
    var options = Array.prototype.slice.call(list.querySelectorAll('.fognav-opt'));
    var groups  = Array.prototype.slice.call(list.querySelectorAll('.fognav-group-label'));
    var none    = list.querySelector('[data-fognav-noresult]');
    var count   = list.querySelector('[data-fognav-count]');
    var cursor  = -1;

    /* Without this file every station is a plain tab stop, which is the right
       fallback. With it, the list is driven by the arrow keys instead, so the
       133 links stop standing between the search field and the menu. */
    options.forEach(function (o) { o.setAttribute('tabindex', '-1'); });

    function visible() { return options.filter(function (o) { return !o.hidden; }); }

    function mark() {
      options.forEach(function (o) { o.classList.remove('is-cursor'); });
      var v = visible();
      if (cursor >= 0 && v[cursor]) {
        v[cursor].classList.add('is-cursor');
        v[cursor].scrollIntoView({ block: 'nearest' });
      }
    }

    function apply() {
      var q = filter.value.trim().toLowerCase();
      var shown = 0;
      options.forEach(function (o) {
        var hit = q === '' || (o.getAttribute('data-name') || '').indexOf(q) !== -1;
        o.hidden = !hit;
        if (hit) { shown++; }
      });
      /* A group label with nothing under it is noise. */
      groups.forEach(function (g) {
        var any = false, n = g.nextElementSibling;
        while (n && !n.classList.contains('fognav-group-label')) {
          if (n.classList.contains('fognav-opt') && !n.hidden) { any = true; break; }
          n = n.nextElementSibling;
        }
        g.hidden = !any;
      });
      if (none) { none.hidden = shown !== 0; }
      if (count) {
        count.textContent = shown === 0 ? 'No station matches.'
          : shown + (shown === 1 ? ' station matches.' : ' stations match.');
      }
      cursor = -1;
      mark();
    }

    filter.addEventListener('input', apply);

    /* CSS opens the list on :focus-within so it works without this file. With
       this file present, .is-open is authoritative: a pointer press inside the
       control must not be able to close the list out from under its own click,
       which is exactly what a focus-only rule allows on browsers that do not
       focus an anchor on mousedown. */
    function open() {
      find.classList.add('is-open');
      filter.setAttribute('aria-expanded', 'true');
    }
    function close() {
      find.classList.remove('is-open');
      filter.setAttribute('aria-expanded', 'false');
      cursor = -1;
      mark();
    }

    var holding = false;
    find.addEventListener('pointerdown', function () { holding = true; });
    document.addEventListener('pointerup', function () { holding = false; });

    filter.addEventListener('focus', function () { open(); closeAll(null); });
    filter.addEventListener('blur', function () {
      setTimeout(function () {
        if (holding || find.contains(document.activeElement)) { return; }
        close();
      }, 0);
    });
    document.addEventListener('pointerdown', function (e) {
      if (!find.contains(e.target)) { close(); }
    });

    filter.addEventListener('keydown', function (e) {
      var v = visible();
      if (e.key === 'ArrowDown')    { e.preventDefault(); cursor = Math.min(cursor + 1, v.length - 1); mark(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); cursor = Math.max(cursor - 1, 0); mark(); }
      else if (e.key === 'Escape')  { e.preventDefault(); close(); filter.blur(); }
    });

    /* Go, and Enter in the field, follow whatever the list is currently showing.
       Without this file the same form still submits to index.php?station=...,
       where fog_resolve_station() matches an exact code or name -- so Go is
       never dead, it is only less forgiving. */
    var form = nav.querySelector('[data-fognav-form]');
    if (form) {
      form.addEventListener('submit', function (e) {
        var v = visible();
        var target = (cursor >= 0 && v[cursor]) ? v[cursor] : v[0];
        if (target) {
          e.preventDefault();
          window.location.href = target.getAttribute('href');
        }
        /* Nothing matched: let the server answer, and say so. */
      });
    }
  }

  /* ---- Travelling section marker ----------------------------------------- */
  /* One shared element that moves between labels instead of each label lighting
     up on its own. It earns its place because a marker that travels carries
     spatial information -- you see where you came from -- which per-item
     backgrounds cannot. Transform and width are the only properties touched,
     both on the bar's single curve, and the element is pointer-inert so it can
     never intercept a click.
     Deliberately not CSS-only: the marker needs the measured position and width
     of an arbitrary label, which no selector can express. Everything it adds is
     decoration -- delete this block and the links still change colour on hover
     and still show a focus ring. */

  var track = nav.querySelector('[data-fognav-track]');
  var pill  = nav.querySelector('[data-fognav-pill]');

  if (track && pill && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var placed = false;

    function targetOf(node) {
      return (node && node.closest) ? node.closest('.fognav-link, .fognav-toggle') : null;
    }

    function moveTo(el) {
      if (!el) { return; }
      var t = track.getBoundingClientRect();
      var b = el.getBoundingClientRect();
      if (!b.width) { return; }
      /* First appearance must land where it belongs rather than sliding in from
         the left edge of the row. Two frames: one to set the geometry with the
         transition suppressed, one to restore it before the next move. */
      if (!placed) {
        placed = true;
        pill.classList.add('is-placing');
        requestAnimationFrame(function () {
          requestAnimationFrame(function () { pill.classList.remove('is-placing'); });
        });
      }
      pill.style.width = b.width + 'px';
      pill.style.transform = 'translate3d(' + (b.left - t.left) + 'px, 0, 0)';
      pill.classList.add('is-on');
    }

    /* An open menu owns the marker: the cursor has moved to the panel, but the
       label is still the thing you are inside. */
    function openToggle() {
      var d = track.querySelector('[data-fognav-drop][open]');
      return d ? d.querySelector('.fognav-toggle') : null;
    }

    function rest() {
      var t = openToggle();
      if (t) { moveTo(t); } else { pill.classList.remove('is-on'); }
    }

    track.addEventListener('pointermove', function (e) {
      var el = targetOf(e.target);
      if (el) { moveTo(el); }
    });
    track.addEventListener('pointerleave', rest);
    track.addEventListener('focusin', function (e) {
      var el = targetOf(e.target);
      if (el) { moveTo(el); }
    });
    track.addEventListener('focusout', function () {
      setTimeout(function () {
        if (!track.contains(document.activeElement)) { rest(); }
      }, 0);
    });

    /* Geometry measured at one width is wrong at another, and a marker parked
       over the wrong label is worse than no marker. */
    window.addEventListener('resize', function () {
      pill.classList.remove('is-on');
      pill.classList.add('is-placing');
      placed = false;
    });

    /* Opening or closing a menu re-decides who holds the marker. */
    drops.forEach(function (d) { d.addEventListener('toggle', rest); });
  }

  /* ---- Theme ------------------------------------------------------------- */

  var toggle = nav.querySelector('[data-fognav-theme]');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var root = document.documentElement;
      var current = root.getAttribute('data-theme');
      if (!current) {
        current = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      var next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('fog-theme', next); } catch (err) { /* private mode */ }
    });
  }
})();
