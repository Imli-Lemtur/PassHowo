/*************************
 * PASSHOWO – QUIZ LOGIC
 *************************/

// 👉 TEMP SAMPLE QUESTIONS
// Later you will replace this with your JSON data
const allQuestions = [
  {
    question: "Which of the following is considered the brain of the computer?",
    options: ["CPU", "RAM", "Hard Disk", "Motherboard"],
    answer: "CPU"
  },
  {
    question: "Which memory is volatile?",
    options: ["ROM", "RAM", "Hard Disk", "Cache"],
    answer: "RAM"
  },
  {
    question: "What does CPU stand for?",
    options: [
      "Central Processing Unit",
      "Computer Power Unit",
      "Control Program Unit",
      "Central Performance Utility"
    ],
    answer: "Central Processing Unit"
  }
];

// ===== STATE =====
let wrongQuestions = [];
let score = 0;

// ===== DOM =====
const quizContainer = document.getElementById("quizContainer");
const resultBar = document.getElementById("resultBar");
const retryBtn = document.getElementById("retryBtn");
const moduleTitle = document.getElementById("moduleTitle");

// ===== MODULE NAME FROM URL =====
const params = new URLSearchParams(window.location.search);
const moduleName = params.get("module") || "Module Quiz";
moduleTitle.textContent = moduleName;

// ===== RENDER QUIZ =====
function renderQuiz(questions) {
  quizContainer.innerHTML = "";
  resultBar.textContent = "";
  retryBtn.style.display = "none";
  score = 0;
  wrongQuestions = [];

  questions.forEach((q, index) => {
    const card =