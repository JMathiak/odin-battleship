import createShip from "./ship";
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
    console.log(startingColumn, startingRow, endingColumn, endingRow);
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
      endingCord.endingXCord = parseInt(xCord) + length - 1;
      endingCord.endingYCord = yCord;
    } else if (direction == "vertical") {
      endingCord.endingXCord = xCord;
      endingCord.endingYCord = parseInt(yCord) + length - 1;
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
          console.log(parseInt(xCord) + i);
          this.board[yCord][parseInt(xCord) + i] = placeObj;
        }
      } else if (direction == "vertical") {
        for (let i = 0; i < length; i++) {
          let placeObj = {
            name: ship.name,
            spot: ship.health[i],
          };
          this.board[parseInt(yCord) + i][xCord] = placeObj;
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
      console.log(ship);
      console.log("Received X Cord", xCord);
      console.log("Received Y Cord", yCord);
      let pointArr = ship.health.filter(
        (point) =>
          point.coordinates.xCord == xCord && point.coordinates.yCord == yCord
      );
      console.log(shipName);
      console.log(pointArr);
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

export default createGameBoard;
