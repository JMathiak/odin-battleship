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
    for (let i = 0; i <= length; i++) {
      ship.health.push({
        shipPoint: i,
        hitStatus: "false",
        coordinates: {
          xCord: parseInt(startingCord.startingXCord) + i,
          yCord: parseInt(startingCord.startingYCord),
        },
      });
    }
  } else if (direction == "vertical") {
    for (let i = 0; i <= length; i++) {
      ship.health.push({
        shipPoint: i,
        hitStatus: "false",
        coordinates: {
          xCord: startingCord.startingXCord,
          yCord: parseInt(startingCord.startingYCord) + i,
        },
      });
    }
  }

  ship.isSunk = function () {
    for (let j = 0; j < this.length; j++) {
      if (this.health[j].hitStatus == "false") {
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

export default createShip;
