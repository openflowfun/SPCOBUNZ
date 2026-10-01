/* Souvenir Draw — projector wheel on the raffle page.
   Two draws, one winner each (1 bottle of Johnnie Walker Double Black).
   Pulls entrant names (never contact details) from the Google Sheet web app,
   gives every entrant an equal slice, and spins to a winner picked with
   crypto-grade randomness. The Draw 1 winner comes off the wheel for Draw 2.
   Winners are remembered in this browser so a refresh doesn't lose them.
   Add ?demo=1 to the raffle page URL to rehearse with sample names. */
(function(){
  'use strict';
  var C = window.LUCKY_DRAW;
  if (!C) return;

  var DEMO = /[?&]demo=1\b/.test(location.search);
  var DRAWS = C.draws || 2;
  var REFRESH_MS = 10000;
  var SPIN_MS = 7500;
  var STORE = 'spcobunz-souvenir-draw-winners' + (DEMO ? '-demo' : '');
  var deadline = new Date(C.deadline).getTime();

  var $ = function(id){ return document.getElementById(id); };
  var views = document.querySelectorAll('.rv-view');
  function showView(name){
    views.forEach(function(v){ v.classList.toggle('is-active', v.getAttribute('data-view') === name); });
    window.scrollTo(0, 0);
  }

  var canvas = $('ldWheel'), ctx = canvas.getContext('2d');
  var spinBtn = $('ldSpinBtn'), spinLabel = $('ldSpinLabel');
  var overlay = $('ldWinnerOverlay');

  var entrants = [];          // [{id, name}]
  var winners = [];           // [{id, name}] in draw order
  try { winners = JSON.parse(localStorage.getItem(STORE) || '[]') || []; } catch(e){ winners = []; }
  var rotation = 0, spinning = false, timer = null, active = false, pending = null;

  var FILLS = ['#16244F', '#A8792A', '#223673', '#C9A24A', '#0F1B40', '#8C6320'];
  var LIGHT = { '#A8792A': 1, '#C9A24A': 1, '#8C6320': 1 };

  function saveWinners(){ try { localStorage.setItem(STORE, JSON.stringify(winners)); } catch(e){} }
  function currentDraw(){ return Math.min(winners.length + 1, DRAWS); }
  function allDone(){ return winners.length >= DRAWS; }
  function onWheel(){
    var won = {}; winners.forEach(function(w){ won[w.id] = 1; });
    return entrants.filter(function(e){ return !won[e.id]; });
  }

  /* ---------- Data ---------- */
  var DEMO_NAMES = ['Amal Perera','Nimal De Silva','Kasun Fernando','Shehan Jayasinghe','Ruwan Wickramasinghe','Dinesh Silva',
    'Chamara Rodrigo','Thilina Gunawardena','Lahiru Manawadu','Pradeep De Silva','Kanishka Perera','Ulyssess David',
    'Navin Fonseka','Collin Francke','Herschelle Hendricks','Dinuka Silva','Kevin Alexander','Malik Lenora'];
  function setStatus(kind, text){
    var el = $('ldStatus');
    el.classList.toggle('is-closed', kind === 'closed');
    el.classList.toggle('is-off', kind === 'off');
    $('ldStatusText').textContent = text;
  }
  function load(){
    if (spinning) return Promise.resolve();
    if (DEMO){
      entrants = DEMO_NAMES.map(function(n, i){ return { id: 'd' + i, name: n }; });
      setStatus('live', 'Demo names (rehearsal mode)');
      render();
      return Promise.resolve();
    }
    if (!C.isConfigured()){ setStatus('off', 'Entries database not connected'); entrants = []; render(); return Promise.resolve(); }
    return C.entrants().then(function(data){
      if (!data || !data.ok || !data.entrants) throw new Error('bad response');
      entrants = data.entrants;
      var closed = Date.now() >= deadline;
      var time = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
      setStatus(closed ? 'closed' : 'live', closed ? 'Entries closed \u00b7 final list' : 'Live \u00b7 updated ' + time);
      if (!spinning) render();
    }).catch(function(){
      setStatus('off', 'Couldn\u2019t reach the entries Sheet. Retrying\u2026');
    });
  }

  /* ---------- Drawing ---------- */
  function shortName(n, max){
    if (n.length <= max) return n;
    var parts = n.split(' ');
    var s = parts[0] + (parts.length > 1 ? ' ' + parts[parts.length - 1].charAt(0) + '.' : '');
    return s.length <= max ? s : s.slice(0, max - 1) + '\u2026';
  }
  function drawWheel(){
    var W = canvas.width, R = W / 2 - 6, c = W / 2;
    var list = onWheel();
    ctx.clearRect(0, 0, W, W);
    if (!list.length){
      ctx.fillStyle = '#0F1B40'; ctx.beginPath(); ctx.arc(c, c, R, 0, Math.PI * 2); ctx.fill();
      return;
    }
    var size = Math.PI * 2 / list.length;
    ctx.save(); ctx.translate(c, c); ctx.rotate(rotation);
    list.forEach(function(e, i){
      var fill = FILLS[i % FILLS.length];
      if (list.length > 1 && i === list.length - 1 && list.length % FILLS.length === 1) fill = FILLS[2];
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, R, i * size, (i + 1) * size); ctx.closePath();
      ctx.fillStyle = fill; ctx.fill();
      ctx.strokeStyle = 'rgba(241,221,170,.5)'; ctx.lineWidth = list.length > 80 ? 1 : 2.5; ctx.stroke();

      /* Names fit while slices are wide enough; past that the winner card does the talking. */
      var arc = size * R * 0.72;
      if (arc >= 14){
        var fs = Math.max(13, Math.min(44, arc * 0.62));
        ctx.save();
        ctx.rotate(i * size + size / 2);
        ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        ctx.fillStyle = LIGHT[fill] ? '#0C1633' : '#F1DDAA';
        ctx.font = '600 ' + fs + 'px Inter, system-ui, sans-serif';
        var max = Math.max(8, Math.floor((R * 0.66) / (fs * 0.55)));
        ctx.fillText(shortName(e.name, max), R - 30, 0);
        ctx.restore();
      }
    });
    ctx.restore();
    ctx.save(); ctx.translate(c, c);
    for (var d = 0; d < 48; d++){
      var a = d / 48 * Math.PI * 2;
      ctx.beginPath(); ctx.arc(Math.cos(a) * (R - 12), Math.sin(a) * (R - 12), 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(241,221,170,.8)'; ctx.fill();
    }
    ctx.restore();
  }

  function renderPanel(){
    var list = onWheel();
    $('ldTotal').textContent = entrants.length;
    $('ldOnWheel').textContent = list.length;
    $('ldEmpty').classList.toggle('show', list.length === 0);
    $('ldRound').textContent = allDone() ? 'Both draws complete' : 'Draw ' + currentDraw() + ' of ' + DRAWS;
    spinLabel.textContent = allDone() ? 'Both draws complete' : 'Spin for Draw ' + currentDraw();
    spinBtn.disabled = spinning || allDone() || list.length === 0;
    var ol = $('ldWinners'); ol.innerHTML = '';
    for (var d = 1; d <= DRAWS; d++){
      var w = winners[d - 1];
      var li = document.createElement('li');
      if (!w) li.className = 'is-empty';
      var b = document.createElement('b'); b.textContent = 'Draw ' + d;
      var sp = document.createElement('span'); sp.textContent = w ? w.name : 'Not drawn yet';
      li.appendChild(b); li.appendChild(sp); ol.appendChild(li);
    }
  }
  function render(){ drawWheel(); renderPanel(); }

  /* ---------- Spin ---------- */
  function rnd(){
    if (window.crypto && crypto.getRandomValues){ var a = new Uint32Array(1); crypto.getRandomValues(a); return a[0] / 4294967296; }
    return Math.random();
  }
  function easeOut(t){ return 1 - Math.pow(1 - t, 4); }
  function norm(a){ a %= Math.PI * 2; return a < 0 ? a + Math.PI * 2 : a; }

  function spin(){
    if (spinning || allDone()) return;
    var list = onWheel();
    if (!list.length) return;
    spinning = true; clearInterval(timer); renderPanel();
    var idx = Math.floor(rnd() * list.length);
    var size = Math.PI * 2 / list.length;
    var inside = idx * size + size * (0.2 + 0.6 * rnd());
    var from = rotation;
    var delta = norm(-Math.PI / 2 - inside - from) + (6 + Math.floor(rnd() * 3)) * Math.PI * 2;
    var t0 = performance.now();
    var dur = (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) ? 600 : SPIN_MS;
    (function frame(now){
      var p = Math.min(1, (now - t0) / dur);
      rotation = from + delta * easeOut(p);
      drawWheel();
      if (p < 1){ requestAnimationFrame(frame); return; }
      rotation = norm(rotation);
      spinning = false;
      pending = list[idx];
      announce(pending);
    })(t0);
  }

  function announce(w){
    var d = winners.length + 1;
    $('ldWinRound').textContent = 'Souvenir Draw \u00b7 Draw ' + d + ' of ' + DRAWS;
    $('ldWinName').textContent = w.name;
    $('ldDoneLabel').textContent = d < DRAWS ? 'Confirm & go to Draw ' + (d + 1) : 'Confirm winner';
    overlay.classList.add('is-open');
    confetti();
  }
  function confirmWinner(){
    if (pending){ winners.push(pending); saveWinners(); pending = null; }
    overlay.classList.remove('is-open');
    render(); startPolling();
  }

  /* ---------- Confetti ---------- */
  var raf = null;
  function confetti(){
    var cv = $('ldConfetti'), c2 = cv.getContext('2d');
    cv.width = innerWidth; cv.height = innerHeight;
    var colors = ['#E3C566', '#C9A227', '#F8F6F1', '#A5841C', '#FFFFFF'], parts = [];
    for (var i = 0; i < 180; i++){
      parts.push({ x: cv.width / 2 + (rnd() - 0.5) * 300, y: cv.height * 0.3, vx: (rnd() - 0.5) * 16, vy: -rnd() * 16 - 4,
        s: 5 + rnd() * 7, r: rnd() * 6, vr: (rnd() - 0.5) * 0.3, c: colors[i % colors.length] });
    }
    var start = performance.now(); cancelAnimationFrame(raf);
    (function step(now){
      c2.clearRect(0, 0, cv.width, cv.height);
      parts.forEach(function(p){
        p.vy += 0.35; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.vx *= 0.99;
        c2.save(); c2.translate(p.x, p.y); c2.rotate(p.r); c2.fillStyle = p.c; c2.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); c2.restore();
      });
      if (now - start < 4000) raf = requestAnimationFrame(step); else c2.clearRect(0, 0, cv.width, cv.height);
    })(start);
  }

  /* ---------- Wiring ---------- */
  function startPolling(){ clearInterval(timer); timer = setInterval(function(){ if (active && !spinning) load(); }, REFRESH_MS); }
  function open(){
    active = true; showView('tables');
    if (document.fonts && document.fonts.load) document.fonts.load('600 30px Inter').then(drawWheel, function(){});
    load(); startPolling();
  }
  $('ldOpenBtn').addEventListener('click', open);
  $('ldBackBtn').addEventListener('click', function(){ if (spinning) return; active = false; clearInterval(timer); showView('welcome'); });
  $('ldRefreshBtn').addEventListener('click', function(){ load(); });
  spinBtn.addEventListener('click', spin);
  $('ldRespinBtn').addEventListener('click', function(){ pending = null; overlay.classList.remove('is-open'); spin(); });
  $('ldDoneBtn').addEventListener('click', confirmWinner);
  $('ldResetBtn').addEventListener('click', function(){
    if (spinning || !winners.length) return;
    if (!confirm('Clear both Souvenir Draw winners and start again?')) return;
    winners = []; saveWinners(); render();
  });
  document.addEventListener('keydown', function(e){
    if (!active || e.target.closest('input,textarea')) return;
    if (overlay.classList.contains('is-open')){
      if (e.key === 'Escape' || e.key === 'Enter'){ e.preventDefault(); confirmWinner(); }
      return;
    }
    if (e.key === ' ' || e.key === 'Enter'){ e.preventDefault(); e.stopImmediatePropagation(); spin(); }
  }, true);

  if (location.hash === '#souvenir-draw' || location.hash === '#lucky-table') open();
  render();
})();
