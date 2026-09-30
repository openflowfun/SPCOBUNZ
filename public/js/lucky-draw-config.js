/* Lucky Table Draw — shared settings for the entry page
   (/events/gala-dinner-dance-2026/lucky-draw/) and the draw wheel on the
   raffle page. Paste the Supabase project URL and publishable ("anon") key
   below. The publishable key is designed to be public: the database only lets
   visitors ADD an entry before the deadline, and only exposes per-table entry
   counts — nobody can read names, emails or phone numbers from the site. */
window.LUCKY_DRAW = {
  supabaseUrl: 'PASTE_SUPABASE_URL',
  supabaseKey: 'PASTE_SUPABASE_PUBLISHABLE_KEY',

  /* 8:15pm NZDT, Saturday 3 October 2026. The database enforces this too. */
  deadline: '2026-10-03T20:15:00+13:00',
  tables: 15,
  prize: '2 bottles of Johnnie Walker Double Black'
};

window.LUCKY_DRAW.isConfigured = function(){
  var c = window.LUCKY_DRAW;
  return c.supabaseUrl.indexOf('PASTE_') !== 0 && c.supabaseKey.indexOf('PASTE_') !== 0;
};

/* Minimal Supabase REST helper — no SDK needed. */
window.LUCKY_DRAW.request = function(path, body){
  var c = window.LUCKY_DRAW;
  return fetch(c.supabaseUrl.replace(/\/+$/, '') + '/rest/v1/' + path, {
    method: 'POST',
    headers: {
      'apikey': c.supabaseKey,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify(body || {})
  });
};
