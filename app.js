'use strict';

// game field
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = canvas.height = 375;

// game setting
const primaryColorDark = '#201f1f';
const primaryColorLight = '#fff';
const appleColor = 'red';
const tileCount = 40;
const tileBorder = 1;
const tileSize = canvas.width / tileCount - tileBorder * 2;
// canvas.width = (tileSize + tileBorder * 2 ) * tileCount
const directionDown = 1;
const directionUp = 2;
const directionRight = 3;
const directionLeft = 4;
let gameInterval, score, speed;
let best = 0;
let isGameOver = true;
let snake = {};
let apple = {};

// position of the game field
class Position {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

// snake state
class Snake {
  head = new Position(20, 20);
  length = 1;
  body = [];
  vx = 0;
  vy = 0;
  direction = 0;
}

const getPosition = function (x) {
  return x * (tileSize + tileBorder * 2) + tileBorder / 2;
};

const generateApple = function () {
  const randomPosition = () => Math.floor(Math.random() * tileCount);
  apple = new Position(randomPosition(), randomPosition());
};

const clear = function () {
  ctx.fillStyle = primaryColorDark;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

const drawApple = function () {
  ctx.fillStyle = appleColor;
  ctx.fillRect(getPosition(apple.x), getPosition(apple.y), tileSize, tileSize);
};

const drawSnake = function () {
  // store current snake body
  snake.body.push(new Position(snake.head.x, snake.head.y));
  if (snake.body.length > snake.length) snake.body.shift();

  // draw snake
  ctx.fillStyle = primaryColorLight;
  snake.body.forEach(b => {
    ctx.fillRect(getPosition(b.x), getPosition(b.y), tileSize, tileSize);
  });
};

const checkGameOver = function () {
  const isOnBoundary =
    snake.head.x === -1 ||
    snake.head.x === tileCount ||
    snake.head.y === -1 ||
    snake.head.y === tileCount;

  const isOnSnake = snake.body
    // except for head
    .slice(0, -1)
    .some(b => b.x === snake.head.x && b.y === snake.head.y);

  if (isOnBoundary || isOnSnake) {
    isGameOver = true;

    // stop game
    clearInterval(gameInterval);

    // display game over
    document.querySelector('.game-over').classList.remove('hidden');
  }
};

const checkEatApple = function () {
  if (snake.head.x === apple.x && snake.head.y === apple.y) {
    addSpeed();
    snake.length++;
    generateApple();

    // update score
    score += 50;
    document.querySelector('.score').textContent = score;

    // update best score
    if (score > best) best = score;
    document.querySelector('.best').textContent = best;
  }
};

const addSpeed = function () {
  if (snake.length % 5 === 0) {
    speed += 2.5;

    // update game speed
    clearInterval(gameInterval);
    gameInterval = setInterval(game, 1000 / speed);
  }
};

const controlSnake = function (e) {
  if (e.key === 'ArrowUp') {
    // avoid going another direction directly
    if (snake.direction === directionDown) return;
    snake.vx = 0;
    snake.vy = -1;
  }

  if (e.key === 'ArrowDown') {
    if (snake.direction === directionUp) return;
    snake.vx = 0;
    snake.vy = 1;
  }

  if (e.key === 'ArrowLeft') {
    if (snake.direction === directionRight) return;
    snake.vx = -1;
    snake.vy = 0;
  }

  if (e.key === 'ArrowRight') {
    if (snake.direction === directionLeft) return;
    snake.vx = 1;
    snake.vy = 0;
  }

  // stop game for dev purpose
  // if (e.key === 'x') {
  //   clearInterval(gameInterval);
  // }
};

const changeDirection = function () {
  if (snake.vx === 0 && snake.vy === -1) snake.direction = directionUp;
  if (snake.vx === 0 && snake.vy === 1) snake.direction = directionDown;
  if (snake.vx === -1 && snake.vy === 0) snake.direction = directionLeft;
  if (snake.vx === 1 && snake.vy === 0) snake.direction = directionRight;
};

const gameInit = function () {
  isGameOver = false;
  speed = 10;
  document.querySelector('.score').textContent = score = 0;
  snake = new Snake();
  generateApple();

  gameInterval = setInterval(game, 1000 / speed);
};

const game = function () {
  // change position
  snake.head.x += snake.vx;
  snake.head.y += snake.vy;

  clear();
  drawApple();
  checkEatApple();
  drawSnake();
  checkGameOver();
  changeDirection();
};

const startGame = function (e) {
  if (e.code === 'Space' && isGameOver) {
    document.querySelector('.game-start').classList.add('hidden');
    document.querySelector('.game-over').classList.add('hidden');
    gameInit();
  }
};

document.addEventListener('keydown', function (e) {
  controlSnake(e);
  startGame(e);
});
