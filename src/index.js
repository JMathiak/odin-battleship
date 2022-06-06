import { emptyRender, placeShipListeners } from "./modules/board";
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
    for (let i = 1; i <= length; i++) {
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
    for (let i = 1; i <= length; i++) {
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
    let startingColumn = shipToPlace.startingCord.startingXCord;
    let startingRow = shipToPlace.startingCord.startingYCord;
    let endingColumn = shipToPlace.endingCord.endingXCord;
    let endingRow = shipToPlace.endingCord.endingYCord;

    if (shipToPlace.direction == "vertical") {
      if (startingRow == 6) {
        return false;
      }
      if (endingRow > 6) {
        console.log(shipToPlace.name, endingRow);
        return false;
      }
      for (let i = startingRow; i <= endingRow; i++) {
        console.log(shipToPlace.name, this.board[i][startingColumn]);
        if (this.board[i][startingColumn] != "empty") {
          return false;
        }
      }
    } else if (shipToPlace.direction == "horizontal") {
      if (startingColumn == 6) {
        return false;
      }
      if (endingColumn > 6) {
        return false;
      }
      for (let j = startingColumn; j <= endingColumn; j++) {
        console.log(shipToPlace.name, this.board[startingRow][j]);
        if (this.board[startingRow][j] != "empty") {
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
      return true;
    } else if (this.board[yCord][xCord] == "empty") {
      this.board[yCord][xCord] = "miss";
      return true;
    } else if (
      this.board[yCord][xCord] == "miss" ||
      this.board[yCord][xCord].spot.hitStatus == "true"
    ) {
      return false;
    }
    return true;
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

function gameLoop() {
  let hum = createPlayer("human");
  let comp = createPlayer("computer");
  let winner = null;
  let turnCounter = 1;
  let shipNames = [
    "Carrier",
    "Battleship",
    "Cruiser",
    "Submarine",
    "Destroyer",
  ];
  let shipLengths = [5, 4, 3, 3, 2];
  let directions = ["horizontal", "vertical"];
  let xCord = Math.floor(Math.random() * 7);
  let yCord = Math.floor(Math.random() * 7);
  let direction = Math.floor(Math.random() * 1);

  for (let i = 0; i < shipNames.length; i++) {
    while (
      !comp.board.placeShip(
        directions[direction],
        shipNames[i],
        shipLengths[i],
        yCord,
        xCord
      )
    ) {
      xCord = Math.floor(Math.random() * 7);
      yCord = Math.floor(Math.random() * 7);
    }
  }
  xCord = Math.floor(Math.random() * 7);
  yCord = Math.floor(Math.random() * 7);

  for (let j = 0; j < shipNames.length; j++) {
    while (
      !hum.board.placeShip(
        directions[direction],
        shipNames[j],
        shipLengths[j],
        yCord,
        xCord
      )
    ) {
      xCord = Math.floor(Math.random() * 7);
      yCord = Math.floor(Math.random() * 7);
    }
  }

  while (winner == null) {
    xCord = Math.floor(Math.random() * 7);
    yCord = Math.floor(Math.random() * 7);
    while (!comp.board.receiveAttack(yCord, xCord)) {
      xCord = Math.floor(Math.random() * 7);
      yCord = Math.floor(Math.random() * 7);
    }
    if (comp.board.checkForAllSunk() == true) {
      winner = "Human";
    }

    if (winner == null) {
      xCord = Math.floor(Math.random() * 7);
      yCord = Math.floor(Math.random() * 7);
      while (!hum.board.receiveAttack(yCord, xCord)) {
        xCord = Math.floor(Math.random() * 7);
        yCord = Math.floor(Math.random() * 7);
      }
      if (hum.board.checkForAllSunk() == true) {
        winner = "Computer";
      }
    }
  }

  return winner;
}

function testRender() {
  let shipNames = [
    "Carrier",
    "Battleship",
    "Cruiser",
    "Submarine",
    "Destroyer",
  ];
  let shipLengths = [5, 4, 3, 3, 2];
  let directions = ["horizontal", "vertical"];
  let xCord = Math.floor(Math.random() * 7);
  let yCord = Math.floor(Math.random() * 7);
  let direction = Math.floor(Math.random() * 2);
  let player = createPlayer("human");
  for (let j = 0; j < shipNames.length; j++) {
    while (
      !player.board.placeShip(
        directions[direction],
        shipNames[j],
        shipLengths[j],
        yCord,
        xCord
      )
    ) {
      xCord = Math.floor(Math.random() * 7);
      yCord = Math.floor(Math.random() * 7);
      direction = Math.floor(Math.random() * 1);
    }
  }
  let parentDiv = document.getElementById("player");
  let rowArr = ["A", "B", "C", "D", "E", "F", "G"];
  //Outer loop is rows, inner loop is columns
  for (let i = 0; i < 8; i++) {
    let row = document.createElement("div");
    row.className = "row";
    row.setAttribute("Y-Cord", i);
    if (i == 0) {
      let box = document.createElement("div");
      box.className = "box";
      box.innerText = "Y/X ";
      row.appendChild(box);
    }
    for (let j = 0; j < 8; j++) {
      let box = document.createElement("div");
      box.className = "box";
      box.setAttribute("X-Cord", j);
      if (i == 0) {
        if (j !== 7) {
          box.innerText = rowArr[j];
          box.innerText += "(" + j + ")";
        }
      } else if (j == 0) {
        box.innerText = i;
      } else {
        if (player.board.board[i - 1][j - 1] == "empty") {
          box.innerText = player.board.board[i - 1][j - 1];
        } else {
          box.innerText = player.board.board[i - 1][j - 1].name;
          box.classList.add("ship");
          box.addEventListener("click", function () {
            let shipName = player.board.board[i - 1][j - 1].name;
            let filteredArr = player.board.ships.filter(
              (sh) => sh.name == shipName
            );
            let ship = filteredArr[0];
            console.log(ship);
            console.log(player.board.board);
          });
        }
      }

      if (j == 7 && i == 0) {
      } else {
        row.appendChild(box);
      }
    }
    parentDiv.appendChild(row);
  }
}
//testRender();
// gameLoop();
let ships = [
  {
    name: "Carrier",
    length: 5,
    placed: false,
  },
  {
    name: "Battleship",
    length: 4,
    placed: false,
  },
  {
    name: "Cruiser",
    length: 3,
    placed: false,
  },
  {
    name: "Submarine",
    length: 3,
    placed: false,
  },
  {
    name: "Destroyer",
    length: 2,
    placed: false,
  },
];
let user = createPlayer("human");
emptyRender("player", user);
export default user;
placeShipListeners();
emptyRender("guess");

exports.createShip = createShip;
exports.createGameBoard = createGameBoard;
exports.gameLoop = gameLoop;

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

/*
-Render empty board
-Need a way to track which square is getting clicked in relation to the 2d array
-Render board after placing each ship w/a ship marker
-Update squares after each guess on each side. 
-Maybe use get source to get 2d array coordinates


*/
