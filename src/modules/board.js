import user from "../index.js";

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
function emptyRender(div, player) {
  let parentDiv = document.getElementById(div);
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
      }

      if (j == 7 && i == 0) {
      } else {
        row.appendChild(box);
      }
    }
    parentDiv.appendChild(row);
  }
  console.log(parentDiv.getElementsByClassName("row")[1].childNodes[0]);
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
        player.board.board[curYCord - 1][curXCord - 1] !== "empty" &&
        player.board.board[curYCord - 1][curXCord - 1] !== "miss"
      ) {
        curBox.classList.add("ship");
      }
    }
  }
  removeAddShips();
  shipIndex++;
  placeShipListeners();
}

function placeShipListeners() {
  console.log(user);
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
      if (user.board.board[curYCord - 1][curXCord - 1] == "empty") {
        curBox.addEventListener("click", onAddShipClick);
      }
    }
  }
}

function onAddShipClick() {
  let direction = "horizontal";
  console.log(event.target);
  if (
    user.board.placeShip(
      direction,
      ships[shipIndex].name,
      ships[shipIndex].length,
      event.target.parentNode.getAttribute("y-cord") - 1,
      event.target.getAttribute("x-cord") - 1
    ) == true
  ) {
    refreshBoard("player", user);
  }
}
export { emptyRender, placeShipListeners };
