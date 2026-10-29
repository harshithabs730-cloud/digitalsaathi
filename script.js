
/* DigitalSaathi: Bilingual Digital Safety Quiz */

const btnEn = document.getElementById("btn-en");
const btnKn = document.getElementById("btn-kn");

const questionNumber = document.getElementById("question-number");
const scoreDisplay = document.getElementById("score-display");
const bestScoreDisplay = document.getElementById("best-score-display");
const questionEl = document.getElementById("question");
const answerOptions = document.getElementById("answer-options");
const feedback = document.getElementById("quiz-feedback");
const nextButton = document.getElementById("next-question");
const resultPanel = document.getElementById("quiz-result");
const finalScore = document.getElementById("final-score");
const resultPercentage = document.getElementById("result-percentage");
const achievementBadge = document.getElementById("achievement-badge");
const badgeMessage = document.getElementById("badge-message");
const progressFill = document.getElementById("progress-fill");
const progressBar = document.getElementById("quiz-progress-bar");
const restartButton = document.getElementById("restart-quiz");

let currentLanguage = "en";
let currentQuestion = 0;
let score = 0;
let answered = false;

const TOTAL_POINTS = 100;
const POINTS_PER_QUESTION = 10;
const BEST_SCORE_KEY = "saathiBestScore";
const LANGUAGE_KEY = "saathiLang";

/* Safe localStorage helpers */
function getSavedValue(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : value;
  } catch (error) {
    return fallback;
  }
}

function saveValue(key, value) {
  try {
    localStorage.setItem(key, String(value));
  } catch (error) {
    // The quiz still works when storage is unavailable.
  }
}

function getBestScore() {
  const saved = Number(getSavedValue(BEST_SCORE_KEY, 0));

  if (!Number.isFinite(saved)) return 0;

  return Math.max(0, Math.min(TOTAL_POINTS, saved));
}

