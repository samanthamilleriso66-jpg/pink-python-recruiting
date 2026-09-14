const SPREADSHEET_ID = '1pQXpYmJ-eN6-iLbZ-r9UkWGSPiUov-uskCAkohO5Va8';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || '{}');
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    ensureCrmSheets_(ss);
    const type = data.type === 'candidate' ? 'candidate' : 'employer';
    const sheet = ss.getSheetByName(type === 'employer' ? 'Employers' : 'Candidates');
    const now = new Date();

    if (type === 'employer') {
      sheet.appendRow([now,data.company||'',data.contact||'',data.email||'',data.phone||'',data.role||'',data.location||'',data.pay||'',data.priority||'',data.headcount||'',data.employmentType||'',data.details||'','New']);
    } else {
      sheet.appendRow([now,data.name||'',data.phone||'',data.email||'',data.location||'',data.role||'',data.experience||'',data.availability||'',data.resume||'',data.details||'','New']);
    }
    return json_({ok:true,type:type});
  } catch(err) {
    return json_({ok:false,error:String(err)});
  }
}

function doGet(e) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  ensureCrmSheets_(ss);
  if (e && e.parameter && e.parameter.action === 'setup') {
    return json_({ok:true,message:'Pink Python CRM sheets are ready'});
  }
  return json_({ok:true,service:'Pink Python Recruiting CRM'});
}

function setupCRM() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  ensureCrmSheets_(ss);
  SpreadsheetApp.flush();
  return 'Pink Python CRM is ready.';
}

function ensureCrmSheets_(ss) {
  createSheet_(ss,'Employers',['Submitted At','Company','Contact','Email','Phone','Job Title','Location','Pay Range','Priority','Number of Hires','Employment Type','Role Details','Status']);
  createSheet_(ss,'Candidates',['Submitted At','Name','Phone','Email','City / State','Target Role','Years Experience','Availability','Resume / LinkedIn','Candidate Details','Status']);
  createSheet_(ss,'Open Jobs',['Job ID','Created','Company','Job Title','Location','Pay Range','Priority','Openings','Employment Type','Job Details','Status','Target Fill Date','Notes']);
  createSheet_(ss,'Matches',['Match ID','Date','Job ID','Candidate','Candidate Email','Company','Job Title','Match Status','Notes']);
  createSheet_(ss,'Submissions',['Submission ID','Date','Job ID','Candidate','Company','Job Title','Submitted To','Status','Next Follow-Up','Notes']);
  createSheet_(ss,'Interviews',['Interview ID','Date','Job ID','Candidate','Company','Job Title','Interview Date','Interview Stage','Status','Feedback','Next Step']);
  createSheet_(ss,'Placements',['Placement ID','Date','Job ID','Candidate','Company','Job Title','Start Date','Fee Type','Fee Amount','Payment Status','Invoice Date','Paid Date','Notes']);
  createSheet_(ss,'Invoices',['Invoice ID','Invoice Date','Placement ID','Company','Candidate','Job Title','Amount','Due Date','Status','Paid Date','Notes']);
  createDashboard_(ss);
}

function createSheet_(ss,name,headers) {
  let sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  if (sh.getLastRow() === 0) {
    sh.getRange(1,1,1,headers.length).setValues([headers]);
    sh.setFrozenRows(1);
    sh.getRange(1,1,1,headers.length).setFontWeight('bold');
    sh.autoResizeColumns(1,headers.length);
  }
  return sh;
}

function createDashboard_(ss) {
  let sh = ss.getSheetByName('Dashboard');
  if (!sh) sh = ss.insertSheet('Dashboard');
  sh.clear();
  sh.getRange('A1').setValue('PINK PYTHON RECRUITING — DASHBOARD').setFontWeight('bold').setFontSize(16);
  sh.getRange('A3:B12').setValues([
    ['Metric','Count'],
    ['Employers','=MAX(COUNTA(Employers!B:B)-1,0)'],
    ['Candidates','=MAX(COUNTA(Candidates!B:B)-1,0)'],
    ['Open Jobs','=COUNTIF(\'Open Jobs\'!K:K,"Open")'],
    ['Active Matches','=COUNTIF(Matches!H:H,"Active")'],
    ['Submitted Candidates','=COUNTIF(Submissions!H:H,"Submitted")'],
    ['Interviews','=COUNTIF(Interviews!I:I,"Scheduled")'],
    ['Placements','=MAX(COUNTA(Placements!A:A)-1,0)'],
    ['Unpaid Invoices','=COUNTIF(Invoices!I:I,"Unpaid")'],
    ['Revenue Collected','=SUMIF(Invoices!I:I,"Paid",Invoices!G:G)']
  ]);
  sh.getRange('A3:B3').setFontWeight('bold');
  sh.autoResizeColumns(1,2);
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
