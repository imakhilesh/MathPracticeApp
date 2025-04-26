let questions = [];
let currentQuestion = null;
let score = 0;
let timer;
let timerDuration = 15000;
let totalQuestions = 0;
let questionsAttempted = 0;
let highScore = localStorage.getItem("kaichiHighScore") || 0;

// Sound effects
const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");

// Screens
const setupScreen = document.getElementById('setupScreen');
const gameScreen = document.getElementById('gameScreen');
const endScreen = document.getElementById('endScreen');

document.getElementById("highScore").textContent = highScore;

function startGame() {
  // Validate range
  const mode = document.getElementById('mode').value;
  if (mode === "square" || mode === "mixed") {
    const start = parseInt(document.getElementById('squareStartRange').value);
    const end = parseInt(document.getElementById('squareEndRange').value);
    if (start >= end) {
      alert("Square start range must be less than end range.");
      return;
    }
  }
  if (mode === "cube" || mode === "mixed") {
    const start = parseInt(document.getElementById('cubeStartRange').value);
    const end = parseInt(document.getElementById('cubeEndRange').value);
    if (start >= end) {
      alert("Cube start range must be less than end range.");
      return;
    }
  }

  // Set timer
  const difficulty = document.getElementById('difficulty').value;
  if (difficulty === "easy") timerDuration = 15000;
  else if (difficulty === "medium") timerDuration = 10000;
  else if (difficulty === "hard") timerDuration = 5000;

  questions = [];

  if (mode === "square" || mode === "mixed") {
    const start = parseInt(document.getElementById('squareStartRange').value);
    const end = parseInt(document.getElementById('squareEndRange').value);
    for (let i = start; i <= end; i++) {
      questions.push({type: "square", number: i});
    }
  }

  if (mode === "cube" || mode === "mixed") {
    const start = parseInt(document.getElementById('cubeStartRange').value);
    const end = parseInt(document.getElementById('cubeEndRange').value);
    for (let i = start; i <= end; i++) {
      questions.push({type: "cube", number: i});
    }
  }

  shuffleArray(questions);

  totalQuestions = questions.length;
  questionsAttempted = 0;
  document.getElementById('progressCount').textContent = `0 / ${totalQuestions}`;
  document.getElementById('score').textContent = 0;
  document.getElementById('highScore').textContent = highScore;
  document.getElementById('progressBar').style.width = '0%';

  // Show game screen
  setupScreen.style.display = 'none';
  endScreen.style.display = 'none';
  gameScreen.style.display = 'block';

  score = 0;
  nextQuestion();
}

function nextQuestion() {
  clearTimeout(timer);

  if (questions.length === 0) {
    showEndScreen();
    return;
  }

  currentQuestion = questions.pop();
  questionsAttempted++;
  document.getElementById('progressCount').textContent = `${questionsAttempted} / ${totalQuestions}`;

  const progressPercent = (questionsAttempted / totalQuestions) * 100;
  document.getElementById('progressBar').style.width = progressPercent + '%';

  const symbol = currentQuestion.type === "square" ? "²" : "³";
  document.getElementById('question').textContent = `${currentQuestion.number}${symbol}`;
  document.getElementById('answerInput').value = '';
  document.getElementById('bigFeedback').textContent = '';
  document.getElementById('answerInput').style.display = 'block';
  document.getElementById('answerInput').focus();

  startTimer();
}

function submitAnswer() {
  clearTimeout(timer);

  const userAnswer = parseInt(document.getElementById('answerInput').value);
  const correctAnswer = currentQuestion.type === "square"
    ? currentQuestion.number ** 2
    : currentQuestion.number ** 3;

  if (userAnswer === correctAnswer) {
    score++;
    document.getElementById('bigFeedback').textContent = "Correct!";
    flashScreen('green');
    correctSound.play();
  } else {
    score--;
    document.getElementById('bigFeedback').textContent = `Wrong! Correct: ${correctAnswer}`;
    flashScreen('red');
    wrongSound.play();
  }

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("kaichiHighScore", highScore);
    document.getElementById('highScore').textContent = highScore;
  }

  document.getElementById('score').textContent = score;
  setTimeout(nextQuestion, 1800);
}

function startTimer() {
  let timeLeft = timerDuration;
  updateTimerBar(timeLeft);

  timer = setInterval(() => {
    timeLeft -= 100;
    updateTimerBar(timeLeft);

    if (timeLeft <= 0) {
      clearInterval(timer);
      score--;
      document.getElementById('bigFeedback').textContent = `Time's up! Correct: ${currentQuestion.type === "square" ? currentQuestion.number ** 2 : currentQuestion.number ** 3}`;
      flashScreen('red');
      wrongSound.play();
      document.getElementById('score').textContent = score;

      if (score > highScore) {
        highScore = score;
        localStorage.setItem("kaichiHighScore", highScore);
        document.getElementById('highScore').textContent = highScore;
      }

      setTimeout(nextQuestion, 1800);
    }
  }, 100);
}

function updateTimerBar(timeLeft) {
  const percent = (timeLeft / timerDuration) * 100;
  document.getElementById('timerBar').style.width = percent + '%';
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function flashScreen(color) {
  const overlay = document.getElementById('overlay');
  overlay.style.background = color === 'green' ? 'rgba(0,255,0,0.2)' : 'rgba(255,0,0,0.3)';
  setTimeout(() => {
    overlay.style.background = 'transparent';
  }, 500);
}

function backToMenu() {
  clearTimeout(timer);
  gameScreen.style.display = 'none';
  endScreen.style.display = 'none';
  setupScreen.style.display = 'block';
}

function playAgain() {
  backToMenu();
}

function toggleRangeInputs() {
  const mode = document.getElementById('mode').value;
  const squareRange = document.getElementById('squareRange');
  const cubeRange = document.getElementById('cubeRange');

  if (mode === 'mixed') {
    squareRange.style.display = 'block';
    cubeRange.style.display = 'block';
  } else if (mode === 'square') {
    squareRange.style.display = 'block';
    cubeRange.style.display = 'none';
  } else if (mode === 'cube') {
    squareRange.style.display = 'none';
    cubeRange.style.display = 'block';
  }
}

function showEndScreen() {
  clearTimeout(timer);
  gameScreen.style.display = 'none';
  endScreen.style.display = 'block';
  document.getElementById('finalScore').textContent = `${score}`;
}

document.addEventListener('keydown', function(event) {
  if (event.key === "Enter" && gameScreen.style.display === 'block') {
    submitAnswer();
  }
});

window.onload = toggleRangeInputs;
