// Google Apps Script untuk Progress Tracker
// File: Code.gs


// Ganti dengan ID Spreadsheet Anda
defaultSpreadsheetId = 'SPREADSHEET_ID_ANDA';


function doGet(e) {
  var sheet = SpreadsheetApp.openById(defaultSpreadsheetId).getSheetByName('Progress');
  var data = sheet.getDataRange().getValues();
  // Jika ada parameter id, ambil data tertentu
  if (e && e.parameter && e.parameter.id) {
    var id = parseInt(e.parameter.id);
    if (!isNaN(id) && id > 0 && id < data.length) {
      return ContentService.createTextOutput(JSON.stringify(data[id])).setMimeType(ContentService.MimeType.JSON);
    } else {
      return ContentService.createTextOutput(JSON.stringify({error: 'ID not found'})).setMimeType(ContentService.MimeType.JSON);
    }
  }
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}


function doPost(e) {
  var sheet = SpreadsheetApp.openById(defaultSpreadsheetId).getSheetByName('Progress');
  var params = JSON.parse(e.postData.contents);
  var action = params.action || 'create';

  if (action === 'create') {
    sheet.appendRow([params.user, params.task, params.progress, new Date()]);
    return ContentService.createTextOutput('Created').setMimeType(ContentService.MimeType.TEXT);
  }

  if (action === 'update') {
    // params.id = index baris (mulai dari 1, baris 1 = header)
    var id = parseInt(params.id);
    if (!isNaN(id) && id > 0) {
      sheet.getRange(id+1, 1, 1, 3).setValues([[params.user, params.task, params.progress]]);
      return ContentService.createTextOutput('Updated').setMimeType(ContentService.MimeType.TEXT);
    } else {
      return ContentService.createTextOutput('Invalid ID').setMimeType(ContentService.MimeType.TEXT);
    }
  }

  if (action === 'delete') {
    var id = parseInt(params.id);
    if (!isNaN(id) && id > 0) {
      sheet.deleteRow(id+1);
      return ContentService.createTextOutput('Deleted').setMimeType(ContentService.MimeType.TEXT);
    } else {
      return ContentService.createTextOutput('Invalid ID').setMimeType(ContentService.MimeType.TEXT);
    }
  }

  return ContentService.createTextOutput('Unknown action').setMimeType(ContentService.MimeType.TEXT);
}

// Tambahkan fungsi update dan delete jika diperlukan
