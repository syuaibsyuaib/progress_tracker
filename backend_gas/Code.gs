// Google Apps Script untuk Progress Tracker
// File: Code.gs

// Ganti dengan ID Spreadsheet Anda
defaultSpreadsheetId = 'SPREADSHEET_ID_ANDA';

function doGet(e) {
  var sheet = SpreadsheetApp.openById(defaultSpreadsheetId).getSheetByName('Progress');
  var data = sheet.getDataRange().getValues();
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var sheet = SpreadsheetApp.openById(defaultSpreadsheetId).getSheetByName('Progress');
  var params = JSON.parse(e.postData.contents);
  sheet.appendRow([params.user, params.task, params.progress, new Date()]);
  return ContentService.createTextOutput('OK');
}

// Tambahkan fungsi update dan delete jika diperlukan