/* English and Kannada quiz content */
const quizText = {
  en: {
    question: "Question",
    of: "of",
    points: "Points",
    best: "Best",
    next: "Next Question",
    playAgain: "Play Again",
    correct: "Correct! +10 points. ",
    incorrect: "Not quite. ",
    result: "You scored {score} out of {total} points!",
    percentage: "Your result: {percentage}%",
    beginner: "Digital Beginner",
    beginnerMessage:
      "🌱 Great start! Keep practising safe digital habits.",
    explorer: "Safety Explorer",
    explorerMessage:
      "⭐ Good work! Keep learning and stay alert online.",
    champion: "Cyber Champion",
    championMessage:
      "🏆 Excellent work! You are building strong digital safety skills.",
    progressLabel: "Quiz progress",

    explanations: [
      "Never share your OTP or UPI PIN, even with someone claiming to be from a bank.",
      "Suspicious links may steal personal information. Do not click; verify through an official source.",
      "A UPI PIN authorises a payment you make. You do not need to enter it to receive money.",
      "Use a strong, unique password for every account and enable two-step verification when available.",
      "Contact your bank or payment app through its official support channel immediately.",
      "Check the sender and website carefully before opening an attachment or link.",
      "Never share private information or your live location publicly without a good reason.",
      "Use your device's official settings to install updates and fix security issues.",
      "Block and report suspicious or harassing accounts, and tell a trusted adult if you need help.",
      "Use official websites or trusted app stores instead of unfamiliar download links."
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
      },
      {
        q: "You receive an unexpected email attachment. What should you do?",
        a: [
          "Open it immediately",
          "Check the sender and verify it before opening",
          "Forward it to your contacts"
        ],
        correct: 1
      },
      {
        q: "Which is a safer way to use social media?",
        a: [
          "Post passwords in a private group",
          "Accept every unknown friend request",
          "Limit personal information and review privacy settings"
        ],
        correct: 2
      },
      {
        q: "Why should you update your phone and apps?",
        a: [
          "Updates can fix security weaknesses",
          "Updates make passwords unnecessary",
          "Updates let you share your OTP safely"
        ],
        correct: 0
      },
      {
        q: "Someone is harassing you online. What is a safe response?",
        a: [
          "Share more personal details with them",
          "Save evidence, block/report them, and seek trusted help",
          "Send them your account password"
        ],
        correct: 1
      },
      {
        q: "Where should you download apps from?",
        a: [
          "Any link sent by a stranger",
          "Unfamiliar websites offering free prizes",
          "Official app stores or trusted sources"
        ],
        correct: 2
      }
    ]
  },

  kn: {
    question: "ಪ್ರಶ್ನೆ",
    of: "ರಲ್ಲಿ",
    points: "ಅಂಕಗಳು",
    best: "ಅತ್ಯುತ್ತಮ",
    next: "ಮುಂದಿನ ಪ್ರಶ್ನೆ",
    playAgain: "ಮತ್ತೆ ಆಡಿ",
    correct: "ಸರಿಯಾದ ಉತ್ತರ! +10 ಅಂಕಗಳು. ",
    incorrect: "ಸರಿಯಾದ ಉತ್ತರ ಅಲ್ಲ. ",
    result: "ಒಟ್ಟು {total} ಅಂಕಗಳಲ್ಲಿ ನೀವು {score} ಅಂಕಗಳನ್ನು ಗಳಿಸಿದ್ದೀರಿ!",
    percentage: "ನಿಮ್ಮ ಫಲಿತಾಂಶ: {percentage}%",
    beginner: "ಡಿಜಿಟಲ್ ಕಲಿಕಾರ್ಥಿ",
    beginnerMessage:
      "🌱 ಉತ್ತಮ ಆರಂಭ! ಸುರಕ್ಷಿತ ಡಿಜಿಟಲ್ ಅಭ್ಯಾಸಗಳನ್ನು ಮುಂದುವರಿಸಿ.",
    explorer: "ಸುರಕ್ಷತಾ ಅನ್ವೇಷಕ",
    explorerMessage:
      "⭐ ಚೆನ್ನಾಗಿದೆ! ಕಲಿಯುತ್ತಿರಿ ಮತ್ತು ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಜಾಗರೂಕರಾಗಿರಿ.",
    champion: "ಸೈಬರ್ ಚಾಂಪಿಯನ್",
    championMessage:
      "🏆 ಅತ್ಯುತ್ತಮ ಸಾಧನೆ! ನಿಮ್ಮ ಡಿಜಿಟಲ್ ಸುರಕ್ಷತಾ ಕೌಶಲಗಳು ಉತ್ತಮವಾಗುತ್ತಿವೆ.",
    progressLabel: "ಪ್ರಶ್ನೋತ್ತರ ಪ್ರಗತಿ",

    explanations: [
      "ಬ್ಯಾಂಕ್‌ನಿಂದ ಕರೆ ಮಾಡಿದ್ದೇವೆ ಎಂದರೂ OTP ಅಥವಾ UPI PIN ಅನ್ನು ಯಾರೊಂದಿಗೂ ಹಂಚಿಕೊಳ್ಳಬೇಡಿ.",
      "ಸಂದೇಹಾಸ್ಪದ ಲಿಂಕ್ ವೈಯಕ್ತಿಕ ಮಾಹಿತಿಯನ್ನು ಕದಿಯಬಹುದು. ಕ್ಲಿಕ್ ಮಾಡದೆ ಅಧಿಕೃತ ಮೂಲದಿಂದ ಪರಿಶೀಲಿಸಿ.",
      "ನೀವು ಮಾಡುವ ಪಾವತಿಯನ್ನು ದೃಢೀಕರಿಸಲು UPI PIN ಬಳಸಲಾಗುತ್ತದೆ. ಹಣ ಸ್ವೀಕರಿಸಲು ಅದನ್ನು ನಮೂದಿಸುವ ಅಗತ್ಯವಿಲ್ಲ.",
      "ಪ್ರತಿ ಖಾತೆಗೆ ಬಲವಾದ, ಪ್ರತ್ಯೇಕ ಪಾಸ್‌ವರ್ಡ್ ಬಳಸಿ. ಸಾಧ್ಯವಾದರೆ ಎರಡು ಹಂತದ ದೃಢೀಕರಣವನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಿ.",
      "ತಕ್ಷಣವೇ ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಅಥವಾ ಪಾವತಿ ಆ್ಯಪ್‌ನ ಅಧಿಕೃತ ಸಹಾಯವಾಣಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ.",
      "ಲಗತ್ತನ್ನು ಅಥವಾ ಲಿಂಕ್ ತೆರೆಯುವ ಮೊದಲು ಕಳುಹಿಸಿದವರ ವಿವರಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.",
      "ಅಗತ್ಯವಿಲ್ಲದೆ ವೈಯಕ್ತಿಕ ಮಾಹಿತಿ ಅಥವಾ ನಿಮ್ಮ ನೇರ ಸ್ಥಳವನ್ನು ಸಾರ್ವಜನಿಕವಾಗಿ ಹಂಚಿಕೊಳ್ಳಬೇಡಿ.",
      "ಭದ್ರತಾ ಸಮಸ್ಯೆಗಳನ್ನು ಸರಿಪಡಿಸಲು ಅಧಿಕೃತ ಸೆಟ್ಟಿಂಗ್‌ಗಳ ಮೂಲಕ ಸಾಧನ ಮತ್ತು ಆ್ಯಪ್‌ಗಳನ್ನು ನವೀಕರಿಸಿ.",
      "ಸಂದೇಹಾಸ್ಪದ ಅಥವಾ ಕಿರುಕುಳ ನೀಡುವ ಖಾತೆಗಳನ್ನು ನಿರ್ಬಂಧಿಸಿ ಮತ್ತು ವರದಿ ಮಾಡಿ. ಅಗತ್ಯವಿದ್ದರೆ ವಿಶ್ವಾಸಾರ್ಹ ವಯಸ್ಕರ ಸಹಾಯ ಪಡೆಯಿರಿ.",
      "ಅಪರಿಚಿತ ಡೌನ್‌ಲೋಡ್ ಲಿಂಕ್‌ಗಳ ಬದಲು ಅಧಿಕೃತ ವೆಬ್‌ಸೈಟ್‌ಗಳು ಅಥವಾ ವಿಶ್ವಾಸಾರ್ಹ ಆ್ಯಪ್ ಸ್ಟೋರ್‌ಗಳನ್ನು ಬಳಸಿ."
    ],

    questions: [
      {
        q: "ಯಾರಾದರೂ ಕರೆ ಮಾಡಿ ನಿಮ್ಮ OTP ಕೇಳಿದರೆ ಏನು ಮಾಡಬೇಕು?",
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
          "ಕ್ಲಿಕ್ ಮಾಡದೆ ಅಧಿಕೃತ ಮೂಲದಿಂದ ಪರಿಶೀಲಿಸಿ"
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
          "ಸ್ನೇಹಿತರೊಂದಿಗೆ ಪಾಸ್‌ವರ್ಡ್ ಹಂಚಿಕೊಳ್ಳಿ",
          "ಪ್ರತಿ ಖಾತೆಗೆ ಬಲವಾದ, ಪ್ರತ್ಯೇಕ ಪಾಸ್‌ವರ್ಡ್ ಬಳಸಿ"
        ],
        correct: 2
      },
      {
        q: "ನೀವು ಮಾಡದ ಪಾವತಿ ಕಂಡುಬಂದರೆ ಏನು ಮಾಡಬೇಕು?",
        a: [
          "ಅದನ್ನು ನಿರ್ಲಕ್ಷಿಸಿ",
          "ಅಧಿಕೃತ ಸಹಾಯದ ಮೂಲಕ ಬ್ಯಾಂಕ್/ಪಾವತಿ ಆ್ಯಪ್ ಸಂಪರ್ಕಿಸಿ",
          "ಸಹಾಯ ಮಾಡುವುದಾಗಿ ಹೇಳುವವರಿಗೆ PIN ನೀಡಿ"
        ],
        correct: 1
      },
      {
        q: "ಅನಿರೀಕ್ಷಿತ ಇಮೇಲ್ ಲಗತ್ತು ಬಂದರೆ ಏನು ಮಾಡಬೇಕು?",
        a: [
          "ತಕ್ಷಣ ತೆರೆಯಿರಿ",
          "ತೆರೆಯುವ ಮೊದಲು ಕಳುಹಿಸಿದವರನ್ನು ಪರಿಶೀಲಿಸಿ",
          "ನಿಮ್ಮ ಸಂಪರ್ಕಗಳಿಗೆ ಕಳುಹಿಸಿ"
        ],
        correct: 1
      },
      {
        q: "ಸಾಮಾಜಿಕ ಜಾಲತಾಣವನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ಬಳಸುವುದು ಹೇಗೆ?",
        a: [
          "ಖಾಸಗಿ ಗುಂಪಿನಲ್ಲಿ ಪಾಸ್‌ವರ್ಡ್ ಹಂಚಿಕೊಳ್ಳಿ",
          "ಎಲ್ಲ ಅಪರಿಚಿತರ ಸ್ನೇಹ ವಿನಂತಿ ಸ್ವೀಕರಿಸಿ",
          "ವೈಯಕ್ತಿಕ ಮಾಹಿತಿಯನ್ನು ಮಿತಿಗೊಳಿಸಿ, ಗೌಪ್ಯತಾ ಸೆಟ್ಟಿಂಗ್ ಪರಿಶೀಲಿಸಿ"
        ],
        correct: 2
      },
      {
        q: "ನಿಮ್ಮ ಫೋನ್ ಮತ್ತು ಆ್ಯಪ್‌ಗಳನ್ನು ಏಕೆ ನವೀಕರಿಸಬೇಕು?",
        a: [
          "ನವೀಕರಣಗಳು ಭದ್ರತಾ ದೋಷಗಳನ್ನು ಸರಿಪಡಿಸಬಹುದು",
          "ನವೀಕರಣಗಳ ನಂತರ ಪಾಸ್‌ವರ್ಡ್ ಅಗತ್ಯವಿಲ್ಲ",
          "ನವೀಕರಣಗಳಿಂದ OTP ಹಂಚಿಕೊಳ್ಳಬಹುದು"
        ],
        correct: 0
      },
      {
        q: "ಯಾರಾದರೂ ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಕಿರುಕುಳ ನೀಡಿದರೆ ಸುರಕ್ಷಿತ ಕ್ರಮ ಯಾವುದು?",
        a: [
          "ಇನ್ನಷ್ಟು ವೈಯಕ್ತಿಕ ಮಾಹಿತಿ ಹಂಚಿಕೊಳ್ಳಿ",
          "ಸಾಕ್ಷ್ಯ ಉಳಿಸಿ, ನಿರ್ಬಂಧಿಸಿ/ವರದಿ ಮಾಡಿ, ವಿಶ್ವಾಸಾರ್ಹ ಸಹಾಯ ಪಡೆಯಿರಿ",
          "ನಿಮ್ಮ ಖಾತೆಯ ಪಾಸ್‌ವರ್ಡ್ ನೀಡಿ"
        ],
        correct: 1
      },
      {
        q: "ಆ್ಯಪ್‌ಗಳನ್ನು ಎಲ್ಲಿಂದ ಡೌನ್‌ಲೋಡ್ ಮಾಡಬೇಕು?",
        a: [
          "ಅಪರಿಚಿತರು ಕಳುಹಿಸಿದ ಯಾವುದೇ ಲಿಂಕ್‌ನಿಂದ",
          "ಉಚಿತ ಬಹುಮಾನ ನೀಡುವ ಅಪರಿಚಿತ ವೆಬ್‌ಸೈಟ್‌ಗಳಿಂದ",
          "ಅಧಿಕೃತ ಆ್ಯಪ್ ಸ್ಟೋರ್‌ಗಳು ಅಥವಾ ವಿಶ್ವಾಸಾರ್ಹ ಮೂಲಗಳಿಂದ"
        ],
        correct: 2
      }
    ]
  }
};

