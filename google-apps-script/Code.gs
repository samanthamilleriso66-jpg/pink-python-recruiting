const SPREADSHEET_ID = '1pQXpYmJ-eN6-iLbZ-r9UkWGSPiUov-uskCAkohO5Va8';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || '{}');
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const type = data.type === 'candidate' ? 'candidate' : 'employer';
    const sheet = getOrCreateSheet_(ss, type === 'employer' ? 'Employers' : 'Candidates', type);
    const now = new Date();

    if (type === 'employer') {
      sheet.appendRow([
        now,
        data.company || '',
        data.contact || '',
        data.email || '',
        data.phone || '',
        data.role || '',
        data.location || '',
        data.pay || '',
        data.priority || '',
        data.headcount || '',
        data.employmentType || '',
        data.details || '',
        'New'
      ]);
    } else {
      sheet.appendRow([
        now,
        data.name || '',
        data.phone || '',
        data.email || '',
        data.location || '',
        data.role || '',
        data.experience || '',
        data.availability || '',
        data.resume || '',
        data.details || '',
        'New'
      ]);
    }

    return json_({ ok: true, type: type });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function doGet() {
  return json_({ ok: true, service: 'Pink Python Recruiting intake' });
}

function getOrCreateSheet_(ss, name, type) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);

  if (sheet.getLastRow() === 0) {
    const headers = type === 'employer'
      ? ['Submitted At','Company','Contact','Email','Phone','Job Title','Location','Pay Range','Priority','Number of Hires','Employment Type','Role Details','Status']
      : ['Submitted At','Name','Phone','Email','City / State','Target Role','Years Experience','Availability','Resume / LinkedIn','Candidate Details','Status'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.autoResizeColumns(1, headers.length);
  }
  return sheet;
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
