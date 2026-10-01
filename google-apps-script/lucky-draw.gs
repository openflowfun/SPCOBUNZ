/**
 * SPC OBU NZ Gala Dinner Dance 2026 — Lucky Table Draw + "What's my table?"
 * Google Apps Script web app bound to the "Lucky Table Draw" Google Sheet.
 *
 * Tabs:
 *   Entries — lucky draw entries (created automatically on the first entry).
 *   Guests  — the final guest list: Guest name | Table | Table host
 *             (created automatically; paste the list in under the headings).
 *
 * POST                 → lucky draw entry; rejects duplicates and late entries.
 * GET ?action=counts   → entries per table for the wheel (no names or contacts).
 * GET ?action=find&q=  → up to 6 guests whose name matches, with table + host.
 *
 * After pasting a new version: Deploy → Manage deployments → ✏️ Edit →
 * Version: New version → Deploy (keeps the same web app URL).
 */
var DEADLINE = new Date('2026-10-03T20:15:00+13:00');
var TABLES = 15;
var ENTRIES = 'Entries';
var ENTRY_HEADERS = ['Entered at (NZ)', 'First name', 'Last name', 'Mobile', 'Email', 'Table (optional override)'];
var GUESTS = 'Guests';
var GUEST_HEADERS = ['Guest name', 'Table', 'Table host'];
var MAX_RESULTS = 6;
// Always write to this exact Google Sheet, wherever the script is attached:
// docs.google.com/spreadsheets/d/<SPREADSHEET_ID>/edit
var SPREADSHEET_ID = '1d5jFMBX-49UUOz2qG7YhlhCv3PrrljrPgTff5_6ViFc';

function tab_(name, headers) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(headers);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  }
  return sh;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function clean_(v, max) {
  // Strip leading formula characters so nothing typed runs as a formula.
  return String(v == null ? '' : v).trim().replace(/^[=+\-@]+/, '').slice(0, max);
}

/* "  Dr. Nimal  de-Silva " → "nimal de silva" (titles and punctuation ignored) */
function norm_(s) {
  return String(s == null ? '' : s).toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\b(mr|mrs|ms|miss|dr|rev|fr|prof)\b/g, ' ')
    .replace(/\s+/g, ' ').trim();
}

/* Guest list rows: [{name, table, host, key, words}] */
function guests_() {
  var sh = tab_(GUESTS, GUEST_HEADERS);
  var n = sh.getLastRow() - 1;
  if (n < 1) return [];
  return sh.getRange(2, 1, n, 3).getValues().map(function (r) {
    var key = norm_(r[0]);
    return { name: String(r[0]).trim(), table: parseInt(r[1], 10) || null, host: String(r[2] || '').trim(), key: key, words: key.split(' ') };
  }).filter(function (g) { return g.key; });
}

/* Every word the person typed must start one of the words in the guest's name. */
function matches_(g, qWords) {
  return qWords.every(function (q) {
    return g.words.some(function (w) { return w.indexOf(q) === 0; });
  });
}

/* Table for a draw entry: exact full-name match first, then first + last word. */
function tableFor_(first, last, list) {
  var full = norm_(first + ' ' + last);
  var f = norm_(first).split(' ')[0], l = norm_(last).split(' ').pop();
  var hit = list.filter(function (g) { return g.key === full; });
  if (!hit.length) hit = list.filter(function (g) { return g.words[0] === f && g.words[g.words.length - 1] === l; });
  var tables = hit.map(function (g) { return g.table; }).filter(Boolean);
  return tables.length && tables.every(function (t) { return t === tables[0]; }) ? tables[0] : null;
}

function doPost(e) {
  if (new Date() >= DEADLINE) return json_({ ok: false, error: 'closed' });

  var d;
  try { d = JSON.parse(e.postData.contents); } catch (err) { return json_({ ok: false, error: 'invalid' }); }
  if (d.website) return json_({ ok: true }); // honeypot: bots fill hidden fields

  var first = clean_(d.first_name, 60);
  var last = clean_(d.last_name, 60);
  var email = String(d.email || '').trim().toLowerCase().slice(0, 254);
  var mobile = String(d.mobile || '').replace(/[^\d+]/g, '');

  if (!first || !last ||
      !/^\+?\d{7,15}$/.test(mobile) ||
      !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return json_({ ok: false, error: 'invalid' });
  }

  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var sh = tab_(ENTRIES, ENTRY_HEADERS);
    var lastRow = sh.getLastRow();
    if (lastRow > 1) {
      var rows = sh.getRange(2, 4, lastRow - 1, 2).getValues(); // Mobile, Email
      for (var i = 0; i < rows.length; i++) {
        if (String(rows[i][0]).replace(/^'/, '') === mobile || String(rows[i][1]).toLowerCase() === email) {
          return json_({ ok: false, error: 'duplicate' });
        }
      }
    }
    var stamp = Utilities.formatDate(new Date(), 'Pacific/Auckland', 'yyyy-MM-dd HH:mm:ss');
    // Leading apostrophe keeps the + on mobile numbers as text. Table is left
    // blank: it's matched from the Guests tab by name (or typed in by hand).
    sh.appendRow([stamp, first, last, "'" + mobile, email, '']);
  } finally {
    lock.releaseLock();
  }
  return json_({ ok: true });
}

function counts_() {
  var list = guests_();
  var sh = tab_(ENTRIES, ENTRY_HEADERS);
  var counts = {}, total = 0, unmatched = 0;
  var n = sh.getLastRow() - 1;
  if (n > 0) {
    sh.getRange(2, 2, n, 5).getValues().forEach(function (r) {   // First, Last, Mobile, Email, Table
      total++;
      var t = parseInt(r[4], 10);                                  // manual override wins
      if (!(t >= 1 && t <= TABLES)) t = tableFor_(r[0], r[1], list);
      if (t >= 1 && t <= TABLES) counts[t] = (counts[t] || 0) + 1;
      else unmatched++;
    });
  }
  return { ok: true, counts: counts, total: total, unmatched: unmatched, guestList: list.length > 0, closed: new Date() >= DEADLINE };
}

function find_(q) {
  var qWords = norm_(q).split(' ').filter(Boolean);
  if (!qWords.length || norm_(q).replace(/\s/g, '').length < 3) return { ok: true, results: [], tooShort: true };
  var hits = guests_().filter(function (g) { return matches_(g, qWords); });
  return {
    ok: true,
    more: hits.length > MAX_RESULTS,
    results: hits.slice(0, MAX_RESULTS).map(function (g) { return { name: g.name, table: g.table, host: g.host }; })
  };
}

function doGet(e) {
  var p = (e && e.parameter) || {};
  if (p.action === 'counts') return json_(counts_());
  if (p.action === 'where') return json_({ ok: true, sheet: SpreadsheetApp.openById(SPREADSHEET_ID).getName() });
  if (p.action === 'find') return json_(find_(String(p.q || '').slice(0, 80)));
  return json_({ ok: true, service: 'Gala Dinner Dance 2026' });
}
