var board = [
  ['', '', ''],
  ['', '', ''],
  ['', '', '']
];

var avatar = {
  human: "O",
  ai: "X"
};

$(document).ready(onload);
$("#play").on("click", startGame);
$("#reset").on("click", reset);
$("#restart").on("click", restart)
$("#X").click(function() {
  select('X')
});
$("#O").click(function() {
  select('O')
});

function select(what) {
  avatar.ai = avatar.human;
  avatar.human = what;
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


function onload() {
  reset();
  startGame();
  // setonclick();
}

function restart() {
  reset();
  startGame();
}

function reset() {
  board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ];
  $(".cells").html('');
  $(".cells").css("background-color", "black");
  disableonclick();
}

function setonclick() {
  for (let i = 0; i < 9; i++) {
    $($(".cells")[i]).click(function() {
      type(avatar.human, i);
      if (!checkWinner()) {
        playai();
      } else {
        gameOver();
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
  $($(".cells")[value]).html(player);
  board[Math.floor((value) / 3)][(value) % 3] = player;
}

function typeforai(vert, horz, value) {
  console.log(board[vert][horz]);
  board[vert][horz] = value ? value : avatar.ai;
  $($(".cells")[(vert * 3) + horz]).html(value ? value : avatar.ai);
}

function startGame() {
  setonclick();
  if (avatar.ai == "X") {
    playai();
  }
}

function playai() {
  console.log("called");
  //AI's move
  let prevBoard = {};
  let bestScore = -Infinity;
  let bestMove = {};
  loop:
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
      return 100 - depth;
    } else if (result == avatar.human) {
      //human won
      return -100 + depth;
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
          let score = minimax(board, depth + 1, true);
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
          let score = minimax(board, depth + 1, false);
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
      bgcolor = "rgba(244, 67, 54, 0.53)";
    } else {
      bgcolor = "rgba(76, 175, 80, 0.56)";
    }
    for (var i = 0; i < 3; i++) {
      let val = (gameState.index[i][0] * 3) + gameState.index[i][1];
      $(document.querySelectorAll(".cells")[val]).css("background-color", bgcolor);
    }
  }
}
