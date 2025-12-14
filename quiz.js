const params = new URLSearchParams(window.location.search);
const moduleNo = params.get("module");

const quizContainer = document.getElementById("quiz-container");
const quizTitle = document.getElementById("quiz-title");

let allQuestions = [];
let wrongQuestions = [];

if (!moduleNo) {
  quizContainer.innerHTML = "<p>No module selected.</p>";
  throw new Error("No module specified");
}

/* ---------- TITLE ---------- */
const moduleNames = {
  1: "Module 1 – Computer Fundamentals",
  2: "Module 2 – System Maintenance & Information Security",
  3: "Module 3 – Internet Technology & Web Design",
  4: "Module 4 – Multimedia",
  5: "Module 5 – DBMS"
};

quizTitle.textContent = moduleNames[moduleNo] || `Module ${moduleNo}`;

/* ---------- FETCH ---------- */
fetch(`module${moduleNo}.json`)
  .then(res => {
    if (!res.ok) throw new Error("JSON not found");
    return res.json();
  })
  .then(data => {
    console.log("Loaded JSON:", data);
    allQuestions = data.questions;
    render(allQuestions);
  })
  .catch(err => {
    quizContainer.innerHTML = "<p>Error loading questions.</p>";
    console.error(err);
  });

/* ---------- RENDER ---------- */
function render(questions) {
  quizContainer.innerHTML = "";
  wrongQuestions = [];

  questions.forEach((q, index) => {
    const card = document.createElement("div");
    card.className = "question-card";

    let optionsHTML = "";
    q.options.forEach((opt, i) => {
      optionsHTML += `
        <button class="option-btn"
          onclick="checkAnswer(this, ${q.answer}, ${i + 1}, ${index})">
          ${opt}
        </button>`;
    });

    card.innerHTML = `
      <span class="q-no">Question ${index + 1}</span>
      <h3>${q.question}</h3>
      <div class="options">${optionsHTML}</div>
      <div class="result"></div>
    `;

    quizContainer.appendChild(card);
  });
}

/* ---------- CHECK ANSWER ---------- */
window.checkAnswer = function (btn, correct, selected, qIndex) {
  const card = btn.closest(".question-card");
  const buttons = card.querySelectorAll(".option-btn");
  const result = card.querySelector(".result");

  buttons.forEach(b => b.disabled = true);

  if (selected === correct) {
    btn.classList.add("correct");
    result.innerHTML = "✅ Correct";
  } else {
    btn.classList.add("wrong");
    result.innerHTML = "❌ Wrong";
    wrongQuestions.push(allQuestions[qIndex]);

    buttons.forEach((b, i) => {
      if (i + 1 === correct) b.classList.add("correct");
    });
  }
};

/* ---------- RETRY ---------- */
window.retryWrong = function () {
  if (wrongQuestions.length === 0) {
    alert("No wrong questions 🎉");
    return;
  }
  render(wrongQuestions);
};