/* Change the page language */
function setLanguage(lang) {
  if (!quizText[lang]) return;

  currentLanguage = lang;

  document.querySelectorAll("[data-en]").forEach(function (element) {
    const translatedText = element.getAttribute("data-" + lang);

    if (translatedText !== null) {
      element.textContent = translatedText;
    }
  });

  btnEn.classList.toggle("active", lang === "en");
  btnKn.classList.toggle("active", lang === "kn");

  btnEn.setAttribute("aria-pressed", String(lang === "en"));
  btnKn.setAttribute("aria-pressed", String(lang === "kn"));

  document.documentElement.lang = lang;
  saveValue(LANGUAGE_KEY, lang);

  renderQuestion();
}

/* Update score labels */
function updateScoreDisplays() {
  const t = quizText[currentLanguage];

  scoreDisplay.textContent = `${t.points}: ${score}`;

  if (bestScoreDisplay) {
    bestScoreDisplay.textContent =
      `${t.best}: ${getBestScore()} / ${TOTAL_POINTS}`;
  }
}

/* Update accessible progress information */
function updateProgress(percent, completedQuestions) {
  progressFill.style.width = `${percent}%`;

  if (progressBar) {
    progressBar.setAttribute("aria-valuenow", String(completedQuestions));
    progressBar.setAttribute(
      "aria-label",
      quizText[currentLanguage].progressLabel
    );
  }
}

