// ✅ Updated JavaScript - Full Final Version

let selectedMode = "";
let questions = [];
let currentQuestion = null;
let score = 0;
let timer;
let timerDuration = 15000;
let totalQuestions = 0;
let questionsAttempted = 0;
let correctAnswers = 0;
let startTime;
let highScore = localStorage.getItem("mathPracticeHighScore") || 0;

const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");

const welcomeScreen = document.getElementById("welcomeScreen");
const setupScreen = document.getElementById("setupScreen");
const gameScreen = document.getElementById("gameScreen");
const endScreen = document.getElementById("endScreen");

const percentagePairs = [
  ["1/2", 50], ["2/3", 66.66], ["3/4", 75], ["5/6", 83.33], ["7/8", 87.5],
  ["1/3", 33.33], ["1/4", 25], ["3/2", 150], ["5/2", 250], ["7/2", 350],
  ["5/4", 125], ["7/4", 175], ["9/4", 225], ["2/5", 40], ["3/5", 60],
  ["4/5", 80], ["1/6", 16.66], ["1/7", 14.28], ["2/7", 28.56], ["3/7", 42.84],
  ["4/7", 57.13], ["5/7", 71.42], ["6/7", 85.71], ["1/8", 12.5], ["3/8", 37.5],
  ["5/8", 62.5], ["1/9", 11.11], ["1/10", 10], ["1/11", 9.09], ["1/12", 8.33],
  ["5/12", 41.66], ["7/12", 58.33], ["11/12", 91.66], ["1/13", 7.69],
  ["2/13", 15.38], ["5/13", 38.46], ["6/13", 46.14], ["7/13", 53.83],
  ["8/13", 61.52], ["10/13", 76.92], ["11/13", 84.61], ["12/13", 92.3],
  ["1/14", 7.14], ["3/14", 21.42], ["5/14", 35.71], ["7/15", 46.66],
  ["8/15", 53.33], ["11/15", 73.33], ["14/15", 93.33], ["1/16", 6.25],
  ["3/16", 18.75], ["5/16", 31.25], ["7/16", 43.75], ["9/16", 56.25],
  ["13/16", 81.25], ["15/16", 93.75], ["1/18", 5.55], ["1/19", 5.26],
  ["1/20", 5], ["1/21", 4.76], ["1/23", 4.34], ["1/24", 4.166], ["1/40", 2.5],
  ["3/40", 7.5], ["9/40", 22.5], ["11/40", 27.5], ["13/40", 32.5],
  ["19/40", 47.5], ["21/40", 52.5], ["23/40", 57.5], ["27/40", 67.5],
  ["1/50", 2], ["1/100", 1]
];

function selectMode(mode) {
  selectedMode = mode;
  welcomeScreen.style.display = 'none';
  setupScreen.style.display = 'block';

  if (['addition','subtraction','multiplication','division'].includes(mode)) {
    document.getElementById('digitRangeFields').style.display = 'block';
    document.getElementById('normalRangeFields').style.display = 'none';
  } else if (['squarecube','tables'].includes(mode)) {
    document.getElementById('digitRangeFields').style.display = 'none';
    document.getElementById('normalRangeFields').style.display = 'block';
  } else {
    document.getElementById('digitRangeFields').style.display = 'none';
    document.getElementById('normalRangeFields').style.display = 'none';
  }
}

function backToWelcome() {
  clearTimeout(timer);
  setupScreen.style.display = 'none';
  gameScreen.style.display = 'none';
  endScreen.style.display = 'none';
  welcomeScreen.style.display = 'block';
}

function backToSetup() {
  clearTimeout(timer);
  gameScreen.style.display = 'none';
  setupScreen.style.display = 'block';
}

