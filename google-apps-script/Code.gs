const POSTCARD_SHEET = "Postcard requests";
const GUESTBOOK_SHEET = "Guestbook";

function doPost(event) {
  const action = String(event.parameter.action || "");
  const website = clean(event.parameter.website, 120);
  if (website) return text("rejected");

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    if (action === "postcard") return savePostcard(event.parameter);
    if (action === "guestbook") return saveGuestbook(event.parameter);
    return text("unknown action");
  } finally {
    lock.releaseLock();
  }
}

function doGet(event) {
  if (String(event.parameter.action || "") !== "guestbook") return text("not found");
  const callback = String(event.parameter.callback || "");
  if (!/^[A-Za-z_$][0-9A-Za-z_$\.]*$/.test(callback)) return text("invalid callback");

  const sheet = getOrCreateGuestbookSheet();
  const rows = sheet.getLastRow() < 2 ? [] : sheet.getRange(2, 1, sheet.getLastRow() - 1, 7).getValues();
  const entries = rows
    .filter((row) => String(row[6]).toLowerCase() === "approved")
    .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
    .slice(0, 24)
    .map((row) => ({
      createdAt: new Date(row[0]).toISOString(),
      displayName: String(row[1] || "Anonymous visitor"),
      message: String(row[2] || ""),
      favouriteArtworkTitle: row[4] ? String(row[4]) : null,
    }));
  return ContentService
    .createTextOutput(callback + "(" + JSON.stringify(entries) + ");")
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function savePostcard(params) {
  const email = clean(params.email, 160);
  const artworkId = clean(params.artwork_id, 80);
  const artworkTitle = clean(params.artwork_title, 160);
  if (!email || !artworkId || !artworkTitle || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return text("rejected");
  const sheet = getOrCreateSheet(POSTCARD_SHEET, ["Created at", "Email", "Artwork ID", "Artwork title", "Source"]);
  sheet.appendRow([new Date(), safeCell(email), safeCell(artworkId), safeCell(artworkTitle), "online-exhibition"]);
  return text("ok");
}

function saveGuestbook(params) {
  const displayName = clean(params.display_name, 60) || "Anonymous visitor";
  const message = clean(params.message, 600);
  const artworkId = clean(params.favourite_artwork_id, 80);
  const artworkTitle = clean(params.favourite_artwork_title, 160);
  if (message.length < 4) return text("rejected");
  const sheet = getOrCreateGuestbookSheet();
  sheet.appendRow([new Date(), safeCell(displayName), safeCell(message), safeCell(artworkId), safeCell(artworkTitle), "online-exhibition", "approved"]);
  return text("ok");
}

function getOrCreateGuestbookSheet() {
  return getOrCreateSheet(GUESTBOOK_SHEET, ["Created at", "Display name", "Message", "Favourite artwork ID", "Favourite artwork title", "Source", "Status"]);
}

function getOrCreateSheet(name, headers) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(name);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(name);
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
  }
  return sheet;
}

function clean(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

function safeCell(value) {
  return /^[=+\-@]/.test(value) ? "'" + value : value;
}

function text(value) {
  return ContentService.createTextOutput(value).setMimeType(ContentService.MimeType.TEXT);
}
