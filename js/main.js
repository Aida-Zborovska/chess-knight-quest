let boardWidth, boardHeight;
const knightMoves = [
  { dx: 1, dy: 2 },
  { dx: 1, dy: -2 },
  { dx: -1, dy: 2 },
  { dx: -1, dy: -2 },
  { dx: 2, dy: 1 },
  { dx: 2, dy: -1 },
  { dx: -2, dy: 1 },
  { dx: -2, dy: -1 },
];

const generateForm = document.querySelector(".js-generate-form");
const board = document.querySelector(".js-chessboard");

generateForm.addEventListener("submit", handleFormSubmit);
board.addEventListener("click", markStartCell);
board.addEventListener("click", handleNextMove);

function handleFormSubmit(event) {
  event.preventDefault();
  generateForm.classList.add("hidden");
  board.classList.remove("hidden");
  const x = Number(generateForm.elements.width.value);
  const y = Number(generateForm.elements.height.value);
  boardWidth = x;
  boardHeight = y;
  generateBoard(x, y);
}

function generateBoard(x, y) {
  board.style.gridTemplateColumns = `repeat(${x}, 50px)`;
  board.style.gridTemplateRows = `repeat(${y}, 50px)`;

  const cells = [];
  for (let row = 1; row <= y; row++) {
    for (let col = 1; col <= x; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.x = col;
      cell.dataset.y = row;
      const isWhite = (row + col) % 2 === 0;
      cell.classList.add(isWhite ? "white" : "black");
      cells.push(cell);
    }
  }
  board.append(...cells);
}

function markStartCell(event) {
  const startCell = event.target.closest(".cell");
  startCell.classList.add("start-cell", "active-cell");
  startCell.innerHTML = `<img src="./images/knight.png" class="knight" />`;
  board.removeEventListener("click", markStartCell);
  markAvailableCells(startCell);
}

function markAvailableCells(activeCell) {
  const x = Number(activeCell.dataset.x);
  const y = Number(activeCell.dataset.y);
  const acCoords = getAvailableCellsCoords(knightMoves, x, y);
  acCoords.forEach((coords) => {
    const cell = board.querySelector(
      `[data-x="${coords.x}"][data-y="${coords.y}"]:not(.visited)`
    );
    if (cell) {
      cell.classList.add("possible-move");
    }
  });
}

function getAvailableCellsCoords(moves, x, y) {
  return moves
    .map((move) => ({
      x: move.dx + x,
      y: move.dy + y,
    }))
    .filter((move) => {
      return (
        move.x >= 1 &&
        move.x <= boardWidth &&
        move.y >= 1 &&
        move.y <= boardHeight
      );
    });
}

function handleNextMove(event) {
  const currentCell = event.target.closest(".possible-move");
  if (!currentCell) {
    return;
  }
  switchActiveToVisited();
  currentCell.classList.add("active-cell");
  currentCell.innerHTML = `<img src="./images/knight.png" class="knight" />`;

  clearOldAvailableMoves();
  markAvailableCells(currentCell, knightMoves);
  checkGameEnd() && handleGameEnd();
}

function switchActiveToVisited() {
  const oldActiveCell = board.querySelector(".active-cell");
  oldActiveCell.classList.remove("active-cell");
  oldActiveCell.classList.add("visited");
  if (oldActiveCell.classList.contains("start-cell")) {
    oldActiveCell.innerHTML = `<img src="./images/castle.png" class="castle" />`;
  } else {
    oldActiveCell.innerHTML = `<img src="./images/horseshoe.png" class="horseshoe" />`;
  }
}

function clearOldAvailableMoves() {
  const oldPossibleCells = board.querySelectorAll(".possible-move");
  oldPossibleCells.forEach((cell) => cell.classList.remove("possible-move"));
}

function checkGameEnd() {
  const possibleCell = board.querySelector(".possible-move");
  return !possibleCell;
}

function handleGameEnd() {
  const notVisited = board.querySelectorAll(":not(.visited)");
  notVisited.length === 1 ? console.log("Ви виграли") : console.log("лузер");
}
