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

// Header title
quizTitle.textContent = moduleName.replace("module", "Module ");

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

function render(questions) {
  quizContainer.innerHTML = "";
  wrongQuestions = [];

  questions.forEach((q, qIndex) => {
    const card = document.createElement("div");
    card.className = "question-card";

    let optionsHTML = "";

    q.options.forEach((opt, optIndex) => {
      optionsHTML += `
        <button class="option-btn"
          onclick="checkAnswer(this, ${optIndex}, ${q.answer}, ${qIndex})">
          ${opt}
        </button>
      `;
    });

    card.innerHTML = `
      <span class="q-no">Question ${qIndex + 1}</span>
      <h3>${q.question}</h3>
      <div class="options">${optionsHTML}</div>
    `;

    quizContainer.appendChild(card);
  });
}

window.checkAnswer = function (btn, selectedIndex, correctIndex, qIndex) {
  const buttons = btn.parentElement.querySelectorAll("button");

  buttons.forEach(b => b.disabled = true);

  if (selectedIndex === correctIndex) {
    btn.classList.add("correct");
  } else {
    btn.classList.add("wrong");
    wrongQuestions.push(allQuestions[qIndex]);

    buttons[correctIndex].classList.add("correct");
  }
};

window.retryWrong = function () {
  if (wrongQuestions.length === 0) {
    alert("No wrong questions 🎉");
    return;
  }
  render(wrongQuestions);
};
