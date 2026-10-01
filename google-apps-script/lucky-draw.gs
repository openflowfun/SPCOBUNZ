/**
 * Lucky Table Draw — SPC OBU NZ Gala Dinner Dance 2026
 * Google Apps Script web app that stores entries in this Google Sheet.
 *
 * Setup (once): in the Google Sheet, Extensions → Apps Script, replace
 * everything with this file, Save, then Deploy → New deployment →
 * Web app · Execute as: Me · Who has access: Anyone → Deploy.
 *
 * POST  (entry)  → appends a row; rejects duplicates and late entries.
 * GET ?action=counts → entries per table only (never names or contacts).
 */
var DEADLINE = new Date('2026-10-03T20:15:00+13:00');
var TABLES = 15;
var SHEET_NAME = 'Entries';
var HEADERS = ['Entered at (NZ)', 'First name', 'Last name', 'Mobile', 'Email', 'Table'];

function sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
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

function doPost(e) {
  if (new Date() >= DEADLINE) return json_({ ok: false, error: 'closed' });

  var d;
  try { d = JSON.parse(e.postData.contents); } catch (err) { return json_({ ok: false, error: 'invalid' }); }
  if (d.website) return json_({ ok: true }); // honeypot: bots fill hidden fields

  var first = clean_(d.first_name, 60);
  var last = clean_(d.last_name, 60);
  var email = String(d.email || '').trim().toLowerCase().slice(0, 254);
  var mobile = String(d.mobile || '').replace(/[^\d+]/g, '');
  var table = parseInt(d.table_number, 10);

  if (!first || !last ||
      !/^\+?\d{7,15}$/.test(mobile) ||
      !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) ||
      !(table >= 1 && table <= TABLES)) {
    return json_({ ok: false, error: 'invalid' });
  }

  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var sh = sheet_();
    var last_row = sh.getLastRow();
    if (last_row > 1) {
      var rows = sh.getRange(2, 4, last_row - 1, 2).getValues(); // Mobile, Email
      for (var i = 0; i < rows.length; i++) {
        if (String(rows[i][0]).replace(/^'/, '') === mobile || String(rows[i][1]).toLowerCase() === email) {
          return json_({ ok: false, error: 'duplicate' });
        }
      }
    }
    var stamp = Utilities.formatDate(new Date(), 'Pacific/Auckland', 'yyyy-MM-dd HH:mm:ss');
    // Leading apostrophe keeps the + on mobile numbers as text.
    sh.appendRow([stamp, first, last, "'" + mobile, email, table]);
  } finally {
    lock.releaseLock();
  }
  return json_({ ok: true });
}

function doGet(e) {
  var action = e && e.parameter && e.parameter.action;
  if (action !== 'counts') return json_({ ok: true, service: 'Lucky Table Draw' });

  var counts = {};
  var total = 0;
  var sh = sheet_();
  var last_row = sh.getLastRow();
  if (last_row > 1) {
    var tables = sh.getRange(2, 6, last_row - 1, 1).getValues();
    for (var i = 0; i < tables.length; i++) {
      var t = parseInt(tables[i][0], 10);
      if (t >= 1 && t <= TABLES) { counts[t] = (counts[t] || 0) + 1; total++; }
    }
  }
  return json_({ ok: true, counts: counts, total: total, closed: new Date() >= DEADLINE });
}