function startGame() {
  const count = parseInt(document.getElementById('questionCount').value);
  totalQuestions = count;
  score = 0;
  questionsAttempted = 0;
  correctAnswers = 0;
  startTime = new Date();
  document.getElementById('score').textContent = 0;
  document.getElementById('highScore').textContent = highScore;

  const difficulty = document.getElementById('difficulty').value;
  if (difficulty === 'noob') timerDuration = 300000;
  else if (difficulty === 'beginner') timerDuration = 120000;
  else if (difficulty === 'pro') timerDuration = 60000;
  else if (difficulty === 'advanced') timerDuration = 30000;
  else if (difficulty === 'god') timerDuration = 10000;

  if (selectedMode === 'percentage') {
    questions = percentagePairs.sort(() => 0.5 - Math.random()).slice(0, count).map(p => {
      return { text: `What is ${p[0]} as a %?`, answer: p[1] };
    });
  } else {
    questions = [];
    for (let i = 0; i < count; i++) {
      let a, b, question, answer;
      if (['addition','subtraction','multiplication','division'].includes(selectedMode)) {
        const digitsA = parseInt(document.getElementById('digitsA').value);
        const digitsB = parseInt(document.getElementById('digitsB').value);
        a = randomDigits(digitsA);
        b = randomDigits(digitsB);
      } else {
        const start = parseInt(document.getElementById('startRange').value);
        const end = parseInt(document.getElementById('endRange').value);
        a = randomBetween(start, end);
        b = randomBetween(start, end);
      }
      if (selectedMode === 'addition') {
        question = `${a} + ${b}`; answer = a + b;
      } else if (selectedMode === 'subtraction') {
        question = `${a} - ${b}`; answer = a - b;
      } else if (selectedMode === 'multiplication') {
        question = `${a} × ${b}`; answer = a * b;
      } else if (selectedMode === 'division') {
        let product = a * b;
        question = `${product} ÷ ${a}`; answer = b;
      } else if (selectedMode === 'squarecube') {
        if (Math.random() < 0.5) {
          question = `${a}²`; answer = a ** 2;
        } else {
          question = `${a}³`; answer = a ** 3;
        }
      } else if (selectedMode === 'tables') {
        question = `${a} × ${b}`; answer = a * b;
      } else if (selectedMode === 'mixed') {
        const modes = ['addition','subtraction','multiplication','division','squarecube'];
        selectedMode = modes[Math.floor(Math.random() * modes.length)];
        i--; continue;
      }
      questions.push({ text: question, answer });
    }
  }

  setupScreen.style.display = 'none';
  gameScreen.style.display = 'block';
  nextQuestion();
}

function nextQuestion() {
  clearTimeout(timer);
  if (questions.length === 0) return showEndScreen();

  currentQuestion = questions.pop();
  questionsAttempted++;
  document.getElementById('progressCount').textContent = `${questionsAttempted} / ${totalQuestions}`;
  document.getElementById('progressBar').style.width = (questionsAttempted / totalQuestions * 100) + '%';
  document.getElementById('question').textContent = currentQuestion.text;
  document.getElementById('answerInput').value = '';
  document.getElementById('bigFeedback').textContent = '';
  document.getElementById('answerInput').focus();
  startTimer();
}

function submitAnswer() {
  clearTimeout(timer);

  const userAnswer = parseFloat(document.getElementById('answerInput').value);
  const expected = parseFloat(currentQuestion.answer);

  if (Math.abs(userAnswer - expected) < 0.01) {
    score++;
    correctAnswers++;
    document.getElementById('bigFeedback').textContent = "Correct!";
    flashScreen('green');
    correctSound.play();
  } else {
    score--;
    document.getElementById('bigFeedback').textContent = `Wrong! Ans: ${expected}`;
    flashScreen('red');
    wrongSound.play();
  }

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("mathPracticeHighScore", highScore);
    document.getElementById("highScore").textContent = highScore;
  }

  document.getElementById('score').textContent = score;
  setTimeout(nextQuestion, 1500);
}

function startTimer() {
  let left = timerDuration;
  updateTimerBar(left);
  timer = setInterval(() => {
    left -= 100;
    updateTimerBar(left);
    if (left <= 0) {
      clearInterval(timer);
      score--;
      document.getElementById('bigFeedback').textContent = `Time's up! Ans: ${currentQuestion.answer}`;
      flashScreen('red');
      wrongSound.play();
      document.getElementById('score').textContent = score;
      setTimeout(nextQuestion, 1500);
    }
  }, 100);
}

function updateTimerBar(ms) {
  const pct = (ms / timerDuration) * 100;
  document.getElementById('timerBar').style.width = pct + '%';
}

function showEndScreen() {
  gameScreen.style.display = 'none';
  endScreen.style.display = 'block';
  document.getElementById('finalScore').textContent = score;
  const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
  document.getElementById('accuracy').textContent = accuracy;
  const totalSec = (new Date() - startTime) / 1000;
  document.getElementById('avgTime').textContent = (totalSec / totalQuestions).toFixed(1);
}

function playAgain() { backToWelcome(); }
function randomBetween(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randomDigits(digits) { const min = 10 ** (digits - 1); const max = 10 ** digits - 1; return randomBetween(min, max); }
function flashScreen(color) {
  const overlay = document.getElementById('overlay');
  overlay.style.background = color === 'green' ? 'rgba(0,255,0,0.2)' : 'rgba(255,0,0,0.3)';
  setTimeout(() => overlay.style.background = 'transparent', 500);
}

document.addEventListener('keydown', e => {
  if (e.key === "Enter" && gameScreen.style.display === 'block') submitAnswer();
});
