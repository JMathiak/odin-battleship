const gameModules = require("./index.js");

test("ship returns not sunk", () => {
  let ship1 = gameModules.createShip("Battleship", 4);
  expect(ship1.isSunk()).toBe(false);
});

test("ship is hit in spot 1", () => {
  let ship1 = gameModules.createShip("Battleship", 4);
  ship1.hit(1);
  expect(ship1.health[1].hitStatus).toBe("true");
});

test("ship is sunk", () => {
  let ship1 = gameModules.createShip("Carrier", 5);
  ship1.hit(0);
  ship1.hit(1);
  ship1.hit(2);
  ship1.hit(3);
  ship1.hit(4);
  expect(ship1.isSunk()).toBe(true);
});

test("Ship is placed horizontally", () => {
  let b1 = gameModules.createGameBoard();
  b1.placeShip("horizontal", "Battleship", 4, 0, 3);
  expect(b1.board[0][3]).toStrictEqual({ shipPoint: 0, hitStatus: "false" });
});

test("Ship is placed horizontally", () => {
  let b1 = gameModules.createGameBoard();
  b1.placeShip("horizontal", "Battleship", 4, 0, 3);
  expect(b1.board[0][4]).toStrictEqual({ shipPoint: 1, hitStatus: "false" });
});
test("Ship is placed horizontally", () => {
  let b1 = gameModules.createGameBoard();
  b1.placeShip("horizontal", "Battleship", 4, 0, 3);
  expect(b1.board[0][5]).toStrictEqual({ shipPoint: 2, hitStatus: "false" });
});
test("Ship is placed horizontally", () => {
  let b1 = gameModules.createGameBoard();
  b1.placeShip("horizontal", "Battleship", 4, 0, 3);
  expect(b1.board[0][6]).toStrictEqual({ shipPoint: 3, hitStatus: "false" });
});

test("Ship is placed vertically", () => {
  let b1 = gameModules.createGameBoard();
  b1.placeShip("vertical", "Cruiser", 3, 3, 2);
  expect(b1.board[3][2]).toStrictEqual({ shipPoint: 0, hitStatus: "false" });
});

test("Ship is placed vertically", () => {
  let b1 = gameModules.createGameBoard();
  b1.placeShip("vertical", "Cruiser", 3, 3, 2);
  expect(b1.board[4][2]).toStrictEqual({ shipPoint: 1, hitStatus: "false" });
});

test("Ship is placed vertically", () => {
  let b1 = gameModules.createGameBoard();
  b1.placeShip("vertical", "Cruiser", 3, 3, 2);
  expect(b1.board[5][2]).toStrictEqual({ shipPoint: 2, hitStatus: "false" });
});

test("Ship is placed and sunk after 3 hits", () => {
  let b1 = gameModules.createGameBoard();
  b1.placeShip("horizontal", "Battleship", 4, 0, 3);
  b1.receiveAttack(0, 3);
  expect(b1.board[0][3].spot.hitStatus).toBe("true");
});

test("Coordinates for board[0][3] should match. x = 3", () => {
  let b1 = gameModules.createGameBoard();
  b1.placeShip("horizontal", "Battleship", 4, 0, 3);
  b1.receiveAttack(0, 3);
  expect(b1.board[0][3].spot.coordinates.xCord).toBe(3);
});

test("Coordinates for board[0][3] should match. y = 0", () => {
  let b1 = gameModules.createGameBoard();
  b1.placeShip("horizontal", "Battleship", 4, 0, 3);
  b1.receiveAttack(0, 3);
  expect(b1.board[0][3].spot.coordinates.yCord).toBe(0);
});

test("Hit status for board[0][3] should be true", () => {
  let b1 = gameModules.createGameBoard();
  b1.placeShip("horizontal", "Battleship", 4, 0, 3);
  b1.receiveAttack(0, 3);
  expect(b1.board[0][3].spot.hitStatus).toBe("true");
});

test("A ship should be sunk after 4 (or the length) hits", () => {
  let b1 = gameModules.createGameBoard();
  b1.placeShip("horizontal", "Battleship", 4, 0, 3);
  b1.receiveAttack(0, 3);
  b1.receiveAttack(0, 4);
  b1.receiveAttack(0, 5);
  b1.receiveAttack(0, 6);
  expect(b1.ships[0].sunk).toBe(true);
});

test("Multiple ships can be placed at once", () => {
  let b1 = gameModules.createGameBoard();
  b1.placeShip("horizontal", "Battleship", 4, 0, 3);
  b1.placeShip("vertical", "Cruiser", 3, 2, 1);
  expect(b1.ships.length).toBe(2);
  expect(b1.ships[0].name).toBe("Battleship");
  expect(b1.ships[1].name).toBe("Cruiser");
});

test("Guessing the same point will return with a message about it not being valid", () => {
  let b1 = gameModules.createGameBoard();
  b1.receiveAttack(0, 3);
  expect(b1.board[0][3]).toBe("miss");
  expect(b1.receiveAttack(0, 3)).toBe("Invalid Guess");
});
