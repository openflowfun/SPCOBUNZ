/* Lucky Table Draw — projector wheel on the raffle page.
   Pulls per-table entry counts (never names or contact details) from
   the Google Sheet web app, draws one slice per table that has entries, and spins to a
   winner picked with crypto-grade randomness. Add ?demo=1 to the raffle
   page URL to rehearse with sample entries. */
(function(){
  'use strict';
  var C = window.LUCKY_DRAW;
  if (!C) return;

  var DEMO = /[?&]demo=1\b/.test(location.search);
  var REFRESH_MS = 10000;
  var SPIN_MS = 7000;
  var deadline = new Date(C.deadline).getTime();

  var views = document.querySelectorAll('.rv-view');
  function showView(name){
    views.forEach(function(v){ v.classList.toggle('is-active', v.getAttribute('data-view') === name); });
    window.scrollTo(0, 0);
  }

  var canvas = document.getElementById('ldWheel');
  var ctx = canvas.getContext('2d');
  var spinBtn = document.getElementById('ldSpinBtn');
  var emptyEl = document.getElementById('ldEmpty');
  var statusEl = document.getElementById('ldStatus');
  var statusText = document.getElementById('ldStatusText');
  var listEl = document.getElementById('ldList');
  var overlay = document.getElementById('ldWinnerOverlay');

  var counts = {};          // table -> entries
  var mode = 'weighted';    // or 'equal'
  var rotation = 0;         // radians, current wheel rotation
  var spinning = false;
  var lastWinner = null;
  var timer = null;
  var active = false;

  var SLICE_FILLS = ['#16244F', '#A8792A', '#223673', '#C9A24A', '#0F1B40', '#8C6320'];

  /* ---------- Data ---------- */
  function demoCounts(){
    return { 1: 6, 2: 3, 3: 8, 4: 2, 5: 5, 6: 7, 7: 4, 8: 1, 9: 6, 10: 3, 11: 5, 12: 2, 14: 4, 15: 6 };
  }
  function setStatus(kind, text){
    statusEl.classList.toggle('is-closed', kind === 'closed');
    statusEl.classList.toggle('is-off', kind === 'off');
    statusText.textContent = text;
  }
  function load(){
    if (spinning) return Promise.resolve();
    if (DEMO){
      counts = demoCounts();
      setStatus('live', 'Demo entries (rehearsal mode)');
      render();
      return Promise.resolve();
    }
    if (!C.isConfigured()){
      setStatus('off', 'Entries database not connected');
      counts = {}; render();
      return Promise.resolve();
    }
    return C.counts().then(function(data){
      if (!data || !data.ok) throw new Error('bad response');
      var next = {};
      Object.keys(data.counts || {}).forEach(function(k){
        var t = parseInt(k, 10), n = parseInt(data.counts[k], 10);
        if (t >= 1 && t <= C.tables && n > 0) next[t] = n;
      });
      counts = next;
      var um = document.getElementById('ldUnmatched');
      if (!data.guestList){
        um.hidden = false;
        um.textContent = (data.total || 0) + ' entries received. Add the guest list to the Sheet\u2019s Guests tab so entries can be matched to tables.';
      } else if (data.unmatched){
        um.hidden = false;
        um.textContent = data.unmatched + (data.unmatched === 1 ? ' entry isn\u2019t' : ' entries aren\u2019t') + ' on the wheel yet: the name didn\u2019t match the guest list. Type their table into the Sheet\u2019s Entries tab to include them.';
      } else {
        um.hidden = true;
      }
      var closed = Date.now() >= deadline;
      var time = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
      setStatus(closed ? 'closed' : 'live', closed ? 'Entries closed · final count' : 'Live · updated ' + time);
      if (!spinning) render();
    }).catch(function(){
      setStatus('off', 'Couldn\u2019t reach the entries database. Retrying…');
    });
  }

  function slices(){
    var list = [];
    for (var t = 1; t <= C.tables; t++){
      if (counts[t]) list.push({ table: t, entries: counts[t], weight: mode === 'equal' ? 1 : counts[t] });
    }
    var total = list.reduce(function(a, s){ return a + s.weight; }, 0);
    var start = 0;
    list.forEach(function(s){
      s.start = start;
      s.size = total ? (s.weight / total) * Math.PI * 2 : 0;
      start += s.size;
    });
    return list;
  }

  /* ---------- Drawing ---------- */
  function drawWheel(){
    var W = canvas.width, R = W / 2 - 6, cx = W / 2, cy = W / 2;
    var list = slices();
    ctx.clearRect(0, 0, W, W);
    if (!list.length){
      ctx.fillStyle = '#0F1B40';
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
      return;
    }
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    list.forEach(function(s, i){
      var fill = SLICE_FILLS[i % SLICE_FILLS.length];
      if (list.length > 1 && i === list.length - 1 && list.length % SLICE_FILLS.length === 1){
        fill = SLICE_FILLS[2]; // avoid two identical neighbours where the circle closes
      }
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, R, s.start, s.start + s.size);
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.strokeStyle = 'rgba(241,221,170,.55)';
      ctx.lineWidth = 3;
      ctx.stroke();

      var mid = s.start + s.size / 2;
      var light = fill === '#A8792A' || fill === '#C9A24A' || fill === '#8C6320';
      var fontSize = Math.max(26, Math.min(96, s.size * R * 0.42));
      ctx.save();
      ctx.rotate(mid);
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = light ? '#0C1633' : '#F1DDAA';
      ctx.font = '700 ' + fontSize + 'px Cinzel, Georgia, serif';
      ctx.fillText(String(s.table), R - 34, 0);
      ctx.restore();
    });
    ctx.restore();

    // rim dots
    ctx.save();
    ctx.translate(cx, cy);
    for (var d = 0; d < 48; d++){
      var a = d / 48 * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(Math.cos(a) * (R - 12), Math.sin(a) * (R - 12), 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(241,221,170,.8)';
      ctx.fill();
    }
    ctx.restore();
  }

  function renderList(){
    listEl.innerHTML = '';
    var total = 0, tablesIn = 0;
    for (var t = 1; t <= C.tables; t++){
      var n = counts[t] || 0;
      total += n; if (n) tablesIn++;
      var li = document.createElement('li');
      if (n) li.className = 'is-in';
      if (lastWinner === t) li.className += ' is-win';
      li.innerHTML = '<b>' + t + '</b><span>' + (n ? n + (n === 1 ? ' entry' : ' entries') : 'no entries') + '</span>';
      listEl.appendChild(li);
    }
    document.getElementById('ldTotal').textContent = total;
    document.getElementById('ldTablesIn').textContent = tablesIn;
    emptyEl.classList.toggle('show', tablesIn === 0);
    spinBtn.disabled = spinning || tablesIn === 0;
  }

  function render(){ drawWheel(); renderList(); }

  /* ---------- Spin ---------- */
  function randomUnit(){
    if (window.crypto && crypto.getRandomValues){
      var a = new Uint32Array(1); crypto.getRandomValues(a);
      return a[0] / 4294967296;
    }
    return Math.random();
  }
  function pickWinner(list){
    var total = list.reduce(function(a, s){ return a + s.weight; }, 0);
    var r = randomUnit() * total;
    for (var i = 0; i < list.length; i++){
      if (r < list[i].weight) return list[i];
      r -= list[i].weight;
    }
    return list[list.length - 1];
  }
  function easeOut(t){ return 1 - Math.pow(1 - t, 4); }

  function spin(){
    if (spinning) return;
    var list = slices();
    if (!list.length) return;
    spinning = true;
    clearInterval(timer);
    spinBtn.disabled = true;
    lastWinner = null;
    renderList();

    var win = pickWinner(list);
    // Land a random point inside the winning slice (away from its edges) under the pointer at the top (-90°).
    var inside = win.start + win.size * (0.15 + 0.7 * randomUnit());
    var target = -Math.PI / 2 - inside;
    var from = rotation;
    var turns = 6 + Math.floor(randomUnit() * 3);
    var norm = function(a){ a %= Math.PI * 2; return a < 0 ? a + Math.PI * 2 : a; };
    var delta = norm(target - from) + turns * Math.PI * 2;
    var t0 = performance.now();
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    var dur = reduce ? 600 : SPIN_MS;

    function frame(now){
      var p = Math.min(1, (now - t0) / dur);
      rotation = from + delta * easeOut(p);
      drawWheel();
      if (p < 1){ requestAnimationFrame(frame); return; }
      rotation = norm(rotation);
      spinning = false;
      lastWinner = win.table;
      renderList();
      announce(win);
    }
    requestAnimationFrame(frame);
  }

  function announce(win){
    document.getElementById('ldWinTable').textContent = 'Table ' + win.table;
    document.getElementById('ldWinMeta').textContent = win.entries + (win.entries === 1 ? ' entry' : ' entries') + ' from this table';
    overlay.classList.add('is-open');
    confetti();
  }

  /* ---------- Confetti ---------- */
  var confettiRaf = null;
  function confetti(){
    var cv = document.getElementById('ldConfetti'), c2 = cv.getContext('2d');
    cv.width = innerWidth; cv.height = innerHeight;
    var colors = ['#E3C566', '#C9A227', '#F8F6F1', '#A5841C', '#FFFFFF'];
    var parts = [];
    for (var i = 0; i < 180; i++){
      parts.push({
        x: cv.width / 2 + (randomUnit() - 0.5) * 300, y: cv.height * 0.3,
        vx: (randomUnit() - 0.5) * 16, vy: -randomUnit() * 16 - 4,
        s: 5 + randomUnit() * 7, r: randomUnit() * 6, vr: (randomUnit() - 0.5) * 0.3,
        c: colors[i % colors.length]
      });
    }
    var start = performance.now();
    cancelAnimationFrame(confettiRaf);
    (function step(now){
      c2.clearRect(0, 0, cv.width, cv.height);
      parts.forEach(function(p){
        p.vy += 0.35; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.vx *= 0.99;
        c2.save(); c2.translate(p.x, p.y); c2.rotate(p.r);
        c2.fillStyle = p.c; c2.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
        c2.restore();
      });
      if (now - start < 4000) confettiRaf = requestAnimationFrame(step);
      else c2.clearRect(0, 0, cv.width, cv.height);
    })(start);
  }

  /* ---------- Wiring ---------- */
  function startPolling(){
    clearInterval(timer);
    timer = setInterval(function(){ if (active && !spinning) load(); }, REFRESH_MS);
  }
  function open(){
    active = true;
    showView('tables');
    // Cinzel may still be loading the first time; redraw once it's ready.
    if (document.fonts && document.fonts.load) document.fonts.load('700 40px Cinzel').then(drawWheel, function(){});
    load();
    startPolling();
  }
  document.getElementById('ldOpenBtn').addEventListener('click', open);
  document.getElementById('ldBackBtn').addEventListener('click', function(){
    if (spinning) return;
    active = false; clearInterval(timer); showView('welcome');
  });
  document.getElementById('ldRefreshBtn').addEventListener('click', function(){ load(); });
  spinBtn.addEventListener('click', spin);
  document.getElementById('ldRespinBtn').addEventListener('click', function(){
    overlay.classList.remove('is-open'); spin();
  });
  document.getElementById('ldDoneBtn').addEventListener('click', function(){
    overlay.classList.remove('is-open');
    startPolling();
  });
  document.querySelectorAll('.ld-mode button').forEach(function(b){
    b.addEventListener('click', function(){
      if (spinning) return;
      mode = b.getAttribute('data-mode');
      document.querySelectorAll('.ld-mode button').forEach(function(x){ x.classList.toggle('is-active', x === b); });
      document.getElementById('ldModeNote').textContent = mode === 'equal'
        ? 'Every table with at least one entry gets the same size slice.'
        : 'Each entry is one chance, so a table with more entries gets a bigger slice.';
      render();
    });
  });
  document.addEventListener('keydown', function(e){
    if (!active || e.target.closest('input,textarea')) return;
    if (overlay.classList.contains('is-open')){
      if (e.key === 'Escape') document.getElementById('ldDoneBtn').click();
      return;
    }
    if (e.key === ' ' || e.key === 'Enter'){ e.preventDefault(); e.stopImmediatePropagation(); spin(); }
  }, true);

  // Deep link: /raffle/#lucky-table opens straight into the wheel.
  if (location.hash === '#lucky-table') open();
  render();
})();
