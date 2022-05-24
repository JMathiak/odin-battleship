function createShip(name, direction, length, startingCord, endingCord) {
  var ship = {};
  ship.name = name;
  ship.length = length;
  ship.startingCord = startingCord;
  ship.endingCord = endingCord;
  ship.health = [];
  ship.sunk = false;
  ship.direction = direction;

  if (direction == "horizontal") {
    for (let i = 0; i < length; i++) {
      ship.health.push({
        shipPoint: i,
        hitStatus: "false",
        coordinates: {
          xCord: startingCord.startingXCord + i,
          yCord: startingCord.startingYCord,
        },
      });
    }
  } else if (direction == "vertical") {
    for (let i = 0; i < length; i++) {
      ship.health.push({
        shipPoint: i,
        hitStatus: "false",
        coordinates: {
          xCord: startingCord.startingXCord,
          yCord: startingCord.startingYCord + i,
        },
      });
    }
  }

  ship.isSunk = function () {
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

  gameBoard.checkForValidPlacement = function (shipToPlace) {
    if (this.ships[0] == null) {
      return true;
    }
    let startingColumn = shipToPlace.startingCord.startingXCord;
    let startingRow = shipToPlace.startingCord.startingYCord;
    let endingColumn = shipToPlace.endingCord.endingXCord;
    let endingRow = shipToPlace.endingCord.endingYCord;

    if (shipToPlace.direction == "vertical") {
      for (let i = startingRow; i < endingRow; i++) {
        if (this.board[i][startingColumn] !== "empty") {
          return false;
        }
      }
    } else if (shipToPlace.direction == "horizontal") {
      for (let j = startingColumn; j < endingColumn; j++) {
        if (this.board[startingRow][j] !== "empty") {
          return false;
        }
      }
    }
    return true;
  };

  gameBoard.placeShip = function (direction, name, length, yCord, xCord) {
    let endingCord = {};
    let startingCord = { startingXCord: xCord, startingYCord: yCord };

    if (direction == "horizontal") {
      endingCord.endingXCord = xCord + length - 1;
      endingCord.endingYCord = yCord;
    } else if (direction == "vertical") {
      endingCord.endingXCord = xCord;
      endingCord.endingYCord = yCord + length - 1;
    }

    let ship = createShip(name, direction, length, startingCord, endingCord);
    console.log(direction);
    if (this.checkForValidPlacement(ship) == false) {
      return false;
    } else {
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
          this.board[yCord + i][xCord] = placeObj;
        }
      }
    }
    return true;
  };

  gameBoard.receiveAttack = function (yCord, xCord) {
    if (
      this.board[yCord][xCord] !== "empty" &&
      this.board[yCord][xCord] !== "miss"
    ) {
      let shipName = this.board[yCord][xCord].name;
      let filteredArr = this.ships.filter((sh) => sh.name == shipName);
      let ship = filteredArr[0];
      let pointArr = ship.health.filter(
        (point) =>
          point.coordinates.xCord === xCord && point.coordinates.yCord === yCord
      );
      ship.hit(pointArr[0].shipPoint);
      ship.isSunk();
      if (ship.sunk == true) {
        this.checkForAllSunk();
      }
    } else if (this.board[yCord][xCord] == "empty") {
      this.board[yCord][xCord] = "miss";
    } else if (
      this.board[yCord][xCord] == "miss" ||
      this.board[yCord][xCord].spot.hitStatus == "true"
    ) {
      return "Invalid Guess";
    }
  };

  gameBoard.checkForAllSunk = function () {
    for (let i = 0; i < this.ships.length; i++) {
      if (this.ships[i].sunk == false) {
        return false;
      }
    }
    return true;
  };

  return gameBoard;
}

function createPlayer() {
  let player = {};
  player.board = createGameBoard();

  return player;
}
let b1 = createGameBoard();
b1.placeShip("horizontal", "Battleship", 4, 0, 3);
b1.placeShip("vertical", "Cruiser", 3, 0, 3);
console.log(b1.board);
exports.createShip = createShip;
exports.createGameBoard = createGameBoard;

/*
2d Array:
  x->   0       1         2         3       4       5       6
    0 ["empty", "empty", "empty", "bs", "bs", "bs", "bs"],
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