/* Render the current question */
function renderQuestion() {
  const t = quizText[currentLanguage];
  const totalQuestions = t.questions.length;

  nextButton.textContent = t.next;
  restartButton.textContent = t.playAgain;

  updateScoreDisplays();

  if (currentQuestion >= totalQuestions) {
    showResult();
    return;
  }

  questionNumber.textContent =
    `${t.question} ${currentQuestion + 1} ${t.of} ${totalQuestions}`;

  updateProgress(
    (currentQuestion / totalQuestions) * 100,
    currentQuestion
  );

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
    button.setAttribute("aria-pressed", "false");

    button.addEventListener("click", function () {
      selectAnswer(index);
    });

    answerOptions.appendChild(button);
  });
}

/* Check the selected answer */
function selectAnswer(selectedIndex) {
  if (answered) return;

  answered = true;

  const t = quizText[currentLanguage];
  const question = t.questions[currentQuestion];
  const buttons = answerOptions.querySelectorAll("button");

  buttons.forEach(function (button, index) {
    button.disabled = true;
    button.setAttribute(
      "aria-pressed",
      String(index === selectedIndex)
    );

    if (index === question.correct) {
      button.classList.add("correct");
    } else if (index === selectedIndex) {
      button.classList.add("incorrect");
    }
  });

  if (selectedIndex === question.correct) {
    score += POINTS_PER_QUESTION;
    feedback.textContent =
      t.correct + t.explanations[currentQuestion];
  } else {
    feedback.textContent =
      t.incorrect + t.explanations[currentQuestion];
  }

  updateScoreDisplays();

  // Save a new best score immediately.
  if (score > getBestScore()) {
    saveValue(BEST_SCORE_KEY, score);
    updateScoreDisplays();
  }

  nextButton.disabled = false;
  nextButton.focus();
}

