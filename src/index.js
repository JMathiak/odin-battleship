import {
  emptyRender,
  placeShipListeners,
  addGuessClick,
  clearBoards,
  initializeButton,
} from "./modules/board";
import createPlayer from "./modules/player";

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

function waitForShips() {
  if (shipsPlaced != true) {
    setTimeout(waitForShips, 500);
    return;
  }
  placeComputerShips();
  addGuessClick();
}

function placeComputerShips() {
  let directions = ["horizontal", "vertical"];
  let xCord = Math.floor(Math.random() * 7);
  let yCord = Math.floor(Math.random() * 7);
  let direction = Math.floor(Math.random() * 2);
  for (let i = 0; i < ships.length; i++) {
    while (
      !comp.board.placeShip(
        directions[direction],
        ships[i].name,
        ships[i].length,
        yCord,
        xCord
      )
    ) {
      xCord = Math.floor(Math.random() * 7);
      yCord = Math.floor(Math.random() * 7);
      direction = Math.floor(Math.random() * 2);
    }
    console.log(ships[i].name, "placed");
  }
  console.log(comp.board.board);
}

function setUpGame() {
  emptyRender("player");
  placeShipListeners();
  emptyRender("guess");
  waitForShips();
}

function playAgain() {
  clearBoards();
  clearArrays();
  shipsPlaced = false;
  document.getElementById("direction-form").style.display = "block";
  emptyRender("player");
  placeShipListeners();
  emptyRender("guess");
  waitForShips();
}

function clearArrays() {
  //Outter rows, inner columns
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 7; j++) {
      user.board.board[i][j] = "empty";
      comp.board.board[i][j] = "empty";
    }
  }
}
initializeButton();
let user = createPlayer("human");
let comp = createPlayer("computer");
let turnCount = 0; //Not used?
let shipsPlaced = false;
export { user, comp, turnCount, shipsPlaced, playAgain };
setUpGame();
/*
After wait for ships, call function that sets up computer player
Do nothing until on click function is called
On click function for human guesses:
-Get coordinates
-Comp.receive attack
-Update guess square with class for hit or miss
-Check for all sunk
- if all sunk, remove all listeners, return, and display winner
-if not all sunk, remove listener from previous guess, --> computer turn 
-generate random guess until valid guess
-Human.receive attack
-Update board with guess result
-Check for all sunk
-if all sunk, remove all listeneres, return, display winner
-if not all sunk --> do nothing. 

*/

/*
receive attack 
find row div by attribute --> document.getElementById("player").querySelectorAll('[y-Cord="1"]');
find box div by attribute

if(player.board.board[yGuess -1][xGuess -1] == 'miss')
{
  add class name miss
}else{
  add class name hit
}
  Need functions for:
    -Removing all guess listeners
    


*/

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


-Export computer player
-Export turn counter to track when comp should make a move and when to check for
all sunk for whose board
- Event listener on right side board for comp.board.receiveAttack
- Empty while loop with condition of turnCount mod 2 == 0, add turnCount increment
- to guess on click 

*/

/*
6/13/22 What's Left To Do:
-Modals
-Styling
-Play Again Buttons -> on modal and on screen
-Add radio for horiz vert placement
*/
