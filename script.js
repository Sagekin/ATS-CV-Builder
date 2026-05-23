// ✅ SECURITY: prevent XSS
function sanitize(input) {
  return input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ✅ VALIDATION
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ✅ KEYWORD SUGGESTION ENGINE
const keywords = [
  "JavaScript", "React", "Node.js", "Leadership",
  "Communication", "Project Management", "SQL", "Problem Solving"
];

// ✅ ATS SCORING ENGINE
function calculateScore({name, mail, skills, experience}) {
  let score = 0;
  let suggestions = [];

  if(name.length > 2) score += 10;
  else suggestions.push("Add full name");

  if(validateEmail(mail)) score += 10;
  else suggestions.push("Use valid email");

  if(skills.length >= 5) score += 30;
  else suggestions.push("Add more skills");

  if(experience.length >= 2) score += 30;
  else suggestions.push("Add more experience");

  let keywordMatch = skills.filter(s =>
    keywords.includes(s.trim())
  ).length;

  score += keywordMatch * 5;

  if(keywordMatch < 3) {
    suggestions.push("Include more ATS keywords to match the job role");
  }

  return {score, suggestions};
}

function generateResume() {

  let name = sanitize(document.getElementById("name").value);
  let contact = sanitize(document.getElementById("contact").value);
  let mail = sanitize(document.getElementById("mail").value);
  let about = sanitize(document.getElementById("about").value);

  let skills = document.getElementById("skills").value.split(",").map(s => sanitize(s.trim()));
  let experience = document.getElementById("experience").value.split("\n").map(e => sanitize(e));
  let education = document.getElementById("education").value.split("\n").map(e => sanitize(e));
  let certification = document.getElementById("certification").value.split(",").map(c => sanitize(c));

  // ✅ VALIDATION ALERTS
  if(!validateEmail(mail)) return alert("Invalid Email!");

  let preview = document.getElementById("resumePreview");

  preview.innerHTML = `
    <div class="resume-header">
      <div>
        <h2>${name}</h2>
        <p>${contact}</p>
        <p>${mail}</p>
      </div>
    </div>

    <hr>

    <h3>SUMMARY</h3>
    <p>${about}</p>

    <h3>SKILLS</h3>
    <ul>${skills.map(s => `<li>${s}</li>`).join("")}</ul>

    <h3>EXPERIENCE</h3>
    <ul>${experience.map(e => `<li>${e}</li>`).join("")}</ul>

    <h3>EDUCATION</h3>
    <ul>${education.map(e => `<li>${e}</li>`).join("")}</ul>

    <h3>CERTIFICATIONS</h3>
    <ul>${certification.map(c => `<li>${c}</li>`).join("")}</ul>
  `;

  // ✅ SCORE UPDATE
  let {score, suggestions} = calculateScore({name, mail, skills, experience});

  document.getElementById("score").innerText = score;
  document.getElementById("suggestions").innerText =
    suggestions.join(" | ");
}

// ✅ ATS FRIENDLY PDF (no images)
function downloadPDF() {
  const element = document.getElementById("resumePreview");

  const opt = {
    margin: 0.3,
    filename: 'My_Resume.pdf',
    image: { type: 'jpeg', quality: 1 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      scrollY: 0   // ✅ ensures full content capture
    },
    jsPDF: { 
      unit: 'in', 
      format: 'letter', 
      orientation: 'portrait' 
    },
    pagebreak: { 
      mode: ['avoid-all', 'css', 'legacy']  // ✅ prevents chopping
    }
  };

  html2pdf().set(opt).from(element).save();
}
// ✅ LOCAL STORAGE
function saveData() {
  let data = {
    name: name.value,
    contact: contact.value,
    mail: mail.value,
    about: about.value,
    skills: skills.value,
    experience: experience.value,
    education: education.value,
    certification: certification.value
  };

  localStorage.setItem("resumeData", JSON.stringify(data));
  alert("Saved!");
}

function loadData() {
  let data = JSON.parse(localStorage.getItem("resumeData"));
  if (!data) return alert("No data");

  for (let key in data) {
    document.getElementById(key).value = data[key];
  }

  generateResume();
}