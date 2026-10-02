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
  var hub = $('ldHub'), stopBtn = $('ldStopBtn');

  /* Size the wheel to the largest circle that fits the stage, and draw it at
     the screen's real pixel density so names stay sharp on a projector. */
  function fitWheel(){
    var area = $('sdWheelArea');
    if (!area || !area.clientWidth) return;
    var size = Math.floor(Math.min(area.clientWidth, area.clientHeight) * 0.97);
    if (size < 200) size = 200;
    document.getElementById('ldWheelBox').style.setProperty('--wheel', size + 'px');
    var dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    var px = Math.round(size * dpr);
    if (canvas.width !== px){ canvas.width = px; canvas.height = px; }
    drawWheel();
  }
  window.addEventListener('resize', function(){ if (active) fitWheel(); });
  /* Re-fit whenever the stage actually changes size (first show, full screen,
     window resize) — more reliable than timers. */
  if (window.ResizeObserver){
    new ResizeObserver(function(){ if (active) fitWheel(); }).observe(document.getElementById('sdWheelArea'));
  }
  document.addEventListener('fullscreenchange', function(){ if (active) setTimeout(fitWheel, 60); });
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

  /* ---------- Sound (Web Audio, generated live: no files to load) ---------- */
  var SOUND_KEY = 'spcobunz-draw-sound';
  var soundOn = true;
  try { soundOn = localStorage.getItem(SOUND_KEY) !== 'off'; } catch(e){}
  var AC = null, master = null, whir = null, whirGain = null, lastTick = 0;
  function audio(){
    if (!soundOn) return null;
    if (!AC){
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      AC = new Ctx();
      master = AC.createGain(); master.gain.value = 0.9;
      var comp = AC.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 4;
      master.connect(comp); comp.connect(AC.destination);
    }
    if (AC.state === 'suspended') AC.resume();
    return AC;
  }
  function noiseBuffer(sec){
    var b = AC.createBuffer(1, Math.floor(AC.sampleRate * sec), AC.sampleRate), d = b.getChannelData(0);
    for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return b;
  }
  /* A wooden "clack" as each peg passes the pointer. */
  function tick(speed){
    var a = audio(); if (!a) return;
    var now = performance.now();
    if (now - lastTick < 34) return;               // never a buzz, always distinct clicks
    lastTick = now;
    var t = a.currentTime, o = a.createOscillator(), g = a.createGain(), f = a.createBiquadFilter();
    o.type = 'square'; o.frequency.setValueAtTime(1500 + Math.random() * 300, t); o.frequency.exponentialRampToValueAtTime(420, t + 0.03);
    f.type = 'bandpass'; f.frequency.value = 2200; f.Q.value = 1.4;
    var vol = Math.min(0.32, 0.12 + speed * 18);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);
    o.connect(f); f.connect(g); g.connect(master); o.start(t); o.stop(t + 0.05);
  }
  /* Airy whoosh that follows the wheel's speed. */
  function whirStart(){
    var a = audio(); if (!a || whir) return;
    whir = a.createBufferSource(); whir.buffer = noiseBuffer(2); whir.loop = true;
    var f = a.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 650; f.Q.value = 0.7;
    whirGain = a.createGain(); whirGain.gain.value = 0;
    whir.connect(f); f.connect(whirGain); whirGain.connect(master); whir.start();
    whir._f = f;
  }
  function whirSet(speed){
    if (!whir || !AC) return;
    var t = AC.currentTime;
    whirGain.gain.setTargetAtTime(Math.min(0.16, speed * 14), t, 0.08);
    whir._f.frequency.setTargetAtTime(380 + speed * 60000, t, 0.1);
  }
  function whirStop(){
    if (!whir) return;
    try { whirGain.gain.setTargetAtTime(0, AC.currentTime, 0.15); var w = whir; setTimeout(function(){ try { w.stop(); } catch(e){} }, 800); } catch(e){}
    whir = null;
  }
  /* Party-popper bang: a crack of noise plus a low thump. */
  function pop(delay, pan){
    var a = audio(); if (!a) return;
    var t = a.currentTime + (delay || 0);
    var n = a.createBufferSource(); n.buffer = noiseBuffer(0.4);
    var hp = a.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 900;
    var g = a.createGain(); g.gain.setValueAtTime(0.9, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
    var p = a.createStereoPanner ? a.createStereoPanner() : null;
    n.connect(hp); hp.connect(g);
    if (p){ p.pan.value = pan || 0; g.connect(p); p.connect(master); } else g.connect(master);
    n.start(t); n.stop(t + 0.4);
    var o = a.createOscillator(), og = a.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(180, t); o.frequency.exponentialRampToValueAtTime(45, t + 0.18);
    og.gain.setValueAtTime(0.7, t); og.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    o.connect(og); og.connect(master); o.start(t); o.stop(t + 0.25);
  }
  /* Bright brass-style fanfare and sparkling chimes. */
  function fanfare(){
    var a = audio(); if (!a) return;
    var t0 = a.currentTime + 0.25;
    var notes = [[523.25,0,.16],[659.25,.16,.16],[783.99,.32,.16],[1046.5,.48,.62],[783.99,1.1,.14],[1046.5,1.24,1.1]];
    notes.forEach(function(n){
      [0, 3].forEach(function(det, k){
        var o = a.createOscillator(), g = a.createGain(), f = a.createBiquadFilter();
        o.type = k ? 'triangle' : 'sawtooth'; o.frequency.value = n[0]; o.detune.value = det;
        f.type = 'lowpass'; f.frequency.value = 2600;
        var t = t0 + n[1], d = n[2];
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(k ? 0.12 : 0.07, t + 0.03);
        g.gain.setValueAtTime(k ? 0.12 : 0.07, t + d * 0.7); g.gain.exponentialRampToValueAtTime(0.0001, t + d + 0.25);
        o.connect(f); f.connect(g); g.connect(master); o.start(t); o.stop(t + d + 0.3);
      });
    });
    // final chord
    [523.25, 659.25, 783.99, 1046.5].forEach(function(fq){
      var o = a.createOscillator(), g = a.createGain(); o.type = 'triangle'; o.frequency.value = fq;
      var t = t0 + 1.24; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.06, t + 0.05); g.gain.exponentialRampToValueAtTime(0.0001, t + 2.4);
      o.connect(g); g.connect(master); o.start(t); o.stop(t + 2.5);
    });
    // sparkles
    for (var i = 0; i < 14; i++){
      var o = a.createOscillator(), g = a.createGain(), t = t0 + 1.3 + i * 0.09 + Math.random() * 0.05;
      o.type = 'sine'; o.frequency.value = 1800 + Math.random() * 2200;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.05, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
      o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.4);
    }
  }
  function setSound(on){
    soundOn = on;
    try { localStorage.setItem(SOUND_KEY, on ? 'on' : 'off'); } catch(e){}
    var b = $('sdSoundBtn');
    if (b){ b.classList.toggle('is-off', !on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); b.querySelector('span').textContent = on ? 'Sound on' : 'Sound off'; }
    if (!on) whirStop();
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

      /* Full names, never shortened: sized so each fits inside its slice
         and between the rim and the crest. */
      var rimGap = R * 0.075, hubR = R * 0.205, avail = R - rimGap - hubR;
      ctx.save();
      ctx.rotate(i * size + size / 2);
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      ctx.fillStyle = LIGHT[fill] ? '#0C1633' : '#F1DDAA';
      /* Start from the slice width near the rim, then make sure the name also
         fits the (narrower) slice where it ends, and the space to the crest. */
      var fs = Math.min(R * 0.07, size * (R - rimGap) * 0.7), tw = 0;
      for (var k = 0; k < 6; k++){
        ctx.font = '600 ' + fs + 'px Inter, system-ui, sans-serif';
        tw = ctx.measureText(e.name).width;
        var innerR = R - rimGap - Math.min(tw, avail);
        var maxByArc = size * innerR * 0.74;
        var next = Math.min(fs, maxByArc, fs * Math.min(1, avail / tw));
        if (next >= fs - 0.25) break;
        fs = next;
      }
      ctx.font = '600 ' + fs + 'px Inter, system-ui, sans-serif';
      ctx.fillText(e.name, R - rimGap, 0);
      ctx.restore();
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
    if (spinning){
      spinLabel.textContent = stopRequested ? 'Stopping\u2026' : 'STOP the wheel';
      spinBtn.classList.add('is-stop');
      spinBtn.disabled = stopRequested;
    } else {
      spinLabel.textContent = allDone() ? 'Both draws complete' : 'Spin for Draw ' + currentDraw();
      spinBtn.classList.remove('is-stop');
      spinBtn.disabled = allDone() || list.length === 0;
    }
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

  /* Spin: speeds up and keeps turning until STOP is pressed (no auto-stop),
     then glides to a stop on a winner chosen at random. */
  var STOP_MS = 3800, SPEED = 0.0105;   // rad per ms at full speed
  var stopRequested = false, spinStart = 0, lastSlice = -1;
  function passTicks(list, v){
    var size = Math.PI * 2 / list.length;
    var at = Math.floor(norm(-Math.PI / 2 - rotation) / size);  // slice under the pointer
    if (at !== lastSlice){ lastSlice = at; tick(v); }
    whirSet(v);
  }
  function spin(){
    if (spinning || allDone()) return;
    var list = onWheel();
    if (!list.length) return;
    spinning = true; stopRequested = false; clearInterval(timer);
    hub.classList.add('is-spinning'); hub.classList.remove('is-stopping');
    renderPanel();
    audio(); whirStart();
    spinStart = performance.now();
    var last = spinStart;
    (function run(now){
      var t = now - spinStart, dt = Math.min(50, now - last); last = now;
      var v = SPEED * Math.min(1, t / 900);           // ease up to full speed
      rotation += v * dt;
      drawWheel(); passTicks(list, v);
      if (stopRequested){ glideToWinner(list, v, now); return; }
      requestAnimationFrame(run);
    })(spinStart);
  }
  function requestStop(){
    if (!spinning || stopRequested) return;
    if (performance.now() - spinStart < 700) return;  // ignore an accidental double-tap
    stopRequested = true;
    renderPanel();
  }
  function glideToWinner(list, v, t0){
    hub.classList.add('is-stopping');
    var idx = Math.floor(rnd() * list.length);
    var size = Math.PI * 2 / list.length;
    var inside = idx * size + size * (0.2 + 0.6 * rnd());
    var from = rotation;
    var base = norm(-Math.PI / 2 - inside - from);
    var want = Math.max(v, 0.002) * STOP_MS / 4;     // ease-out quartic starts at 4x average speed
    var turns = Math.max(0, Math.round((want - base) / (Math.PI * 2)));
    var delta = base + turns * Math.PI * 2;
    var dur = Math.max(1600, Math.min(STOP_MS * 1.5, (delta * 4) / Math.max(v, 0.002)));
    var prev = t0, prevRot = from;
    (function frame(now){
      var p = Math.min(1, (now - t0) / dur);
      rotation = from + delta * easeOut(p);
      var sp = (rotation - prevRot) / Math.max(1, now - prev); prev = now; prevRot = rotation;
      drawWheel(); passTicks(list, sp);
      if (p < 1){ requestAnimationFrame(frame); return; }
      rotation = norm(rotation);
      spinning = false; stopRequested = false;
      whirStop();
      hub.classList.remove('is-spinning', 'is-stopping');
      pending = list[idx];
      renderPanel();
      setTimeout(function(){ announce(pending); }, 450);   // a beat of suspense
    })(t0);
  }

  function announce(w){
    var d = winners.length + 1;
    $('ldWinRound').textContent = 'Souvenir Draw \u00b7 Draw ' + d + ' of ' + DRAWS;
    var nameEl = $('ldWinName');
    nameEl.innerHTML = ''; nameEl.style.fontSize = ''; nameEl.classList.remove('is-glinting');
    w.name.split(/\s+/).forEach(function(word){
      var sp = document.createElement('span'); sp.className = 'w'; sp.textContent = word; nameEl.appendChild(sp);
      nameEl.appendChild(document.createTextNode(' '));
    });
    $('ldDoneLabel').textContent = d < DRAWS ? 'Confirm & go to Draw ' + (d + 1) : 'Confirm winner';
    /* Restart the CSS entrance animations. */
    overlay.classList.remove('is-open'); void overlay.offsetWidth;
    overlay.classList.add('is-open');
    /* As big as the screen allows, without ever splitting a word. */
    requestAnimationFrame(function(){
      var fs = parseFloat(getComputedStyle(nameEl).fontSize), guard = 0, maxW = window.innerWidth * 0.94;
      var widest = function(){ return Math.max.apply(null, [].map.call(nameEl.querySelectorAll('.w'), function(x){ return x.offsetWidth; })); };
      while ((widest() > maxW || nameEl.offsetHeight > window.innerHeight * 0.42) && fs > 32 && guard++ < 60){ fs -= 4; nameEl.style.fontSize = fs + 'px'; }
    });
    pop(0, -0.7); pop(0.12, 0.7); fanfare();
    setTimeout(function(){ pop(0, -0.4); pop(0.09, 0.5); }, 1050);   // second burst as the name lands
    confetti();
  }
  function confirmWinner(){
    cancelAnimationFrame(raf);
    if (pending){ winners.push(pending); saveWinners(); pending = null; }
    overlay.classList.remove('is-open');
    render(); startPolling();
  }

  /* ---------- Confetti: two party poppers, a second burst, then gold rain ---------- */
  var raf = null;
  function confetti(){
    var cv = $('ldConfetti'), c2 = cv.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = innerWidth, H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr; c2.setTransform(dpr, 0, 0, dpr, 0, 0);
    var colors = ['#FFF3C9', '#E3C566', '#C9A227', '#A5841C', '#FFFFFF', '#5B7BD5', '#F1DDAA'];
    var parts = [], k = Math.max(W, H) / 1000;
    function cannon(x, y, angle, n, power){
      for (var i = 0; i < n; i++){
        var a = angle + (rnd() - 0.5) * 0.9, sp = (9 + rnd() * 15) * power * k;
        parts.push({ x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, kind: rnd() < 0.22 ? 'ribbon' : (rnd() < 0.3 ? 'dot' : 'rect'),
          s: (6 + rnd() * 9) * k, r: rnd() * 6, vr: (rnd() - 0.5) * 0.35, wob: rnd() * 6, c: colors[(rnd() * colors.length) | 0], life: 1 });
      }
    }
    function rain(n){
      for (var i = 0; i < n; i++){
        parts.push({ x: rnd() * W, y: -20 - rnd() * H * 0.4, vx: (rnd() - 0.5) * 2, vy: 2 + rnd() * 3, kind: rnd() < 0.3 ? 'ribbon' : 'rect',
          s: (6 + rnd() * 8) * k, r: rnd() * 6, vr: (rnd() - 0.5) * 0.25, wob: rnd() * 6, c: colors[(rnd() * colors.length) | 0], life: 1 });
      }
    }
    cannon(0, H, -Math.PI / 3.1, 170, 1.15);          // bottom-left popper
    cannon(W, H, -Math.PI + Math.PI / 3.1, 170, 1.15);// bottom-right popper
    setTimeout(function(){ cannon(W * 0.5, H * 0.62, -Math.PI / 2, 140, 1.0); }, 1050);  // burst behind the name
    var rainUntil = performance.now() + 9000, lastRain = 0;
    var start = performance.now(); cancelAnimationFrame(raf);
    (function step(now){
      c2.clearRect(0, 0, W, H);
      if (now < rainUntil && now - lastRain > 140){ lastRain = now; rain(6); }
      for (var i = parts.length - 1; i >= 0; i--){
        var p = parts[i];
        p.vy += 0.28 * k; p.vx *= 0.985; p.vy *= 0.985;
        if (p.vy > 4.5 * k) p.vy = 4.5 * k;              // flutter down rather than drop
        p.wob += 0.12; p.x += p.vx + Math.sin(p.wob) * 0.8; p.y += p.vy; p.r += p.vr;
        if (p.y > H + 40){ parts.splice(i, 1); continue; }
        c2.save(); c2.translate(p.x, p.y); c2.rotate(p.r); c2.fillStyle = p.c;
        if (p.kind === 'dot'){ c2.beginPath(); c2.arc(0, 0, p.s * 0.35, 0, Math.PI * 2); c2.fill(); }
        else if (p.kind === 'ribbon'){
          c2.strokeStyle = p.c; c2.lineWidth = p.s * 0.28; c2.beginPath();
          c2.moveTo(-p.s, 0); c2.quadraticCurveTo(-p.s * 0.3, Math.sin(p.wob) * p.s, 0, 0); c2.quadraticCurveTo(p.s * 0.3, -Math.sin(p.wob) * p.s, p.s, 0); c2.stroke();
        } else {
          c2.scale(1, Math.cos(p.wob));                   // tumbling paper
          c2.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
        }
        c2.restore();
      }
      if (overlay.classList.contains('is-open') && (parts.length || now < rainUntil)) raf = requestAnimationFrame(step);
      else c2.clearRect(0, 0, W, H);
    })(start);
  }

  /* ---------- Wiring ---------- */
  function startPolling(){ clearInterval(timer); timer = setInterval(function(){ if (active && !spinning) load(); }, REFRESH_MS); }
  function open(){
    active = true; showView('tables'); document.documentElement.classList.add('sd-on'); setTimeout(fitWheel, 30);
    if (document.fonts && document.fonts.load) document.fonts.load('600 30px Inter').then(fitWheel, function(){});
    load(); startPolling();
  }
  $('ldOpenBtn').addEventListener('click', open);
  $('ldBackBtn').addEventListener('click', function(){
    if (spinning) return; active = false; clearInterval(timer);
    document.documentElement.classList.remove('sd-on'); showView('welcome');
  });
  $('sdFsBtn').addEventListener('click', function(){
    var d = document;
    if (d.fullscreenElement){ d.exitFullscreen && d.exitFullscreen(); }
    else { var el = d.documentElement; (el.requestFullscreen || el.webkitRequestFullscreen || function(){}).call(el); }
  });
  $('ldRefreshBtn').addEventListener('click', function(){ load(); });
  spinBtn.addEventListener('click', function(){ if (spinning) requestStop(); else spin(); });
  if ($('sdSoundBtn')){ $('sdSoundBtn').addEventListener('click', function(){ setSound(!soundOn); }); setSound(soundOn); }
  stopBtn.addEventListener('click', requestStop);
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
    if (e.key === ' ' || e.key === 'Enter'){ e.preventDefault(); e.stopImmediatePropagation(); if (spinning) requestStop(); else spin(); }
  }, true);

  if (location.hash === '#souvenir-draw' || location.hash === '#lucky-table') open();
  render();
})();