/* Show final score, percentage, and achievement */
function showResult() {
  const t = quizText[currentLanguage];
  const percentage = Math.round((score / TOTAL_POINTS) * 100);

  questionEl.hidden = true;
  answerOptions.hidden = true;
  feedback.textContent = "";
  nextButton.hidden = true;
  resultPanel.hidden = false;

  questionNumber.textContent =
    `${t.question} ${t.questions.length} ${t.of} ${t.questions.length}`;

  updateProgress(100, t.questions.length);
  updateScoreDisplays();

  finalScore.textContent = t.result
    .replace("{score}", score)
    .replace("{total}", TOTAL_POINTS);

  if (resultPercentage) {
    resultPercentage.textContent = t.percentage.replace(
      "{percentage}",
      percentage
    );
  }

  let badgeTitle;
  let badgeDescription;

  if (score >= 80) {
    badgeTitle = t.champion;
    badgeDescription = t.championMessage;
  } else if (score >= 40) {
    badgeTitle = t.explorer;
    badgeDescription = t.explorerMessage;
  } else {
    badgeTitle = t.beginner;
    badgeDescription = t.beginnerMessage;
  }

  if (achievementBadge) {
    achievementBadge.textContent = badgeTitle;
  }

  badgeMessage.textContent = badgeDescription;
}

/* Go to the next question */
nextButton.addEventListener("click", function () {
  if (!answered) return;

  currentQuestion += 1;
  renderQuestion();
});

/* Restart without clearing the saved best score */
restartButton.addEventListener("click", function () {
  currentQuestion = 0;
  score = 0;
  answered = false;

  renderQuestion();

  questionEl.focus?.();
});

/* Language button events */
btnEn.addEventListener("click", function () {
  setLanguage("en");
});

btnKn.addEventListener("click", function () {
  setLanguage("kn");
});

/* Restore the saved language */
const savedLanguage = getSavedValue(LANGUAGE_KEY, "en");
setLanguage(savedLanguage === "kn" ? "kn" : "en");
