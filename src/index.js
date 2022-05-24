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
      return false;
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

function createPlayer(type) {
  let player = {};
  player.type = type;
  player.board = createGameBoard();

  return player;
}

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
    board[row][column]
*/

/*
    Ships:
    Carrier- 5
    Battleship - 4
    Cruiser - 3
    Submarine - 3
    Destroyer - 2

*/

/*

For computer guessess:
let xGuess = Math.random(7);
let yGuess = Math.random(7);
while(!p1.board.receiveAttack(yGuess, xGuess))
{
  xGuess = Math.random(7);
  yGuess = Math.random(7);
}

For game loop"
let turnCounter = 1;
let winner = null;
while(winner == null)
{
  if(turnCounter%2 == )
  {
    get guess values
    while(!p2.board.receiveAttack(values))
    {
      update guess values
    }
    check for all sunk
  }else{
let xGuess = Math.random(7);
let yGuess = Math.random(7);
while(!p1.board.receiveAttack(yGuess, xGuess))
{
  xGuess = Math.random(7);
  yGuess = Math.random(7);
}
check for all sunk
  }
  turnCounter++;
}



Need a way to wait for new values if guess from user is invalid
Maybe an onclick method that sends values
Need a way to get return from check if all are sunk? Maybe remove it from receive
attack and call it after every turn 

*/
