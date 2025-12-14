const params = new URLSearchParams(window.location.search);
const moduleKey = params.get("module"); // e.g. module1

const quizContainer = document.getElementById("quiz-container");
const quizTitle = document.getElementById("quiz-title");

let allQuestions = [];
let wrongQuestions = [];

if (!moduleKey) {
  quizContainer.innerHTML = "<p>No module selected.</p>";
  throw new Error("No module specified");
}

// 🔹 Fetch JSON (NO SPACES, SAFE FOR GITHUB)
fetch(`./${moduleKey}.json`)
  .then(res => {
    if (!res.ok) throw new Error("JSON not found");
    return res.json();
  })
  .then(data => {
    // ✅ Use module title from JSON
    quizTitle.textContent = data.module || moduleKey;
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
      <div class="result"></div>
    `;

    quizContainer.appendChild(card);
  });
}

window.checkAnswer = function (btn, correctIndex, clickedIndex, qIndex) {
  const card = btn.closest(".question-card");
  const buttons = card.querySelectorAll(".option-btn");
  const result = card.querySelector(".result");

  buttons.forEach(b => b.disabled = true);

  if (clickedIndex === correctIndex) {
    btn.classList.add("correct");
    result.innerHTML = "✅ Correct";
  } else {
    btn.classList.add("wrong");
    buttons[correctIndex].classList.add("correct");
    result.innerHTML = "❌ Wrong";
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
