'use strict';

const WALL = 'WALL';
const FLOOR = 'FLOOR';
const BALL = 'BALL';
const GAMER = 'GAMER';
const GLUE = 'GLUE';

const GLUE_IMG = '<img src="img/drop.png">';
const GAMER_IMG = '<img src="img/gamer.png">';
const BALL_IMG = '<img src="img/ball.png">';

let gIsStuck = false;

let gGlueInterval = null;
let gBallInterval = null;

let gCollectedBalls = 0;
let gLeftBalls = 2;

// Model:
var gBoard;
var gGamerPos;

function onStartGame() {
  onInitGame();
}

function stopGame() {
  clearInterval(gGlueInterval);
  clearInterval(gBallInterval);
}

function onInitGame() {
  gGamerPos = { i: 2, j: 9 };
  gBoard = buildBoard();
  renderBoard(gBoard);

  gCollectedBalls = 0;
  gLeftBalls = 2;
  updateBallCounter();

  createBall();
  createGlue();
}

function buildBoard() {
  const board = [];
  // DONE: Create the Matrix 10 * 12
  // DONE: Put FLOOR everywhere and WALL at edges
  for (var i = 0; i < 10; i++) {
    board[i] = [];
    for (var j = 0; j < 12; j++) {
      // floor
      board[i][j] = { type: FLOOR, gameElement: null };

      // wall
      if (i === 0 || i === 9 || j === 0 || j === 11) {
        board[i][j].type = WALL;
      }
    }
  }
  // DONE: Place the gamer and two balls
  board[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
  board[5][5].gameElement = BALL;
  board[7][2].gameElement = BALL;

  // passages
  board[0][6].type = FLOOR;
  board[5][0].type = FLOOR;
  board[5][11].type = FLOOR;
  board[9][6].type = FLOOR;

  console.log(board);
  return board;
}

// Render the board to an HTML table
function renderBoard(board) {
  const elBoard = document.querySelector('.board');
  var strHTML = '';
  for (var i = 0; i < board.length; i++) {
    strHTML += '<tr>\n';
    for (var j = 0; j < board[0].length; j++) {
      const currCell = board[i][j];

      var cellClass = getClassName({ i: i, j: j });
      // console.log('cellClass:', cellClass)

      if (currCell.type === FLOOR) cellClass += ' floor';
      else if (currCell.type === WALL) cellClass += ' wall';

      strHTML += `\t<td class="cell ${cellClass}"  onclick="moveTo(${i},${j})" >\n`;

      if (currCell.gameElement === GAMER) {
        strHTML += GAMER_IMG;
      } else if (currCell.gameElement === BALL) {
        strHTML += BALL_IMG;
      }

      strHTML += '\t</td>\n';
    }
    strHTML += '</tr>\n';
  }

  elBoard.innerHTML = strHTML;
}

// Move the player to a specific location
function moveTo(i, j) {
  if (gIsStuck) return;

  // go through passage
  let inPassage = false;
  if (i === -1) {
    inPassage = true;
    i = gBoard.length - 1;
  }
  if (j === -1) {
    inPassage = true;
    j = gBoard[i].length - 1;
  }
  if (j === gBoard[i]?.length) {
    inPassage = true;
    j = 0;
  }
  if (i === gBoard.length) {
    inPassage = true;
    i = 0;
  }

  const targetCell = gBoard[i][j];
  if (targetCell.type === WALL) return;

  // Calculate distance to make sure we are moving to a neighbor cell
  const iAbsDiff = Math.abs(i - gGamerPos.i);
  const jAbsDiff = Math.abs(j - gGamerPos.j);

  // If the clicked Cell is one of the four allowed
  if (
    (iAbsDiff === 1 && jAbsDiff === 0) ||
    (jAbsDiff === 1 && iAbsDiff === 0) ||
    inPassage
  ) {
    if (targetCell.gameElement === BALL) {
      console.log('Collecting!');

      const audio = new Audio('../sounds/sound2.mp3');
      audio.play();

      gCollectedBalls++;
      gLeftBalls--;
      updateBallCounter();

      if (!gLeftBalls) {
        stopGame();
        console.log('Game is Over');
      }
    }

    // stuck in glue
    if (targetCell.gameElement === GLUE) {
      console.log('Stuck!');
      gIsStuck = true;

      setTimeout(function () {
        gIsStuck = false;
      }, 3000);
    }

    // DONE: Move the gamer
    // REMOVING FROM
    // update Model
    gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
    // update DOM
    renderCell(gGamerPos, '');

    // ADD TO
    // update Model

    targetCell.gameElement = GAMER;
    gGamerPos = { i, j };
    // update DOM
    renderCell(gGamerPos, GAMER_IMG);
  }
}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
  const cellSelector = '.' + getClassName(location); // cell-i-j
  const elCell = document.querySelector(cellSelector);
  elCell.innerHTML = value;
}

// Move the player by keyboard arrows
function onHandleKey(event) {
  const i = gGamerPos.i;
  const j = gGamerPos.j;
  //   console.log('event.key:', event.key);

  switch (event.key) {
    case 'ArrowLeft':
      moveTo(i, j - 1);
      break;
    case 'ArrowRight':
      moveTo(i, j + 1);
      break;
    case 'ArrowUp':
      moveTo(i - 1, j);
      break;
    case 'ArrowDown':
      moveTo(i + 1, j);
      break;
  }
}

// Returns the class name for a specific cell
function getClassName(location) {
  const cellClass = 'cell-' + location.i + '-' + location.j;
  return cellClass;
}

// Create a ball
function createBall() {
  gBallInterval = setInterval(renderBall, 5000);
}

// Render a ball
function renderBall() {
  const cellCords = getEmptyCell();
  if (!cellCords) return;

  //MODEL
  gBoard[cellCords.i][cellCords.j].gameElement = BALL;

  // DOM
  renderCell(cellCords, BALL_IMG);

  gLeftBalls++;
  updateBallCounter();
}

// Create glue
function createGlue() {
  gGlueInterval = setInterval(renderGlue, 5000);
}

// Render a glue
function renderGlue() {
  const cellCords = getEmptyCell();
  if (!cellCords) return;

  // MODEL
  gBoard[cellCords.i][cellCords.j].gameElement = GLUE;

  // DOM
  renderCell(cellCords, GLUE_IMG);

  setTimeout(function () {
    if (gBoard[cellCords.i][cellCords.j].gameElement === GAMER) return;
    renderCell(cellCords, '');
    gBoard[cellCords.i][cellCords.j].gameElement = null;
  }, 3000);
}

// Update ball counters
function updateBallCounter() {
  const elCollected = document.querySelector('.collected');
  elCollected.innerHTML = gCollectedBalls;
  const elLeft = document.querySelector('.left');
  elLeft.innerHTML = gLeftBalls;
}

// Get empty cells {i: , j: }
function getEmptyCell() {
  const emptyCells = [];

  for (let i = 1; i < gBoard.length - 1; i++)
    for (let j = 1; j < gBoard[i].length - 1; j++) {
      if (gBoard[i][j].gameElement) continue;
      emptyCells.push({ i, j });
    }
  return emptyCells[getRandomInt(0, emptyCells.length)];
}
