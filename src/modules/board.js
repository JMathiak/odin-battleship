import { user, comp, shipsPlaced, playAgain } from "../index.js";

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
let shipIndex = 0;
function emptyRender(div) {
  let parentDiv = document.getElementById(div);
  let rowArr = ["A", "B", "C", "D", "E", "F", "G"];
  //Outer loop is rows, inner loop is columns
  for (let i = 0; i < 8; i++) {
    let row = document.createElement("div");
    row.className = "row";
    row.setAttribute("Y-Cord", i - 1);
    if (i == 0) {
      let box = document.createElement("div");
      box.className = "box";
      box.innerText = "Y/X ";
      row.appendChild(box);
    }
    for (let j = 0; j < 8; j++) {
      let box = document.createElement("div");
      box.className = "box";
      if (i == 0) {
        if (j !== 7) {
          box.innerText = rowArr[j];
          box.innerText += "(" + j + ")";
        }
      } else if (j == 0) {
        box.innerText = i - 1;
      }

      if (j == 7 && i == 0) {
      } else {
        box.setAttribute("X-Cord", j - 1);
        row.appendChild(box);
      }
    }
    parentDiv.appendChild(row);
  }
}
function deleteBoard(div) {
  let parentDiv = document.getElementById(div);
}

function removeAddShips() {
  let parentDiv = document.getElementById("player");
  let rows = parentDiv.getElementsByClassName("row");
  for (let i = 1; i < rows.length; i++) {
    let curRow = rows[i];
    for (let j = 1; j < curRow.childNodes.length; j++) {
      let curBox = curRow.childNodes[j];
      curBox.removeEventListener("click", onAddShipClick);
    }
  }
}
function refreshBoard(div, player, ship) {
  let parentDiv = document.getElementById(div);
  let rows = parentDiv.getElementsByClassName("row");
  for (let i = 1; i < rows.length; i++) {
    let curRow = rows[i];
    let curYCord = curRow.getAttribute("y-cord");
    for (let j = 1; j < curRow.childNodes.length; j++) {
      let curBox = curRow.childNodes[j];
      let curXCord = curBox.getAttribute("x-cord");
      if (
        player.board.board[curYCord][curXCord] !== "empty" &&
        player.board.board[curYCord][curXCord] !== "miss"
      ) {
        curBox.classList.add("ship");
      }
    }
  }
  removeAddShips();
  shipIndex++;
  if (shipIndex < 5) {
    placeShipListeners();
  }
  if (shipIndex == 5) {
    shipsPlaced = true;
    document.getElementById("direction-form").style.display = "none";
  }
}

function placeShipListeners() {
  let parentDiv = document.getElementById("player");
  let rows = parentDiv.getElementsByClassName("row");
  //let direction = document.getElementById('direction-radio').value;
  let direction = "horizontal";
  //Outer iterates through rows, inner through boxes in row
  for (let i = 1; i < rows.length; i++) {
    let curRow = rows[i];
    let curYCord = curRow.getAttribute("y-cord");
    for (let j = 1; j < curRow.childNodes.length; j++) {
      let curBox = curRow.childNodes[j];
      let curXCord = curBox.getAttribute("x-cord");
      if (user.board.board[curYCord][curXCord] == "empty") {
        curBox.addEventListener("click", onAddShipClick);
      }
    }
  }
}

function onAddShipClick() {
  let direction = document.querySelector(
    'input[name = "direction"]:checked'
  ).value;

  if (
    user.board.placeShip(
      direction,
      ships[shipIndex].name,
      ships[shipIndex].length,
      event.target.parentNode.getAttribute("y-cord"),
      event.target.getAttribute("x-cord")
    ) == true
  ) {
    refreshBoard("player", user);
  }
}

function guessClick() {
  let userYGuess = event.target.parentNode.getAttribute("y-cord");
  let userXGuess = event.target.getAttribute("x-cord");
  let userYQuery = `[y-Cord="` + userYGuess + `"]`;
  let userXQuery = `[x-Cord="` + userXGuess + `"]`;
  let userBoxOfInterest = document
    .getElementById("guess")
    .querySelectorAll(userYQuery)[0]
    .querySelectorAll(userXQuery)[0];

  comp.board.receiveAttack(userYGuess, userXGuess);
  if (comp.board.board[userYGuess][userXGuess] == "miss") {
    userBoxOfInterest.classList.add("miss");
  } else if (comp.board.board[userYGuess][userXGuess] != "empty") {
    userBoxOfInterest.classList.add("hit");
  }
  userBoxOfInterest.removeEventListener("click", guessClick);
  if (comp.board.checkForAllSunk() == true) {
    displayModal("User");
    //Method to remove all listeners
    return;
  }

  let compXGuess = Math.floor(Math.random() * 7);
  let compYGuess = Math.floor(Math.random() * 7);
  while (!user.board.receiveAttack(compYGuess, compXGuess)) {
    compXGuess = Math.floor(Math.random() * 7);
    compYGuess = Math.floor(Math.random() * 7);
  }

  let compYQuery = `[y-cord="` + compYGuess + `"]`;
  let compXQuery = `[x-cord="` + compXGuess + `"]`;
  let compBoxOfInterest = document
    .getElementById("player")
    .querySelectorAll(compYQuery)[0]
    .querySelectorAll(compXQuery)[0];

  if (user.board.board[compYGuess][compXGuess] == "miss") {
    compBoxOfInterest.classList.add("miss");
  } else if (comp.board.board[userYGuess][userXGuess] != "empty") {
    compBoxOfInterest.classList.add("hit");
  }
  if (user.board.checkForAllSunk() == true) {
    displayModal("Computer");
    //Method to remove all listeners
    return;
  }
}

function addGuessClick() {
  let parentDiv = document.getElementById("guess");
  let rows = parentDiv.getElementsByClassName("row");
  //let direction = document.getElementById('direction-radio').value;
  //Outer iterates through rows, inner through boxes in row
  for (let i = 1; i < rows.length; i++) {
    let curRow = rows[i];
    let curYCord = curRow.getAttribute("y-cord");
    for (let j = 1; j < curRow.childNodes.length; j++) {
      let curBox = curRow.childNodes[j];
      let curXCord = curBox.getAttribute("x-cord");
      curBox.addEventListener("click", guessClick);
    }
  }
}

function clearBoards() {
  shipIndex = 0;
  let userBoard = document.getElementById("player");
  let guessBoard = document.getElementById("guess");
  while (userBoard.firstChild) {
    userBoard.removeChild(userBoard.firstChild);
  }
  while (guessBoard.firstChild) {
    guessBoard.removeChild(guessBoard.firstChild);
  }
}

function displayModal(winner) {
  let modal = document.getElementById("display-winner-modal");
  let div = document.getElementById("winner-modal-text");
  modal.style.display = "block";
  div.innerHTML = "The winner is the " + winner;
}

function initializeButton() {
  let button = document.getElementById("play-again");
  let button3 = document.getElementById("okay-button");
  let button4 = document.getElementById("play-again-modal");
  let modal = document.getElementById("display-winner-modal");
  let modal2 = document.getElementById("how-to-play");
  button.addEventListener("click", playAgain);
  button3.addEventListener("click", function () {
    modal.style.display = "none";
  });

  button4.addEventListener("click", function () {
    modal.style.display = "none";
    playAgain();
  });

  document.getElementById("play-button").addEventListener("click", function () {
    modal2.style.display = "none";
  });
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }

    if (event.target == modal2) {
      modal2.style.display = "none";
    }
  };
}

export {
  emptyRender,
  placeShipListeners,
  addGuessClick,
  clearBoards,
  initializeButton,
};
