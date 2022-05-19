function createShip(name, direction, length, startingCord, endingCord) {
  var ship = {};
  ship.name = name;
  ship.length = length;
  ship.startingCord = startingCord;
  ship.endingCord = endingCord;
  ship.health = [];
  ship.sunk = false;

  if (direction == "horizontal") {
    for (let i = 0; i < length; i++) {
      ship.health.push({
        shipPoint: i,
        hitStatus: "false",
        coordinates: {
          xCord: startingCord.xCord + i,
          yCord: startingCord.yCord,
        },
      });
    }
  } else if (direction == "vertical") {
    for (let i = 0; i < length; i++) {
      ship.health.push({
        shipPoint: i,
        hitStatus: "false",
        coordinates: {
          xCord: startingCord.xCord,
          yCord: startingCord.yCord + i,
        },
      });
    }
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
  gameBoard.ships = [];
  gameBoard.board = [
    ["empty", "empty", "empty", "empty", "empty", "empty", "empty"],
    ["empty", "empty", "empty", "empty", "empty", "empty", "empty"],
    ["empty", "empty", "empty", "empty", "empty", "empty", "empty"],
    ["empty", "empty", "empty", "empty", "empty", "empty", "empty"],
    ["empty", "empty", "empty", "empty", "empty", "empty", "empty"],
    ["empty", "empty", "empty", "empty", "empty", "empty", "empty"],
    ["empty", "empty", "empty", "empty", "empty", "empty", "empty"],
  ];

  gameBoard.placeShip = function (direction, name, length, yCord, xCord) {
    let endingCord = {};
    if (direction == "horizontal") {
      endingCord.endingXCord = xCord + length;
      endingCord.endingYCord = yCord;
    } else if (direction == "vertical") {
      endingCord.endingXCord = xCord;
      endingCord.endingYCord = yCord + length;
    }
    let ship = createShip(
      name,
      direction,
      length,
      { startingXCord: xCord, startingYCord: yCord },
      endingCord
    );
    gameBoard.ships.push(ship);
    if (direction == "horizontal") {
      for (let i = 0; i < length; i++) {
        let placeObj = {
          name: ship.name,
          spot: ship.health[i],
        };
        this.board[yCord][xCord + i] = placeObj;
      }
    } else if (direction == "vertical") {
      for (let i = 0; i < length; i++) {
        let placeObj = {
          name: ship.name,
          spot: ship.health[i],
        };
        this.board[yCord + i][xCord] = ship.health[i];
      }
    }
  };

  gameBoard.receiveAttack = function (yCord, xCord) {
    if (
      this.board[yCord][xCord] !== "empty" &&
      this.board[yCord][xCord] !== "miss"
    ) {
      let shipName = this.board[yCord][xCord];
      let filteredArr = this.ships.filter((sh) => sh.name !== shipName);
      let ship = filteredArr[0];
      let pointArr = ship.health.filter(
        (point) =>
          point.coordinates.xCord != xCord && point.coordinates.yCord != yCord
      );
      ship.hit(pointArr[0].shipPoint);
    }
  };

  return gameBoard;
}

let b1 = createGameBoard();
b1.placeShip("horizontal", "Battleship", 4, 0, 3);
b1.receiveAttack(0, 3);
console.log(b1.board);
console.log(b1.board[0][3]);
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

/*
    Ships:
    Carrier- 5
    Battleship - 4
    Cruiser - 3
    Submarine - 3
    Destroyer - 2

*/
