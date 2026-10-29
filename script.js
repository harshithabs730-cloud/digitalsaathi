
/* DigitalSaathi: Language switch + Digital Safety Quiz */

const btnEn = document.getElementById("btn-en");
const btnKn = document.getElementById("btn-kn");

let currentLanguage = "en";
let currentQuestion = 0;
let score = 0;
let answered = false;

/* Quiz questions in English and Kannada */
const quizText = {
  en: {
    question: "Question",
    of: "of",
    points: "Points",
    next: "Next Question",
    playAgain: "Play Again",
    correct: "Correct! +10 points. ",
    incorrect: "Not quite. ",
    result: "You scored {score} out of {total} points!",
    beginner: "🌱 Digital Learner — great start! Keep practising safe digital habits.",
    explorer: "⭐ Digital Safety Explorer — good work! Keep learning.",
    champion: "🏆 Digital Safety Champion — excellent work!",

    explanations: [
      "Never share your OTP or UPI PIN, even with someone claiming to be from a bank.",
      "A suspicious link can steal personal information. Do not open it; verify through an official source.",
      "A UPI PIN is used to authorise a payment. You do not enter it to receive money.",
      "Use a strong, unique password and enable two-step verification when available.",
      "Contact your bank or payment app through its official support channel as soon as possible."
    ],

    questions: [
      {
        q: "Someone calls asking for your OTP. What should you do?",
        a: [
          "Share it if they say they are from the bank",
          "Never share it with anyone",
          "Send it by text message"
        ],
        correct: 1
      },
      {
        q: "You receive a message with a suspicious prize link. What is safest?",
        a: [
          "Click quickly to claim the prize",
          "Forward it to everyone",
          "Do not click; check with an official source"
        ],
        correct: 2
      },
      {
        q: "When should you enter your UPI PIN?",
        a: [
          "To receive money",
          "To authorise a payment you intend to make",
          "Whenever a caller asks"
        ],
        correct: 1
      },
      {
        q: "Which is a safer password habit?",
        a: [
          "Use the same simple password everywhere",
          "Share passwords with friends",
          "Use a strong, unique password for each account"
        ],
        correct: 2
      },
      {
        q: "You notice a payment you did not make. What should you do?",
        a: [
          "Ignore it",
          "Contact your bank/payment app using official support",
          "Share your PIN with the caller who offers help"
        ],
        correct: 1
      }
    ]
  },

  kn: {
    question: "ಪ್ರಶ್ನೆ",
    of: "ರಲ್ಲಿ",
    points: "ಅಂಕಗಳು",
    next: "ಮುಂದಿನ ಪ್ರಶ್ನೆ",
    playAgain: "ಮತ್ತೆ ಆಡಿ",
    correct: "ಸರಿಯಾದ ಉತ್ತರ! +10 ಅಂಕಗಳು. ",
    incorrect: "ಇದು ಸರಿಯಾದ ಉತ್ತರ ಅಲ್ಲ. ",
    result: "ನೀವು {total} ಅಂಕಗಳಲ್ಲಿ {score} ಅಂಕಗಳನ್ನು ಗಳಿಸಿದ್ದೀರಿ!",
    beginner: "🌱 ಡಿಜಿಟಲ್ ಕಲಿಯುವವರು — ಉತ್ತಮ ಆರಂಭ! ಸುರಕ್ಷಿತ ಡಿಜಿಟಲ್ ಅಭ್ಯಾಸಗಳನ್ನು ಮುಂದುವರಿಸಿ.",
    explorer: "⭐ ಡಿಜಿಟಲ್ ಸುರಕ್ಷತಾ ಅನ್ವೇಷಕರು — ಚೆನ್ನಾಗಿ ಮಾಡಿದ್ದೀರಿ!",
    champion: "🏆 ಡಿಜಿಟಲ್ ಸುರಕ್ಷತಾ ಚಾಂಪಿಯನ್ — ಅತ್ಯುತ್ತಮ ಸಾಧನೆ!",

    explanations: [
      "ಬ್ಯಾಂಕ್‌ನಿಂದ ಕರೆ ಮಾಡಿದ್ದೇವೆ ಎಂದರೂ OTP ಅಥವಾ UPI PIN ಅನ್ನು ಯಾರೊಂದಿಗೂ ಹಂಚಿಕೊಳ್ಳಬೇಡಿ.",
      "ಸಂದೇಹಾಸ್ಪದ ಲಿಂಕ್ ವೈಯಕ್ತಿಕ ಮಾಹಿತಿಯನ್ನು ಕದಿಯಬಹುದು. ಅದನ್ನು ತೆರೆಯಬೇಡಿ; ಅಧಿಕೃತ ಮೂಲದಿಂದ ಪರಿಶೀಲಿಸಿ.",
      "ನೀವು ಮಾಡಲು ಉದ್ದೇಶಿಸಿರುವ ಪಾವತಿಯನ್ನು ದೃಢೀಕರಿಸಲು UPI PIN ಬಳಸಲಾಗುತ್ತದೆ. ಹಣ ಸ್ವೀಕರಿಸಲು PIN ನಮೂದಿಸುವ ಅಗತ್ಯವಿಲ್ಲ.",
      "ಬಲವಾದ, ಪ್ರತ್ಯೇಕ ಪಾಸ್‌ವರ್ಡ್ ಬಳಸಿ ಮತ್ತು ಲಭ್ಯವಿದ್ದರೆ ಎರಡು ಹಂತದ ದೃಢೀಕರಣವನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಿ.",
      "ತಕ್ಷಣವೇ ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಅಥವಾ ಪಾವತಿ ಆ್ಯಪ್‌ನ ಅಧಿಕೃತ ಸಹಾಯವಾಣಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ."
    ],

    questions: [
      {
        q: "ಯಾರೋ ಕರೆ ಮಾಡಿ ನಿಮ್ಮ OTP ಕೇಳಿದರೆ ಏನು ಮಾಡಬೇಕು?",
        a: [
          "ಅವರು ಬ್ಯಾಂಕ್‌ನವರು ಎಂದರೆ ಹಂಚಿಕೊಳ್ಳಿ",
          "ಯಾರೊಂದಿಗೂ ಹಂಚಿಕೊಳ್ಳಬೇಡಿ",
          "ಸಂದೇಶದ ಮೂಲಕ ಕಳುಹಿಸಿ"
        ],
        correct: 1
      },
      {
        q: "ಬಹುಮಾನ ಗೆದ್ದಿದ್ದೀರಿ ಎಂದು ಸಂದೇಹಾಸ್ಪದ ಲಿಂಕ್ ಬಂದರೆ ಸುರಕ್ಷಿತ ಕ್ರಮ ಯಾವುದು?",
        a: [
          "ಬಹುಮಾನ ಪಡೆಯಲು ತಕ್ಷಣ ಕ್ಲಿಕ್ ಮಾಡಿ",
          "ಎಲ್ಲರಿಗೂ ಕಳುಹಿಸಿ",
          "ಕ್ಲಿಕ್ ಮಾಡಬೇಡಿ; ಅಧಿಕೃತ ಮೂಲದಿಂದ ಪರಿಶೀಲಿಸಿ"
        ],
        correct: 2
      },
      {
        q: "ನೀವು ಯಾವಾಗ UPI PIN ನಮೂದಿಸಬೇಕು?",
        a: [
          "ಹಣ ಸ್ವೀಕರಿಸಲು",
          "ನೀವು ಮಾಡಲು ಉದ್ದೇಶಿಸಿರುವ ಪಾವತಿಯನ್ನು ದೃಢೀಕರಿಸಲು",
          "ಕರೆ ಮಾಡುವವರು ಕೇಳಿದಾಗ"
        ],
        correct: 1
      },
      {
        q: "ಯಾವುದು ಸುರಕ್ಷಿತ ಪಾಸ್‌ವರ್ಡ್ ಅಭ್ಯಾಸ?",
        a: [
          "ಎಲ್ಲೆಡೆ ಒಂದೇ ಸರಳ ಪಾಸ್‌ವರ್ಡ್ ಬಳಸಿ",
          "ಸ್ನೇಹಿತರೊಂದಿಗೆ ಹಂಚಿಕೊಳ್ಳಿ",
          "ಪ್ರತಿ ಖಾತೆಗೆ ಬಲವಾದ, ಪ್ರತ್ಯೇಕ ಪಾಸ್‌ವರ್ಡ್ ಬಳಸಿ"
        ],
        correct: 2
      },
      {
        q: "ನೀವು ಮಾಡದ ಪಾವತಿ ಕಂಡುಬಂದರೆ ಏನು ಮಾಡಬೇಕು?",
        a: [
          "ಅದನ್ನು ನಿರ್ಲಕ್ಷಿಸಿ",
          "ಅಧಿಕೃತ ಸಹಾಯದ ಮೂಲಕ ಬ್ಯಾಂಕ್/ಪಾವತಿ ಆ್ಯಪ್ ಅನ್ನು ಸಂಪರ್ಕಿಸಿ",
          "ಸಹಾಯ ಮಾಡುವುದಾಗಿ ಹೇಳುವವರಿಗೆ PIN ನೀಡಿ"
        ],
        correct: 1
      }
    ]
  }
};

