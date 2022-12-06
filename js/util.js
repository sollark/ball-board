'use strict';

// MODEL MATRIX
function createMat(ROWS, COLS) {
  const mat = [];
  for (var i = 0; i < ROWS; i++) {
    const row = [];
    for (var j = 0; j < COLS; j++) {
      row.push('');
    }
    mat.push(row);
  }
  return mat;
}

//  DOCUMENT
function renderBoard(board) {
  const elBoard = document.querySelector('.board');

  var strHTML = '';
  for (var i = 0; i < board.length; i++) {
    strHTML += '<tr>\n';

    for (var j = 0; j < board[0].length; j++) {
      const currCell = board[i][j];

      var cellClass = getClassName({ i: i, j: j });
      // console.log('cellClass:', cellClass)

      // if (currCell.type === FLOOR) cellClass += ' floor';
      // else if (currCell.type === WALL) cellClass += ' wall';

      // strHTML += `\t<td class="cell ${cellClass}"  onclick="moveTo(${i},${j})" >\n`;

      // if (currCell.gameElement === GAMER) {
      //   strHTML += GAMER_IMG;
      // } else if (currCell.gameElement === BALL) {
      //   strHTML += BALL_IMG;
      // }

      strHTML += '\t</td>\n';
    }
    strHTML += '</tr>\n';
  }

  elBoard.innerHTML = strHTML;
}

function getClassName(location) {
  const cellClass = 'cell-' + location.i + '-' + location.j;
  return cellClass;
}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
  const cellSelector = '.' + getClassName(location); // cell-i-j
  const elCell = document.querySelector(cellSelector);
  elCell.innerHTML = value;
}

// Get empty cells {i: , j: }  NEED REFACTOR
// function getEmptyCell() {
//   const emptyCells = [];

//   for (let i = 1; i < gBoard.length - 1; i++)
//     for (let j = 1; j < gBoard[i].length - 1; j++) {
//       if (gBoard[i][j].gameElement) continue;
//       emptyCells.push({ i, j });
//     }
//   return emptyCells[getRandomInt(0, emptyCells.length)];
// }

//////////////////////////////////////////////////////////////////

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function initNumPool(size) {
  const nums = [];

  for (var i = 1; i <= size; i++) {
    nums.push(i);
  }

  return shuffle(nums);
}

function shuffle(arr) {
  let currentIndex = arr.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [arr[currentIndex], arr[randomIndex]] = [
      arr[randomIndex],
      arr[currentIndex],
    ];
  }

  return arr;
}

function copyArray(array) {
  return JSON.parse(JSON.stringify(array));
}

const c = console.log(document);
