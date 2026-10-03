/**
 * SOLAR lead receiver for Google Sheets
 * Spreadsheet: SOLAR - LEAD KHÁCH HÀNG
 * Deploy this file as a Google Apps Script Web App:
 * Execute as: Me
 * Who has access: Anyone
 *
 * IMPORTANT: after deployment, copy the /exec URL into js/config.js -> leadEndpoint.
 */
const SPREADSHEET_ID = '1PDHOvgITEfzmHX8JLOiESn0sJTV_GAxdv4PjmUrqZpk';
const SHEET_NAME = 'LEAD SOLAR';

function doPost(e) {
  try {
    const p = (e && e.parameter) || {};
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    if (!sheet) throw new Error('Không tìm thấy sheet: ' + SHEET_NAME);

    const phone = String(p.phone || '').trim();
    if (!/^(0|\+84)(3|5|7|8|9)[0-9]{8}$/.test(phone.replace(/[\s.-]/g, ''))) {
      throw new Error('Số điện thoại không hợp lệ');
    }

    const monthlyBill = Number(p.monthlyBill || 0);
    if (!monthlyBill || monthlyBill < 500000) throw new Error('Tiền điện không hợp lệ');

    const range = getSolarRange_(monthlyBill);
    sheet.appendRow([
      new Date(),
      String(p.name || '').trim(),
      phone,
      monthlyBill,
      String(p.propertyType || '').trim(),
      String(p.usageTime || '').trim(),
      range,
      'Mới',
      String(p.source || 'Landing Page').trim(),
      ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err.message || err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getSolarRange_(bill) {
  if (bill < 1500000) return '3–5 kWp';
  if (bill < 3000000) return '5–10 kWp';
  if (bill < 6000000) return '10–20 kWp';
  if (bill < 12000000) return '20–30 kWp';
  return '30–50+ kWp';
}

function testWrite() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  sheet.appendRow([new Date(),'TEST FORM','0916858566',5000000,'Nhà ở','Cả ngày','10–20 kWp','Mới','Test Apps Script','Xóa dòng test sau khi kiểm tra']);
}
