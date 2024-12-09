const puzzles = [
  [
    ["", "", "0", "", "", "1"],
    ["1", "", "0", "0", "", ""],
    ["", "1", "", "", "", ""],
    ["", "", "", "", "1", ""],
    ["", "", "1", "", "", "0"],
    ["0", "0", "", "1", "", ""],
  ],
  [
    ["", "1", "1", "", "", "1"],
    ["0", "0", "", "", "", ""],
    ["", "", "", "", "", ""],
    ["", "", "1", "", "", "0"],
    ["", "", "", "", "", ""],
    ["", "", "", "0", "", ""],
  ],
  [
    ["", "", "", "1", "", ""],
    ["", "", "0", "", "", "1"],
    ["0", "", "", "", "0", ""],
    ["", "1", "1", "", "", ""],
    ["", "", "", "", "", ""],
    ["1", "", "", "", "0", ""],
  ],
  [
    ["", "0", "", "", "", ""],
    ["", "", "", "", "", ""],
    ["1", "", "", "", "", ""],
    ["", "0", "", "", "0", ""],
    ["1", "", "", "0", "", ""],
    ["", "0", "", "", "", "0"],
  ],
];
// gets the DOM element so it can be used to listen for clicks
const board = document.querySelector(".board");
// gets the list of all rows (divs with the class of .row)
const allRows = board.querySelectorAll(".row");
// gets the list of all cells on the board
const cellsList = document.querySelectorAll(".col-2");
// uses the list of all rows to create an array,
// where each element is a NodeList representing div elements
const rowsList = [];
allRows.forEach((row) => {
  rowsList.push(row.querySelectorAll("div"));
});
// iterates through the list of all cells and disables pointer
// events on cells provided at the start of the game
cellsList.forEach((cell) => {
  if (!cell.innerText == "") {
    cell.setAttribute("style", "pointer-events: none; color: white;");
  }
});
// a helper function that takes a NodeList and converts it into
// an array using the spread operator and the .map method
function getArray(list) {
  return [...list].map((e) => e.innerText);
}
// handles clicks on each cell and changes the value of a cell between
// empty, '0', and '1'. This represents the main action observed on the board
function handleClick(e) {
  const cell = e.currentTarget;
  if (cell.innerText === "") {
    cell.innerText = "0";
  } else if (cell.innerText === "0") {
    cell.innerText = "1";
  } else if (cell.innerText === "1") {
    cell.innerText = "";
  }
}
// used to attach event listeners to all the cells
cellsList.forEach((cell) => {
  cell.addEventListener("click", handleClick);
});
// this is the main function that contains all the logic needed to track
// the progress of the game and checks whether all the conditions are
// fulfilled to consider the puzzle solved
function handleBoardClick() {
  // it iterates through the rowsList declared above and uses the helper
  // function getArray to populate the rows variable with the list of all
  // the rows in the form of arrays
  const rows = [];
  rowsList.forEach((row) => {
    rows.push(getArray(row));
  });
  // it iterates through a rows array from above and creates an array of all the columns
  const cols = [];
  for (let i = 0; i < rows.length; i++) {
    let row = rows[i];
    let col = [];
    for (let j = 0; j < row.length; j++) {
      col.push(rows[j][i]);
    }
    cols.push(col);
  }
  //   tracks whether all the conditions are met in the form of a boolean
  //   to determine if the puzzle is solved
  const score = [];
  //   a helper function that will be used when iterating through rows and columns
  //   to check if there are more than two cells in a row with the same value and
  //   updates the score variable with a false value if it finds three of the same in a row
  function threeInARow(array, value) {
    const indices = [];

    for (let i = 0; i < array.length; i++) {
      if (array[i] == value) {
        indices.push(i);
      }
    }

    for (let i = 0; i < indices.length - 2; i++) {
      if (
        indices[i + 1] - indices[i] == 1 &&
        indices[i + 2] - indices[i + 1] == 1
      ) {
        score.push(false);
      }
    }
  }
  //   checks if there is an equal amount of '0's and '1's in each row
  //   or column and updates the score variable accordingly

  function asMuchZerosAsOnes(array) {
    array.forEach((line) => {
      if (
        line.filter((x) => x == "0").length == line.length / 2 &&
        line.filter((x) => x == "1").length == line.length / 2
      ) {
        score.push(true);
      } else {
        score.push(false);
      }

      threeInARow(line, "0");
      threeInARow(line, "1");
    });
  }
  asMuchZerosAsOnes(rows);
  asMuchZerosAsOnes(cols);
  // checks if all conditions are fulfilled and declares the win
  let win;
  if (score.includes(false)) {
    win = false;
  } else {
    win = true;
  }
  // shows modal window
  const modalElement = document.querySelector(".modal");
  if (win) {
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }
}
const newGameButtons = document.querySelectorAll(".new-game");

let counter = 0;
function newPuzzle() {
  for (let i = 0; i < rowsList.length; i++) {
    for (let j = 0; j < rowsList[i].length; j++) {
      rowsList[i][j].innerText = puzzles[counter][i][j];
    }
  }
  cellsList.forEach((cell) => {
    cell.setAttribute("style", "pointer-events: all;");
  });
  cellsList.forEach((cell) => {
    if (!cell.innerText == "") {
      cell.setAttribute("style", "pointer-events: none; color: white;");
    }
  });
  counter++;

  newGameButtons.forEach((button) => {
    if (counter === puzzles.length) {
      button.setAttribute("disabled", true);
    }
  });
}

newGameButtons.forEach((button) => {
  button.addEventListener("click", newPuzzle);
});

// listens for clicks on the bord
board.addEventListener("click", handleBoardClick);
