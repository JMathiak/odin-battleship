function createShip(length) {
  var ship = {};

  ship.length = length;
  ship.health = [];
  ship.sunk = false;

  for (let i = 0; i < length; i++) {
    ship.health.push({
      shipPoint: i,
      hitStatus: "false",
    });
  }

  ship.isSunk = function () {
    console.log(this.length);
    for (let j = 0; j < this.length; j++) {
      if (this.health[j].hitStatus === "false") {
        return false;
      }
    }
    this.sunk = true;
    return true;
  };

  ship.hit = function (hitPoint) {
    this.health[hitPoint].hitStatus = "true";
  };

  return ship;
}

function createGameBoard() {
  var gameBoard = {};

  gameBoard.board = [
    ["empty", "empty", "empty", "empty", "empty", "empty", "empty"],
    ["empty", "empty", "empty", "empty", "empty", "empty", "empty"],
    ["empty", "empty", "empty", "empty", "empty", "empty", "empty"],
    ["empty", "empty", "empty", "empty", "empty", "empty", "empty"],
    ["empty", "empty", "empty", "empty", "empty", "empty", "empty"],
    ["empty", "empty", "empty", "empty", "empty", "empty", "empty"],
    ["empty", "empty", "empty", "empty", "empty", "empty", "empty"],
  ];

  gameBoard.placeShip = function (direction, length, yCord, xCord) {
    let ship = createShip(length);
    if (direction === "horizontal") {
      for (let i = 0; i < length; i++) {
        this.board[yCord][xCord + i] = ship.health[i];
      }
    } else if (direction === "vertical") {
      for (let i = 0; i < length; i++) {
        this.board[yCord + i][xCord] = ship.health[i];
      }
    }
  };

  return gameBoard;
}

let b1 = createGameBoard();
b1.placeShip("horizontal", 4, 0, 3);
console.log(b1.board);
exports.createShip = createShip;
exports.createGameBoard = createGameBoard;

/*
2d Array:
  x->   0       1         2         3       4       5       6
    0 ["empty", "empty", "empty", "empty", "empty", "empty", "empty"],
    1 ["empty", "empty", "empty", "empty", "empty", "empty", "empty"],
    2 ["empty", "empty", "empty", "empty", "empty", "empty", "empty"],
    3 ["empty", "empty", "empty", "empty", "empty", "empty", "empty"],
    4 ["empty", "empty", "empty", "empty", "empty", "empty", "empty"],
    5 ["empty", "empty", "empty", "empty", "empty", "empty", "empty"],
    6 ["empty", "empty", "empty", "empty", "empty", "empty", "empty"],
    ^
    y
    Each new sub-array is a y incrementation
    Each index inside of the subarray is a x- incrementation
    Board will be y = 0 from the top x = 0 from the left
*/
