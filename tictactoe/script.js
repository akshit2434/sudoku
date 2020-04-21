var board = [
  ['', '', ''],
  ['', '', ''],
  ['', '', '']
];

var avatar = {
  human: "◯",
  ai: "✘"
};

var aimode = true;

var mode = "ai";

var level = "kid";

var gameState = "paused";

$(document).ready(onload);
$("#play").on("click", startGame);
$("#reset").on("click", reset);
$("#restart").on("click", restart)
$("#X").click(function () {
  select('X')
});
$("#O").click(function () {
  select('O')
});
$("#silly").click(function () {
  level = "silly";
  reset();
  startGame();
  $("#silly").addClass('selectedlvl');
  $("#kid").removeClass('selectedlvl');
  $("#pro").removeClass('selectedlvl');
});
$("#kid").click(function () {
  level = "kid";
  reset();
  startGame();
  $("#silly").removeClass('selectedlvl');
  $("#kid").addClass('selectedlvl');
  $("#pro").removeClass('selectedlvl');
});
$("#pro").click(function () {
  level = "pro";
  reset();
  startGame();
  $("#silly").removeClass('selectedlvl');
  $("#kid").removeClass('selectedlvl');
  $("#pro").addClass('selectedlvl');
});
//GAME MODES
$("#ai").click(function () {
  mode = "ai";
  $("#multiplayer").removeClass("selectedmode");
  $("#global").removeClass("selectedmode");
  $("#ai").addClass("selectedmode");
  reset();
  startGame();
});
$("#multiplayer").click(function () {
  mode = "local";
  $("#ai").removeClass("selectedmode");
  $("#global").removeClass("selectedmode");
  $("#multiplayer").addClass("selectedmode");
  reset();
  startGame();
});
$("#global").click(function () {
  mode = "global";
  inprogress();
  $("#ai").removeClass("selectedmode");
  $("#multiplayer").removeClass("selectedmode");
  $("#global").addClass("selectedmode");
  reset();
  startGame();
});

$("#content #main").mousemove(function () {
  var x = (event.pageX - $("#content table").offset().left - 2) / 510;
  var y = (event.pageY - $("#content table").offset().top - 1) / 510;
  // console.log(y);

  x = x < 0 ? 0 : x;
  y = y < 0 ? 0 : y;
  x = x > 1 ? 1 : x;
  y = y > 1 ? 1 : y;
  x = (x * 2) - 1;
  y = (y * 2) - 1;
  var z = (x+y)/2
  $("#content table").css("transform", "rotateZ(" + (180-(y * 10)) + "deg) rotateX("+0+"deg) rotateY(" + (10-(x * 10)) + "deg)");
  // $("#content table").css("transform", "rotateY(" + (180 - (x * 20)) + "deg)");
});
$("#content #main").mouseout(function () {
  $("#content table").css("transform", "rotateY(0deg) rotateZ(180deg)");
  // $("#content table").css("transform", "rotateZ(180deg) rotateX(180deg)");
})

function select(what) {
  avatar.ai = avatar.human;
  avatar.human = what=='X'?"✘":'◯';
  if (what == 'X') {
    $("#X").addClass('selected');
    $("#O").removeClass('selected');
  } else {
    $("#O").addClass('selected');
    $("#X").removeClass('selected');
  }
  reset();
  startGame();
}

function inprogress(){
  $("#inprogress").slideDown();
  setTimeout(function () {
    reset();
    $("#inprogress").fadeOut();
    $("#ai").click()
  }, 3000);
}

function onload() {
  reset();
  startGame();
  // setonclick();
}

function restart() {
  reset();
  startGame();
}
var prevMode = false;

function reset() {
  board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ];
  $(".cells").html('');
  gameState = "paused";
  $(".cells").css("background-color", "inherit");
  disableonclick();
}

function setonclick() {
  for (let i = 0; i < 9; i++) {
    $($(".cells")[i]).click(function () {
      let charac = avatar.human;
      if (mode != "ai") {
        charac = prevMode ? avatar.ai : avatar.human;
        prevMode = !prevMode;
      }
      if (type(charac, i)) {
        if (!checkWinner()) {
          if (mode == "ai") {
            playai();
          }
        } else {
          prevMode = false;
          gameOver();
        }
      }
    });
    // $($(".cells")[i]).click(function() {
    //   type(avatar.human, i);
    //   playai()
    // })
  }
}

function disableonclick() {
  for (var i = 0; i < 9; i++) {
    // $($(".cells")[i]).off("click.type");
    $($(".cells")[i]).unbind('click');
  }
}

function type(player, value) {
  if ($($(".cells")[value]).html() == '') {
    $($(".cells")[value]).html(player);
    $($(".cells")[value]).css("color", player == avatar.human ? "#7281E8" : "#EB5349");
    board[Math.floor((value) / 3)][(value) % 3] = player;
    return true;
  } else {
    return false;
  }
}

