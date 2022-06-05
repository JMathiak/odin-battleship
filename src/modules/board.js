function emptyRender(div) {
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
}

export default emptyRender;
