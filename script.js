const startButton = document.querySelector("#startButton");
const statusText = document.querySelector("#statusText");
const answerInput = document.querySelector("#answerInput");
const submitAnswerButton = document.querySelector("#submitAnswerButton");
const plantImage = document.querySelector("#plantImage");

// 植物题库
const questions = [
  {
    image: "images/0001-rose.jpg",
    answer: "玫瑰"
  },
  {
    image: "images/0002-magnolia.jpg",
    answer: "望春玉兰"
  },
  {
    image: "images/0003-sunflower.jpg",
    answer: "向日葵"
  },
  {
    image: "images/0004-peony.jpg",
    answer: "牡丹"
  }
];
// 当前题目
let currentQuestion = null;

// 当前得分
let score = 0;

// 已处理题目数量：答过或跳过都算
let answeredCount = 0;

// 剩余题目索引池
let remainingQuestionIndexes = [];

// 游戏是否结束
let isGameEnded = false;

// 初始状态
answerInput.disabled = true;
submitAnswerButton.disabled = true;
statusText.textContent = "当前状态：点击“开始游戏”后开始识别植物。";

resetQuestionPool();
updateScoreBoard();

startButton.addEventListener("click", () => {
  // 如果游戏结束，点击按钮重新开始
  if (isGameEnded) {
    resetGame();
    loadRandomQuestion();
    return;
  }

  // 如果当前有一题还没提交答案，点击“换一题”视为跳过
  if (currentQuestion !== null) {
    skipCurrentQuestion();

    // 如果跳过的是最后一题，直接结束游戏
    if (answeredCount >= questions.length) {
      endGame();
      return;
    }
  }

  loadRandomQuestion();
});

submitAnswerButton.addEventListener("click", () => {
  checkAnswer();
});

answerInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    checkAnswer();
  }
});

function resetQuestionPool() {
  remainingQuestionIndexes = questions.map((question, index) => index);
}

function resetGame() {
  score = 0;
  answeredCount = 0;
  currentQuestion = null;
  isGameEnded = false;

  resetQuestionPool();
  updateScoreBoard();

  answerInput.value = "";
  answerInput.disabled = true;
  submitAnswerButton.disabled = true;
  answerInput.classList.remove("correct", "wrong");

  statusText.textContent = "当前状态：新一轮游戏开始。";
  startButton.textContent = "开始游戏";
}

function loadRandomQuestion() {
  if (remainingQuestionIndexes.length === 0) {
    endGame();
    return;
  }

  const randomPoolIndex = Math.floor(Math.random() * remainingQuestionIndexes.length);
  const questionIndex = remainingQuestionIndexes[randomPoolIndex];

  // 从剩余题目池中删除已经抽到的题目
  remainingQuestionIndexes.splice(randomPoolIndex, 1);

  currentQuestion = questions[questionIndex];

  plantImage.src = currentQuestion.image;
  plantImage.alt = "请识别这张植物图片";

  answerInput.value = "";
  answerInput.disabled = false;
  submitAnswerButton.disabled = false;

  answerInput.classList.remove("correct", "wrong");
  answerInput.focus();

  statusText.textContent = "当前状态：请观察图片，并输入植物物种名称。";
  startButton.textContent = "换一题";
}

function checkAnswer() {
  if (currentQuestion === null) {
    statusText.textContent = "请先点击“开始游戏”。";
    return;
  }

  const userAnswer = answerInput.value.trim();
  const correctAnswer = currentQuestion.answer;

  if (userAnswer === "") {
    statusText.textContent = "请先输入答案，或点击“换一题”跳过。";
    return;
  }

  if (userAnswer === correctAnswer) {
    score = score + 1;
    statusText.textContent = `回答正确：这张图片中的植物是 ${correctAnswer}。`;
    answerInput.classList.add("correct");
    answerInput.classList.remove("wrong");
  } else {
    statusText.textContent = `回答错误：你的答案是 ${userAnswer}，正确答案是 ${correctAnswer}。`;
    answerInput.classList.add("wrong");
    answerInput.classList.remove("correct");
  }

  answeredCount = answeredCount + 1;
  updateScoreBoard();

  answerInput.disabled = true;
  submitAnswerButton.disabled = true;
  currentQuestion = null;

  if (answeredCount >= questions.length) {
    endGame();
  }
}

function skipCurrentQuestion() {
  const correctAnswer = currentQuestion.answer;

  answeredCount = answeredCount + 1;
  updateScoreBoard();

  statusText.textContent = `已跳过：上一题的正确答案是 ${correctAnswer}。`;

  answerInput.value = "";
  answerInput.disabled = true;
  submitAnswerButton.disabled = true;
  answerInput.classList.remove("correct", "wrong");

  currentQuestion = null;
}

function updateScoreBoard() {
  scoreText.textContent = `当前得分：${score}`;
  progressText.textContent = `答题进度：${answeredCount} / ${questions.length}`;
}

function endGame() {
  isGameEnded = true;
  currentQuestion = null;

  answerInput.disabled = true;
  submitAnswerButton.disabled = true;

  statusText.textContent = `本轮游戏结束：你的最终得分是 ${score} / ${questions.length}。`;
  startButton.textContent = "重新开始";
}