function typeforai(vert, horz, value) {
  board[vert][horz] = value ? value : avatar.ai;
  $($(".cells")[(vert * 3) + horz]).html(value ? value : avatar.ai);
  $($(".cells")[(vert * 3) + horz]).css("color", "#EB5349")
}

function startGame() {
  disableonclick();
  setonclick();
  if (gameState != "running") {
    if (mode == "ai")
      playai();
    gameState = "running";
  }
}

function playai() {
  //AI's move
  let prevBoard = {};
  let bestScore = -Infinity;
  let bestMove = {};
  for (var vert = 0; vert < 3; vert++) {
    for (var horz = 0; horz < 3; horz++) {
      if (board[vert][horz] == "") {
        board[vert][horz] = avatar.ai;
        let score = minimax(board, 0, false);
        board[vert][horz] = "";
        if (score > bestScore) {
          bestScore = score;
          bestMove = {
            vert: vert,
            horz: horz
          }
        }
      }
    }
  }
  typeforai(bestMove.vert, bestMove.horz, avatar.ai);
  if (checkWinner()) {
    gameOver();
  }
}


function minimax(board, depth, isMaximising) {
  let result = checkWinner();
  var score = null;
  if (result != null) {
    if (result == avatar.ai) {
      //ai won
      if (level != "silly") {
        return 100 - depth;
      } else {
        return -100 + depth
      }
    } else if (result == avatar.human) {
      //human won
      if (level != "silly") {
        return -100 + depth;
      } else {
        return 100 - depth;
      }
    } else if (result == "tie") {
      //TIE
      return 0
    }
  }
  let bestScore;
  if (isMaximising) {
    bestScore = -Infinity;
    for (var vert = 0; vert < 3; vert++) {
      for (var horz = 0; horz < 3; horz++) {
        if (board[vert][horz] == '') {
          board[vert][horz] = avatar.ai;
          let score = minimax(board, depth + 1, level == "kid" ? true : false);
          board[vert][horz] = '';
          if (score > bestScore) {
            bestScore = score;
          }
        }
      }
    }
    return bestScore;
  } else {
    bestScore = Infinity;
    for (var vert = 0; vert < 3; vert++) {
      for (var horz = 0; horz < 3; horz++) {
        if (board[vert][horz] == '') {
          board[vert][horz] = avatar.human;
          let score = minimax(board, depth + 1, true);
          board[vert][horz] = '';
          if (score < bestScore) {
            bestScore = score;
          }
        }
      }
    }
    return bestScore;
  }
}


function checkWinner(vip) {
  if (vip) {
    for (var vert = 0; vert < 3; vert++) {
      if (allsame(board[vert][0], board[vert][1], board[vert][2])) {
        return {
          player: board[vert][0],
          index: [
            [vert, 0],
            [vert, 1],
            [vert, 2]
          ]
        };
      }
      if (allsame(board[0][vert], board[1][vert], board[2][vert])) {
        return {
          player: board[0][vert],
          index: [
            [0, vert],
            [1, vert],
            [2, vert]
          ]
        };
      }
    }
    if (allsame(board[0][0], board[1][1], board[2][2])) {
      return {
        player: board[0][0],
        index: [
          [0, 0],
          [1, 1],
          [2, 2]
        ]
      };
    }
    if (allsame(board[0][2], board[1][1], board[2][0])) {
      return {
        player: board[2][0],
        index: [
          [0, 2],
          [1, 1],
          [2, 0]
        ]
      };
    }
    if (!find_empty()) {
      return "tie";
    }
  } else {
    for (var vert = 0; vert < 3; vert++) {
      if (allsame(board[vert][0], board[vert][1], board[vert][2])) {
        return board[vert][0];
      }
      if (allsame(board[0][vert], board[1][vert], board[2][vert])) {
        return board[0][vert];
      }
    }
    if (allsame(board[0][0], board[1][1], board[2][2])) {
      return board[0][0];
    }
    if (allsame(board[0][2], board[1][1], board[2][0])) {
      return board[1][1];
    }
    if (!find_empty()) {
      return "tie";
    }
    return null;
  }
}

function allsame(a, b, c) {
  if (a == b && b == c && a != '') {
    return true;
  }
  return false;
}

function find_empty() {
  for (var vert = 0; vert < 3; vert++) {
    for (var horz = 0; horz < 3; horz++) {
      if (board[vert][horz] == "") {
        return true;
      }
    }
  }
  return false;
}

function gameOver() {
  disableonclick();
  var gameState = checkWinner(true);
  var bgcolor;
  if (gameState != "tie") {
    if (gameState.player == avatar.ai) {
      bgcolor = "rgba(244, 67, 54, 0.13)";
    } else {
      bgcolor = "rgba(76, 175, 80, 0.16)";
    }
    for (var i = 0; i < 3; i++) {
      let val = (gameState.index[i][0] * 3) + gameState.index[i][1];
      $(document.querySelectorAll(".cells")[val]).css("background-color", bgcolor);
    }
  }
}