/* Get quiz elements */
const questionNumber = document.getElementById("question-number");
const scoreDisplay = document.getElementById("score-display");
const questionEl = document.getElementById("question");
const answerOptions = document.getElementById("answer-options");
const feedback = document.getElementById("quiz-feedback");
const nextButton = document.getElementById("next-question");
const resultPanel = document.getElementById("quiz-result");
const finalScore = document.getElementById("final-score");
const badgeMessage = document.getElementById("badge-message");
const progressFill = document.getElementById("progress-fill");
const restartButton = document.getElementById("restart-quiz");

/* Change page language */
function setLanguage(lang) {
  currentLanguage = lang;

  document.querySelectorAll("[data-en]").forEach(function (element) {
    const translatedText = element.getAttribute("data-" + lang);

    if (translatedText !== null) {
      element.textContent = translatedText;
    }
  });

  btnEn.classList.toggle("active", lang === "en");
  btnKn.classList.toggle("active", lang === "kn");

  document.documentElement.lang = lang;

  try {
    localStorage.setItem("saathiLang", lang);
  } catch (error) {
    // The page still works if local storage is unavailable.
  }

  renderQuestion();
}

/* Display the current question */
function renderQuestion() {
  const t = quizText[currentLanguage];
  const totalQuestions = t.questions.length;

  nextButton.textContent = t.next;
  restartButton.textContent = t.playAgain;
  scoreDisplay.textContent = `${t.points}: ${score}`;

  if (currentQuestion >= totalQuestions) {
    showResult();
    return;
  }

  questionNumber.textContent =
    `${t.question} ${currentQuestion + 1} ${t.of} ${totalQuestions}`;

  progressFill.style.width =
    `${(currentQuestion / totalQuestions) * 100}%`;

  questionEl.hidden = false;
  answerOptions.hidden = false;
  resultPanel.hidden = true;
  nextButton.hidden = false;
  nextButton.disabled = true;

  questionEl.textContent = t.questions[currentQuestion].q;
  feedback.textContent = "";
  answerOptions.replaceChildren();

  answered = false;

  t.questions[currentQuestion].a.forEach(function (answer, index) {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "answer-option";
    button.textContent = answer;

    button.addEventListener("click", function () {
      selectAnswer(index);
    });

    answerOptions.appendChild(button);
  });
}

