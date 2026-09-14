// Paste the deployed Google Apps Script Web App URL here once deployed.
const INTAKE_ENDPOINT = '';
const PINK_PYTHON_EMAIL='samanthamilleriso66@gmail.com';

function openGmail(subject, body){
  const url='https://mail.google.com/mail/?view=cm&fs=1&to='+encodeURIComponent(PINK_PYTHON_EMAIL)+'&su='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
  window.open(url,'_blank','noopener');
}
function values(form){return Object.fromEntries(new FormData(form).entries())}

async function sendIntake(data, subject, body){
  if(!INTAKE_ENDPOINT){
    openGmail(subject, body);
    return {ok:true, fallback:true};
  }

  try {
    const response = await fetch(INTAKE_ENDPOINT, {
      method:'POST',
      headers:{'Content-Type':'text/plain;charset=utf-8'},
      body:JSON.stringify(data),
      mode:'no-cors'
    });
    return {ok:true};
  } catch(err) {
    openGmail(subject, body);
    return {ok:true, fallback:true};
  }
}

function setSubmitting(button, text){
  button.disabled=true;
  button.dataset.originalText=button.textContent;
  button.textContent=text;
}
function resetButton(button){
  button.disabled=false;
  button.textContent=button.dataset.originalText || 'Submit';
}

const employerForm=document.getElementById('employerForm');
employerForm.addEventListener('submit',async e=>{
 e.preventDefault(); const v=values(e.target); const button=e.target.querySelector('button[type="submit"]');
 const body=`PINK PYTHON EMPLOYER INTAKE\n\nCompany: ${v.company}\nContact: ${v.contact}\nEmail: ${v.email}\nPhone: ${v.phone||'Not provided'}\nJob Title: ${v.role}\nLocation: ${v.location}\nPay Range: ${v.pay||'Not provided'}\nPriority: ${v.priority}\nNumber of Hires: ${v.headcount}\nEmployment Type: ${v.type}\n\nROLE DETAILS\n${v.details}\n\nSubmitted from the Pink Python Recruiting website.`;
 setSubmitting(button,'Sending...');
 await sendIntake({type:'employer',...v,employmentType:v.type},`Employer Intake — ${v.company} — ${v.role}`,body);
 resetButton(button);
 alert(INTAKE_ENDPOINT ? 'Recruiting request received. Pink Python has been notified.' : 'Your request is ready in Gmail. Please review it and click Send.');
});

const candidateForm=document.getElementById('candidateForm');
candidateForm.addEventListener('submit',async e=>{
 e.preventDefault(); const v=values(e.target); const button=e.target.querySelector('button[type="submit"]');
 const body=`PINK PYTHON CANDIDATE INTAKE\n\nName: ${v.name}\nPhone: ${v.phone}\nEmail: ${v.email}\nCity / State: ${v.location}\nTarget Role: ${v.role}\nYears of Experience: ${v.experience||'Not provided'}\nAvailability: ${v.availability}\nResume / LinkedIn: ${v.resume||'Not provided'}\n\nCANDIDATE DETAILS\n${v.details}\n\nSubmitted from the Pink Python Recruiting website.`;
 setSubmitting(button,'Sending...');
 await sendIntake({type:'candidate',...v},`Candidate Intake — ${v.name} — ${v.role}`,body);
 resetButton(button);
 alert(INTAKE_ENDPOINT ? 'Candidate profile received. Pink Python has been notified.' : 'Your profile is ready in Gmail. Please review it and click Send.');
});