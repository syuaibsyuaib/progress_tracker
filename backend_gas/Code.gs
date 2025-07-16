// Fungsi test untuk Google Apps Script
function testProgressTracker() {
  var sheet = SpreadsheetApp.openById(defaultSpreadsheetId).getSheetByName('progres');
  if (!sheet) {
    Logger.log('Sheet "Progress" tidak ditemukan. Pastikan sheet sudah ada.');
    return;
  }
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
  var action = e.parameter.action;
  var sheet = SpreadsheetApp.openById(defaultSpreadsheetId).getSheetByName('progres');
  
  if (action === 'getUserProgress') {
    var nama = e.parameter.nama;
    var data = sheet.getDataRange().getValues();
    var headers = data.shift(); // Ambil header
    var namaColumnIndex = headers.indexOf('NAMA');

    var result = data.filter(function(row) {
      return row[namaColumnIndex] === nama;
    }).map(function(row) {
      var rowObject = {};
      headers.forEach(function(header, index) {
        rowObject[header] = row[index];
      });
      return rowObject;
    }).sort(function(a, b) {
      return new Date(b.TANGGAL) - new Date(a.TANGGAL); // Urutkan dari terbaru
    });

    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
  }

  // Fallback untuk fungsionalitas get yang sudah ada
  var data = sheet.getDataRange().getValues();
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}


function doPost(e) {
  var params = JSON.parse(e.postData.contents);
  var action = params.action || 'create';
  var sheet = SpreadsheetApp.openById(defaultSpreadsheetId).getSheetByName('progres');

  // Model kolom: NOMOR, ID, ID_USER, ID_PROGRES, ID_KATEGORI, NIP, NAMA, TANGGAL, KINERJA, BOBOT, STATUS, KETERANGAN

  if (action === 'addProgress') {
    var lastRow = sheet.getLastRow();
    var newRow = [
      lastRow, // NOMOR
      Utilities.getUuid(), // ID
      params.ID_USER || '', // ID_USER
      params.ID_PROGRES || '', // ID_PROGRES
      params.ID_KATEGORI || '', // ID_KATEGORI
      params.NIP || '', // NIP
      params.NAMA || '', // NAMA
      new Date(), // TANGGAL
      params.KINERJA || '', // KINERJA
      params.BOBOT || '', // BOBOT
      'Dalam Proses', // STATUS (default)
      params.KETERANGAN || '' // KETERANGAN
    ];
    sheet.appendRow(newRow);
    return ContentService.createTextOutput(JSON.stringify({result: 'success'})).setMimeType(ContentService.MimeType.JSON);
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

  if (action === 'validateLogin') {
    return validateLogin(params);
  }

  return ContentService.createTextOutput(JSON.stringify({result: 'error', message: 'Unknown action'})).setMimeType(ContentService.MimeType.JSON);
}

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Tambah Akun')
    .addItem('Form Tambah Akun', 'showAddAccountForm')
    .addToUi();
}

function showAddAccountForm() {
  var html = HtmlService.createHtmlOutputFromFile('AddAccountForm')
    .setWidth(400)
    .setHeight(300);
  SpreadsheetApp.getUi().showModalDialog(html, 'Tambah Akun');
}

function addAccount(data) {
  var sheet = SpreadsheetApp.openById(defaultSpreadsheetId).getSheetByName('user');
  if (!sheet) {
    throw new Error('Sheet "user" tidak ditemukan.');
  }
  sheet.appendRow([data.id, data.username, data.password, data.nip, data.nama, data.role]);
}

function validateLogin(data) {
  var sheet = SpreadsheetApp.openById(defaultSpreadsheetId).getSheetByName('user');
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({success: false, message: 'Sheet "user" tidak ditemukan.'})).setMimeType(ContentService.MimeType.JSON);
  }

  var dataRange = sheet.getDataRange().getValues();
  var headers = dataRange.shift(); // Ambil header
  
  for (var i = 0; i < dataRange.length; i++) {
    var row = dataRange[i];
    var user = {};
    headers.forEach(function(header, index) {
      user[header] = row[index];
    });

    if (user.USERNAME === data.username && user.PASSWORD === data.password) {
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        user: {
          nama: user.NAMA,
          nip: user.NIP,
          role: user.ROLE
        }
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify({success: false, message: 'Invalid credentials'})).setMimeType(ContentService.MimeType.JSON);
}

function populateDummyData() {
  var sheet = SpreadsheetApp.openById(defaultSpreadsheetId).getSheetByName('user');
  if (!sheet) {
    throw new Error('Sheet "user" tidak ditemukan.');
  }

  var dummyData = [
    ['1', 'admin', 'admin123', '123456', 'Admin User', 'admin'],
    ['2', 'user1', 'password1', '654321', 'User One', 'user'],
    ['3', 'user2', 'password2', '789012', 'User Two', 'user']
  ];

  dummyData.forEach(function(row) {
    sheet.appendRow(row);
  });
}