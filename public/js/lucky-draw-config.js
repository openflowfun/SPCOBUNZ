/* Lucky Table Draw — shared settings for the entry page
   (/events/gala-dinner-dance-2026/lucky-draw/) and the draw wheel on the
   raffle page, plus the "What's my table?" page. Entries are stored in a Google Sheet through a Google Apps
   Script web app (source: /google-apps-script/lucky-draw.gs). The web app
   only accepts new entries before the deadline and only ever returns
   per-table counts — names, emails and numbers stay in the Sheet. */
window.LUCKY_DRAW = {
  appsScriptUrl: 'https://script.google.com/macros/s/AKfycbxNd61CA-coZ3mzcNBEprqj8nIN-pQUz0CeKArv_e0SU5QE8EcfFyo9RkqtzD1lVkSI8g/exec',

  /* 8:15pm NZDT, Saturday 3 October 2026. The web app enforces this too. */
  deadline: '2026-10-03T20:15:00+13:00',
  tables: 15,
  prize: '2 bottles of Johnnie Walker Double Black'
};

window.LUCKY_DRAW.isConfigured = function(){
  return /^https:\/\/script\.google\.com\//.test(window.LUCKY_DRAW.appsScriptUrl);
};

/* Send an entry. Plain-text body keeps it a "simple" request (no CORS
   preflight), which Apps Script web apps require. Resolves to
   { ok: true } or { ok: false, error: 'duplicate' | 'closed' | 'invalid' }. */
window.LUCKY_DRAW.submit = function(entry){
  return fetch(window.LUCKY_DRAW.appsScriptUrl, {
    method: 'POST',
    body: JSON.stringify(entry),
    redirect: 'follow'
  }).then(function(res){
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
  });
};

/* Per-table entry counts for the wheel: { ok, counts: {table: n}, total, closed } */
window.LUCKY_DRAW.counts = function(){
  return fetch(window.LUCKY_DRAW.appsScriptUrl + '?action=counts&t=' + Date.now(), { redirect: 'follow' })
    .then(function(res){
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    });
};

/* "What's my table?" lookup: { ok, results: [{name, table, host}], more, tooShort } */
window.LUCKY_DRAW.find = function(q){
  return fetch(window.LUCKY_DRAW.appsScriptUrl + '?action=find&q=' + encodeURIComponent(q), { redirect: 'follow' })
    .then(function(res){
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    });
};
