const gameModules = require("./index.js");

test("ship returns not sunk", () => {
  let ship1 = gameModules.createShip(4);
  expect(ship1.isSunk()).toBe(false);
});

test("ship is hit in spot 1", () => {
  let ship1 = gameModules.createShip(4);
  ship1.hit(1);
  expect(ship1.health[1]).toBe("true");
});

test("ship is sunk", () => {
  let ship1 = gameModules.createShip(5);
  ship1.hit(0);
  ship1.hit(1);
  ship1.hit(2);
  ship1.hit(3);
  ship1.hit(4);
  ship1.hit(5);
  expect(ship1.isSunk()).toBe(true);
});

test("Ship is placed horizontally", () => {
  let b1 = gameModules.createGameBoard();
  b1.placeShip("horizontal", 4, 0, 3);
  expect(b1.board[0][3]).toBe(4);
});

test("Ship is placed horizontally", () => {
  let b1 = gameModules.createGameBoard();
  b1.placeShip("horizontal", 4, 0, 3);
  expect(b1.board[0][4]).toBe(4);
});
test("Ship is placed horizontally", () => {
  let b1 = gameModules.createGameBoard();
  b1.placeShip("horizontal", 4, 0, 3);
  expect(b1.board[0][5]).toBe(4);
});
test("Ship is placed horizontally", () => {
  let b1 = gameModules.createGameBoard();
  b1.placeShip("horizontal", 4, 0, 3);
  expect(b1.board[0][6]).toBe(4);
});

test("Ship is placed vertically", () => {
  let b1 = gameModules.createGameBoard();
  b1.placeShip("vertical", 3, 3, 2);
  expect(b1.board[3][2]).toBe(3);
});

test("Ship is placed vertically", () => {
  let b1 = gameModules.createGameBoard();
  b1.placeShip("vertical", 3, 3, 2);
  expect(b1.board[4][2]).toBe(3);
});

test("Ship is placed vertically", () => {
  let b1 = gameModules.createGameBoard();
  b1.placeShip("vertical", 3, 3, 2);
  expect(b1.board[5][2]).toBe(3);
});
