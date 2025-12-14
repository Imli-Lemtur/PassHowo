const params = new URLSearchParams(window.location.search);
const moduleName = params.get("module");

const quizContainer = document.getElementById("quiz-container");
const quizTitle = document.getElementById("quiz-title");

let allQuestions = [];
let wrongQuestions = [];

if (!moduleName) {
  quizContainer.innerHTML = "<p>No module selected.</p>";
  throw new Error("No module specified");
}

// -------- Title formatting --------
quizTitle.textContent = moduleName
  .replace("module", "Module ")
  .replace(/(\d+)/, "$1");

// -------- Load JSON --------
fetch(`./${moduleName}.json`)
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

// -------- Render Questions --------
function render(questions) {
  quizContainer.innerHTML = "";
  wrongQuestions = [];
answeredCount = 0;
totalQuestions = questions.length;
updateProgress();
  questions.forEach((q, index) => {
    const card = document.createElement("div");
    card.className = "question-card";

    let optionsHTML = "";
    q.options.forEach((opt, i) => {
      optionsHTML += `
        <button class="option-btn"
          onclick="checkAnswer(this, ${q.answer}, ${i}, ${index})">
          ${opt}
        </button>`;
    });

    card.innerHTML = `
      <span class="q-no">Question ${index + 1}</span>
      <h3>${q.question}</h3>
      <div class="options">${optionsHTML}</div>
      <div class="result-text"></div>
    `;

    quizContainer.appendChild(card);
  });
}

// -------- Check Answer --------
window.checkAnswer = function (btn, correctIndex, clickedIndex, qIndex) {
  const card = btn.closest(".question-card");
  const buttons = card.querySelectorAll(".option-btn");
  const resultText = card.querySelector(".result-text");

  buttons.forEach(b => (b.disabled = true));
  answeredCount++;
  updateProgress();
  if (clickedIndex === correctIndex) {
    btn.classList.add("correct");
    resultText.textContent = "✅ Correct";
  } else {
    btn.classList.add("wrong");
    buttons[correctIndex].classList.add("correct");
    resultText.textContent = "❌ Wrong";
    wrongQuestions.push(allQuestions[qIndex]);
  }
};

// -------- Retry Wrong --------
window.retryWrong = function () {
  if (wrongQuestions.length === 0) {
    alert("No wrong questions 🎉");
    return;
  }
  render(wrongQuestions);
};
function updateProgress() {
  const progressEl = document.getElementById("progress");
  progressEl.textContent = `Progress: ${answeredCount} / ${totalQuestions}`;
}
