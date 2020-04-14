var board = [
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

$(document).ready(onload);
$("#reset").click(deleteall);
$("#solve").click(solve);
$("td input").keypress(limit);
$("td input").keyup(limit);

function limit(e) {
  var x = e.which || e.keycode;
  if (x == 16 || x == 9) {
    // console.log("SHIFT?TAB found ");
  } else {
    // this.disabled = "disabled";
    var lastval = $(this).val();
    var edited = false;
    if (parseInt($(this).val()) > 9) {
      $(this).val(9);
      edited = true;
    }
    if (parseInt($(this).val()) < 1) {
      $(this).val(1);
      edited = true;
    }
    if (parseInt($(this).val()) <= 9 && parseInt($(this).val()) > 0) {} else {
      $(this).val('');
      edited = true;
    }
    if (lastval != $(this).val()) {
      edited = true;
    }
    if (!edited) {
      $("table:eq(0) input").blur();
      $("table:eq(0) td:eq(" + (parseInt($($("table:eq(0) td input")).index(lastfocus)) + 1) + ") input").focus();
    }
    // this.disabled=false;
    refreshque();
    $(this).css("color", "white");
  }
}


function deleteall() {
  $("td input").val("");
  $("td input").css("color", "white");
  $("td input").css("font-size", "4vw");
  lastfocus = $("table:eq(0) td:eq(0) input");
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
        $("td:eq(" + i + ") input").css("font-size", "4vw");
      }
      document.querySelectorAll("td input")[i].style.color = "#7cc0de";
      if (solved[Math.floor(i / 9)][i % 9].length >= 2) {
        $("td:eq(" + i + ") input").css("font-size", "4vw");
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
  for (var pickingnoinvalidate = 0; pickingnoinvalidate < 9; pickingnoinvalidate++) {
    if (i == grid[row][pickingnoinvalidate] && pickingnoinvalidate != col && i != 0) {
      // console.log("ROW row: " + row + " col: " + col + " row: " + row + " col: " + col + " i: " + pickingnoinvalidate);
      return false;
    }
    if (i == grid[pickingnoinvalidate][col] && pickingnoinvalidate != row && i != 0) {
      // console.log("COLUMN row: " + row + " col: " + col + " row: " + row + " col: " + col + " i: " + pickingnoinvalidate);
      return false;
    }
  }
  for (var ttttt = (Math.floor(row / 3) * 3); ttttt < (Math.floor(row / 3) * 3) + 3; ttttt++) {
    for (var uuuuu = (Math.floor(col / 3) * 3); uuuuu < (Math.floor(col / 3) * 3) + 3; uuuuu++) {
      if (i == grid[ttttt][uuuuu] && i != 0 && ((ttttt != row || uuuuu != col) || (ttttt != row && uuuuu != col))) {
        // console.log("BOX row: " + row + " col: " + col + " row: " + row + " col: " + col + " i: " + pickingnoinvalidate);
        return false;
      }
    }
  }
  return true;
}

function solve() {
  refreshque();
  duplicatearray();
  if (questionvalid()) {
    $("#loading").css("display", "block");
    if (solveSudoku()) {
      alert("SOLVED!!");
      refreshans();
      $("#loading").css("display", "none");
    } else {
      alert("No solution found!");
      $("#loading").css("display", "none");
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
  var vharr = find_empty(solved);
  for (var x = 1; x <= 9; x++) {
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

function onload() {
  $("#loading").css("display", "none");
  // for(var i =0;i<9;i++){
  $("table:eq(1) td:eq(0)").click(function() {
    numpad(1);
  });
  $("table:eq(1) td:eq(1)").click(function() {
    numpad(2);
  });
  $("table:eq(1) td:eq(2)").click(function() {
    numpad(3);
  });
  $("table:eq(1) td:eq(3)").click(function() {
    numpad(4);
  });
  $("table:eq(1) td:eq(4)").click(function() {
    numpad(5);
  });
  $("table:eq(1) td:eq(5)").click(function() {
    numpad(6);
  });
  $("table:eq(1) td:eq(6)").click(function() {
    numpad(7);
  });
  $("table:eq(1) td:eq(7)").click(function() {
    numpad(8);
  });
  $("table:eq(1) td:eq(8)").click(function() {
    numpad(9);
  });
  $("table:eq(1) td:eq(9)").click(function() {
    // for (var i = 0; i < 81; i++) {
    //   if ($("td:eq(" + i + ") input").is(lastfocus)) {
    //     $("table:eq(0) input").blur();
    //     $("td:eq(" + i + ") input").css("background-color", "black");
    //     $("td:eq(" + (i - 1) + ") input").focus();
    //     refreshque()
    //     break;
    //   }
    // }
    $("table:eq(0) input").blur();
    $("table:eq(0) td:eq(" + (parseInt($($("table:eq(0) td input")).index(lastfocus)) - 1) + ") input").focus();

  });
  $("table:eq(1) td:eq(10)").click(function() {
    // for (var i = 0; i < 81; i++) {
    //   if ($("td:eq(" + i + ") input").is(lastfocus)) {
    //     $("table:eq(0) input").blur();
    //     $("td:eq(" + i + ") input").css("background-color", "black");
    //     $("td:eq(" + (i + 1) + ") input").focus();
    //     refreshque()
    //     break;
    //   }
    // }
    $("table:eq(0) input").blur();
    $("table:eq(0) td:eq(" + (parseInt($($("table:eq(0) td input")).index(lastfocus)) + 1) + ") input").focus();
  });
  $("table:eq(1) td:eq(11)").click(function() {
    lastfocus.val("");
    lastfocus.focus();
    refreshque();
  });
  // }
}
var lastfocus = $("table:eq(0) td:eq(0) input");
$("table:eq(0) input").focus(function() {
  lastfocus = $(this);
});
$("table:eq(0) input").on("change", limit);

function numpad(i) {
  if (lastfocus) {
    lastfocus.val(i);
    lastfocus.trigger("change");
    console.log("case1: " + i);
  } else {
    $("table:eq(0) td:eq(0) input").val(i);
    $("table:eq(0) td:eq(0) input").trigger("change", limit);
    console.log("case2: " + i);
  }
}
