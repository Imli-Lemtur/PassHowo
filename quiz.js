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

.then(data => {
  console.log("Loaded JSON:", data);

  // ✅ Use module title directly from JSON
  quizTitle.textContent = data.module;

  allQuestions = data.questions;
  render(allQuestions);
})

fetch(`./${moduleName}.json`)
  .then(res => {
    if (!res.ok) throw new Error("JSON not found");
    return res.json();
  })
  .then(data => {
    allQuestions = data.questions;
    render(allQuestions);
  })
  .catch(err => {
    quizContainer.innerHTML = "<p>Error loading questions.</p>";
    console.error(err);
  });

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
          onclick="checkAnswer(this, ${q.answer}, ${i}, ${index})">
          ${opt}
        </button>`;
    });

    card.innerHTML = `
      <span class="q-no">Question ${index + 1}</span>
      <h3>${q.question}</h3>
      <div class="options">${optionsHTML}</div>
      <p class="feedback"></p>
    `;

    quizContainer.appendChild(card);
  });
}

window.checkAnswer = function (btn, correctIndex, clickedIndex, qIndex) {
  const card = btn.closest(".question-card");
  const buttons = card.querySelectorAll("button");
  const feedback = card.querySelector(".feedback");

  buttons.forEach(b => b.disabled = true);

  // Convert 1-based → 0-based
  const correct = correctIndex - 1;

  if (clickedIndex === correct) {
    btn.classList.add("correct");
    feedback.textContent = "✅ Correct";
  } else {
    btn.classList.add("wrong");
    feedback.textContent = "❌ Wrong";

    buttons[correct].classList.add("correct");
    wrongQuestions.push(allQuestions[qIndex]);
  }
};

window.retryWrong = function () {
  if (wrongQuestions.length === 0) {
    alert("No wrong questions 🎉");
    return;
  }
  render(wrongQuestions);
};
