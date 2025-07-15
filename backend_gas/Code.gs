// Fungsi test untuk Google Apps Script
function testProgressTracker() {
  var sheet = SpreadsheetApp.openById(defaultSpreadsheetId).getSheetByName('Progress');
  Logger.log('Jumlah baris: ' + sheet.getLastRow());
  // Test create
  var createParams = {
    action: 'create',
    nip: '123456',
    nama: 'Tes User',
    tanggal: '2025-07-15',
    kinerja: 'Tes kinerja',
    bobot: '10',
    status: 'Selesai',
    keterangan: 'Data test',
  };
  doPost({ postData: { contents: JSON.stringify(createParams) } });
  Logger.log('Setelah create, jumlah baris: ' + sheet.getLastRow());

  // Test get
  var getResult = doGet({});
  Logger.log('Data get: ' + getResult.getContent());

  // Test update (update baris terakhir)
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    var updateParams = {
      action: 'update',
      rowIdx: lastRow,
      nomor: lastRow - 1,
      id: 'TEST-ID-UPDATE',
      id_user: 'user_update',
      id_progres: 'progres_update',
      id_kategori: 'kategori_update',
      nip: '654321',
      nama: 'User Update',
      tanggal: '2025-07-16',
      kinerja: 'Update kinerja',
      bobot: '20',
      status: 'Update',
      keterangan: 'Update test',
    };
    doPost({ postData: { contents: JSON.stringify(updateParams) } });
    Logger.log('Setelah update, data terakhir: ' + JSON.stringify(sheet.getRange(lastRow, 1, 1, 12).getValues()));
  }

  // Test delete (hapus baris terakhir)
  if (lastRow > 1) {
    var deleteParams = {
      action: 'delete',
      rowIdx: lastRow
    };
    doPost({ postData: { contents: JSON.stringify(deleteParams) } });
    Logger.log('Setelah delete, jumlah baris: ' + sheet.getLastRow());
  }
}
// Google Apps Script untuk Progress Tracker
// File: Code.gs


// Ganti dengan ID Spreadsheet Anda
defaultSpreadsheetId = '1GytHkptBkFUzEqul7EmJIH07bEeMastwsZM_DXrVQVM';


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

  // Model kolom: NOMOR, ID, ID_USER, ID_PROGRES, ID_KATEGORI, NIP, NAMA, TANGGAL, KINERJA, BOBOT, STATUS, KETERANGAN

  if (action === 'create') {
    var lastRow = sheet.getLastRow();
    var nomor = lastRow; // baris ke berapa (header di baris 1)
    var id = Utilities.getUuid();
    var id_user = params.id_user || '';
    var id_progres = params.id_progres || '';
    var id_kategori = params.id_kategori || '';
    var nip = params.nip || '';
    var nama = params.nama || '';
    var tanggal = params.tanggal || new Date();
    var kinerja = params.kinerja || '';
    var bobot = params.bobot || '';
    var status = params.status || '';
    var keterangan = params.keterangan || '';
    sheet.appendRow([
      nomor, id, id_user, id_progres, id_kategori, nip, nama, tanggal, kinerja, bobot, status, keterangan
    ]);
    return ContentService.createTextOutput('Created').setMimeType(ContentService.MimeType.TEXT);
  }

  if (action === 'update') {
    // params.id = index baris (mulai dari 1, baris 1 = header)
    var rowIdx = parseInt(params.rowIdx); // rowIdx = baris data (mulai dari 2)
    if (!isNaN(rowIdx) && rowIdx > 1) {
      sheet.getRange(rowIdx, 1, 1, 12).setValues([[
        params.nomor, params.id, params.id_user, params.id_progres, params.id_kategori, params.nip, params.nama, params.tanggal, params.kinerja, params.bobot, params.status, params.keterangan
      ]]);
      return ContentService.createTextOutput('Updated').setMimeType(ContentService.MimeType.TEXT);
    } else {
      return ContentService.createTextOutput('Invalid rowIdx').setMimeType(ContentService.MimeType.TEXT);
    }
  }

  if (action === 'delete') {
    var rowIdx = parseInt(params.rowIdx);
    if (!isNaN(rowIdx) && rowIdx > 1) {
      sheet.deleteRow(rowIdx);
      return ContentService.createTextOutput('Deleted').setMimeType(ContentService.MimeType.TEXT);
    } else {
      return ContentService.createTextOutput('Invalid rowIdx').setMimeType(ContentService.MimeType.TEXT);
    }
  }

  return ContentService.createTextOutput('Unknown action').setMimeType(ContentService.MimeType.TEXT);
}
