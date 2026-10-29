/** ERA SOLAR — ISOLATED TEST RECEIVER. NOT PRODUCTION. */
const TEST_SPREADSHEET_ID = '1mBpExQIPK9QD7vIGbzH320Enfa7BwN38CFZSebKO1gQ';
const TEST_TAB = 'LEAD SOLAR TEST';
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    const p = (e && e.parameter) || {};
    const name = String(p.name || '').trim();
    const phone = String(p.phone || '').trim();
    const monthlyBill = Number(String(p.monthlyBill || '').replace(/[^0-9]/g, ''));
    if (!name || !/^(0|\\+84)(3|5|7|8|9)[0-9]{8}$/.test(phone.replace(/[\\s.-]/g,'')) || monthlyBill < 500000) {
      return json_({ok:false,error:'INVALID_TEST_LEAD'});
    }
    const ss = SpreadsheetApp.openById(TEST_SPREADSHEET_ID);
    const sheet = ss.getSheetByName(TEST_TAB);
    if (!sheet) throw new Error('Test tab missing');
    const safe = key => String(p[key] || '').slice(0, 500).replace(/^[=+@-]/, "'$&");
    sheet.appendRow([new Date(),safe('name'),"'" + phone,monthlyBill,safe('propertyType'),safe('usageTime'),safe('range'),safe('fit'),safe('note'),safe('source'),safe('utm_source'),safe('utm_medium'),safe('utm_campaign'),safe('utm_term'),safe('utm_content'),safe('gclid')]);
    return json_({ok:true,test:true});
  } catch (err) {
    return json_({ok:false,error:String(err.message || err)});
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}
function json_(data){return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON)}
function verifyTestSheet(){
 const sheet=SpreadsheetApp.openById(TEST_SPREADSHEET_ID).getSheetByName(TEST_TAB);
 if(!sheet)throw new Error('Missing test tab');
 return {sheet:TEST_TAB,rows:sheet.getLastRow(),headers:sheet.getRange(1,1,1,16).getDisplayValues()[0]};
}
