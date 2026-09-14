const PINK_PYTHON_EMAIL='samanthamilleriso66@gmail.com';

function openGmail(subject, body){
  const url='https://mail.google.com/mail/?view=cm&fs=1&to='+encodeURIComponent(PINK_PYTHON_EMAIL)+'&su='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
  window.open(url,'_blank','noopener');
}
function values(form){return Object.fromEntries(new FormData(form).entries())}

document.getElementById('employerForm').addEventListener('submit',e=>{
 e.preventDefault(); const v=values(e.target);
 const body=`PINK PYTHON EMPLOYER INTAKE\n\nCompany: ${v.company}\nContact: ${v.contact}\nEmail: ${v.email}\nPhone: ${v.phone||'Not provided'}\nJob Title: ${v.role}\nLocation: ${v.location}\nPay Range: ${v.pay||'Not provided'}\nPriority: ${v.priority}\nNumber of Hires: ${v.headcount}\nEmployment Type: ${v.type}\n\nROLE DETAILS\n${v.details}\n\nSubmitted from the Pink Python Recruiting website.`;
 openGmail(`Employer Intake — ${v.company} — ${v.role}`,body);
});

document.getElementById('candidateForm').addEventListener('submit',e=>{
 e.preventDefault(); const v=values(e.target);
 const body=`PINK PYTHON CANDIDATE INTAKE\n\nName: ${v.name}\nPhone: ${v.phone}\nEmail: ${v.email}\nCity / State: ${v.location}\nTarget Role: ${v.role}\nYears of Experience: ${v.experience||'Not provided'}\nAvailability: ${v.availability}\nResume / LinkedIn: ${v.resume||'Not provided'}\n\nCANDIDATE DETAILS\n${v.details}\n\nSubmitted from the Pink Python Recruiting website.`;
 openGmail(`Candidate Intake — ${v.name} — ${v.role}`,body);
});