/* Check the selected answer and award points */
function selectAnswer(selectedIndex) {
  if (answered) return;

  answered = true;

  const t = quizText[currentLanguage];
  const question = t.questions[currentQuestion];
  const buttons = answerOptions.querySelectorAll("button");

  buttons.forEach(function (button, index) {
    button.disabled = true;

    if (index === question.correct) {
      button.classList.add("correct");
    } else if (index === selectedIndex) {
      button.classList.add("incorrect");
    }
  });

  if (selectedIndex === question.correct) {
    score += 10;
    feedback.textContent =
      t.correct + t.explanations[currentQuestion];
  } else {
    feedback.textContent =
      t.incorrect + t.explanations[currentQuestion];
  }

  scoreDisplay.textContent = `${t.points}: ${score}`;
  nextButton.disabled = false;
  nextButton.focus();
}

/* Display the final score and achievement */
function showResult() {
  const t = quizText[currentLanguage];

  questionEl.hidden = true;
  answerOptions.hidden = true;
  feedback.textContent = "";
  nextButton.hidden = true;
  resultPanel.hidden = false;

  progressFill.style.width = "100%";

  finalScore.textContent = t.result
    .replace("{score}", score)
    .replace("{total}", t.questions.length * 10);

  if (score >= 40) {
    badgeMessage.textContent = t.champion;
  } else if (score >= 20) {
    badgeMessage.textContent = t.explorer;
  } else {
    badgeMessage.textContent = t.beginner;
  }
}

/* Move to the next question */
nextButton.addEventListener("click", function () {
  if (!answered) return;

  currentQuestion += 1;
  renderQuestion();
});

/* Restart the quiz */
restartButton.addEventListener("click", function () {
  currentQuestion = 0;
  score = 0;
  answered = false;

  renderQuestion();
});

/* Language button events */
btnEn.addEventListener("click", function () {
  setLanguage("en");
});

btnKn.addEventListener("click", function () {
  setLanguage("kn");
});

/* Load the saved language or default to English */
let savedLanguage = "en";

try {
  savedLanguage = localStorage.getItem("saathiLang") || "en";
} catch (error) {
  // Use English if local storage is unavailable.
}

if (savedLanguage !== "kn") {
  savedLanguage = "en";
}

setLanguage(savedLanguage);
