var board = [
  [1, 0, 0, 0, 0, 0, 0, 0, 0],
  [2, 0, 0, 0, 0, 0, 0, 0, 0],
  [3, 0, 0, 0, 0, 0, 0, 0, 0],
  [4, 0, 0, 0, 0, 0, 0, 0, 0],
  [5, 0, 0, 0, 0, 0, 0, 0, 0],
  [6, 0, 0, 0, 0, 0, 0, 0, 0],
  [7, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0]
];
var solved = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0]
];

var impossible = {},
  impossiblearray, leftout = 81;
$("#reset").click(deleteall);
$("#solve").click(solve);

function deleteall() {
  $("td input").val("");
  document.querySelector("td input").style.color = "white";
  $("td input").css("font-size", "5vh");
  refreshque();
}

function refreshque() {
  for (var i = 0; i < 81; i++) {
    if ($("td:eq(" + i + ") input").val() == "" || $("td:eq(" + i + ") input").val() == null) {
      board[Math.floor(i / 9)][i % 9] = 0;
    } else {
      board[Math.floor(i / 9)][i % 9] = parseInt($("td:eq(" + i + ") input").val());
    }
  }
}

function refreshans() {
  for (var i = 0; i < 81; i++) {
    if (solved[Math.floor(i / 9)][i % 9] != board[Math.floor(i / 9)][i % 9]) {
      if (solved[Math.floor(i / 9)][i % 9].length == 1) {
        solved[Math.floor(i / 9)][i % 9] = parseInt(solved[Math.floor(i / 9)][i % 9]);
      }
      if (solved[Math.floor(i / 9)][i % 9] == 0) {
        $("td:eq(" + i + ") input").val("");
      } else {
        $("td:eq(" + i + ") input").val(solved[Math.floor(i / 9)][i % 9]);
        $("td:eq(" + i + ") input").css("font-size", "5vh");
      }
      document.querySelectorAll("td input")[i].style.color = "paleturquoise";
      if (solved[Math.floor(i / 9)][i % 9].length >= 2) {
        $("td:eq(" + i + ") input").css("font-size", "20px");
        $("td:eq(" + i + ") input").val(solved[Math.floor(i / 9)][i % 9].substr(1, solved[Math.floor(i / 9)][i % 9].length - 2));
        $("td:eq(" + i + ") input").css("overflow", "scroll");
      }
    }
  }
}

function duplicatearray() {
  for (var i = 0; i < 81; i++) {
    solved[Math.floor(i / 9)][i % 9] = board[Math.floor(i / 9)][i % 9];
  }
}

function find_empty(grid) {
  for (var vert = 0; vert < 9; vert++) {
    for (var horz = 0; horz < 9; horz++) {
      if (grid[vert][horz] == 0) {
        var vharray = [vert, horz];
        return vharray;
      }
    }
  }
  return false;
}

function validate(i, row, col, grid) {
  for (var vert = 0; vert < 9; vert++) {
    for (var horz = 0; horz < 9; horz++) {
      for (var i = 0; i < 9; i++) {
        if (grid[vert][horz] == grid[vert][i] && i != horz && grid[vert][horz] != 0) {
          return false;
        }
        if (grid[vert][horz] == grid[i][horz] && i != vert && grid[vert][horz] != 0) {
          return false;
        }
      }
      for (var ttttt = (Math.floor(vert / 3) * 3); ttttt < (Math.floor(vert / 3) * 3) + 3; ttttt++) {
        for (var uuuuu = (Math.floor(horz / 3) * 3); uuuuu < (Math.floor(horz / 3) * 3) + 3; uuuuu++) {
          if (grid[vert][horz] == grid[ttttt][uuuuu] && grid[vert][horz] != 0 && ((ttttt != vert || uuuuu != horz) || (ttttt != vert && uuuuu != horz))) {
            return false;
          }
        }
      }
    }
  }
  return true;
}

function solve(x) {
  refreshque()
  duplicatearray();
    if (questionvalid()) {
      if (solveSudoku()) {
        alert("SOLVED!!");
        refreshans()
      } else {
        alert("No solution found!");
      }
  } else {
    alert("invalid QUESTION!");
  }
}

function questionvalid() {
  for (var vert = 0; vert < 9; vert++) {
    for (var horz = 0; horz < 9; horz++) {
      if (!validate(board[vert][horz], vert, horz, board)) {
        return false;
      }
    }
  }
  return true;
}

function solveSudoku() {
  if (!find_empty(solved)) {
    return true;
  }
  for (var x = 1; x <= 9; x++) {
    var vharr = find_empty(solved);
    if (validate(x, vharr[0], vharr[1], solved)) {
      solved[vharr[0]][vharr[1]] = x;

      if (solveSudoku()) {
        return true;
      }
      solved[vharr[0]][vharr[1]] = 0;
    }
  }
  return false;
}
