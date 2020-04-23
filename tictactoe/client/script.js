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
  global();
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
  var z = (x + y) / 2
  $("#content table").css("transform", "rotateZ(" + (180 - (y * 10)) + "deg) rotateX(" + 0 + "deg) rotateY(" + (10 - (x * 10)) + "deg)");
  // $("#content table").css("transform", "rotateY(" + (180 - (x * 20)) + "deg)");
});
$("#content #main").mouseout(function () {
  $("#content table").css("transform", "rotateY(0deg) rotateZ(180deg)");
  // $("#content table").css("transform", "rotateZ(180deg) rotateX(180deg)");
})

function select(what) {
  avatar.ai = avatar.human;
  avatar.human = what == 'X' ? "✘" : '◯';
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

function inprogress() {
  $("#inprogress").slideDown();
  $("#content").addClass('blur');
  setTimeout(function () {
    reset();
    $("#content").removeClass('blur');
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
  if (avatar.ai == '✘' && gameState != "running") {
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

function global() {
  connectToPlayer();
}


function createModal(type, text) {
  if (type == "message") {
    alert(text);
  } else if (type == "prompt") {
    var q = prompt(text);
    return q;
  }
}
//after creating Server.js
function writeEvent(x) {
  alert(x);
}
var room = {
  status: false
};
var sock = io();
sock.on('message', writeEvent);

var name;
//create material modals and messages;
//add options to create and join rooms;
function connectToPlayer() {
  let ans = createModal("prompt", "Do you want to create a room?");
  if (ans == "yes") {
    sock.emit("createRoom", name);
  } else {
    let num = createModal("prompt", "Enter room no.");
    sock.emit("joinRoom", num);
  }
}

sock.on("connected", function (users) {
  name = prompt("What would you like your username to be?");
  while (users.filter(function (x) {
      return x.name == name;
    })[0]) {
    name = prompt("That username is already in use. What would you like your username to be?");
  }
  sock.emit('new-user', name);
})

sock.on("room-created", function (num) {
  room = {
    status: true,
    no: num
  };
  enterRoomMode();
});

sock.on("room-joined", function (num) {
  room = {
    status: true,
    no: num
  };
  enterRoomMode();
});

sock.on("chat", function (text) {
  var txt = $("<span></span>");
  $("#chatbox").append($(txt));
  $("#chatbox").append($("<br>"));
  $(txt).html((text[1] == name ? "You: " : text[1] + ": ") + text[0]);
  if (text[1] == name) {
    $(txt).css("color", "#B2FF65");
  } else {
    $(txt).css("color", "white");
  }
});

document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();
  var message = $("#message").val();
  if (message == "ready") {
    sock.emit("ready");
  }
  if (message != "" && message.replace(/\s/g, '').length >= 1) {
    sock.emit("send-chat", message);
    $("#message").val('');
  }
})

var prevChance = false;
var token = {
  self: 'X',
  player: 'O'
};

function enterRoomMode() {
  disableonclick();
  reset();
  //set new onclick values
  mode = "global";
  $("#options").fadeOut();
  setTimeout(function () {
    $("#roommode").css("display", "flex");
    $("#roommode").css("margin-top", "-50vh");
    $("#roommode").animate({
      opacity: 1,
      marginTop: 0
    });


  }, 200);
}
var players = [];
sock.on("start", function (play) {
  players = [...play];
  reset();
  board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ];
  if (play[0] == name) {
    token = {
      self: 'X',
      player: 'O'
    };
    setclickvalues();
  } else {
    token = {
      self: 'O',
      player: 'X'
    };
  }
});

sock.on("gameDone", function () {
  reset();
  disableclickvalues();
  createModal("message", "The game has ended. Everyone shall type ready to start next round.");
})

var prevChance = false;
sock.on("nextTurn", function (grid) {
  refreshGridToBoard(grid);
  if ((players[0] == name || players[1] == name) && !prevChance) {
    setclickvalues();
  } else if (prevChance) {
    prevChance = false;
  }
  gameOver();
});

function refreshGridToBoard(grid) {
  for (var vert = 0; vert < 3; vert++) {
    for (var horz = 0; horz < 3; horz++) {
      $("#content table tr:eq(" + vert + ") td:eq(" + horz + ")").html(grid[vert][horz]);
      board[vert][horz] = grid[vert][horz];
    }
  }
}

function setclickvalues() {
  for (let i = 0; i < 9; i++) {
    $("#content table td:eq(" + i + ")").click(function () {
      play(i);
    });
  }
}

function play(no) {
  if (!prevChance) {
    if (board[Math.floor(no / 3)][no % 3] == '' && $("#content table td:eq(" + no + ")").html() == '') {
      $("#content table td:eq(" + no + ")").html(token.self);
      prevChance = true;
      board[Math.floor(no / 3)][no % 3] = token.self;
      console.log(board);

      sock.emit("played", board);
      disableclickvalues();
      prevChance = true;
    }
  }
  gameOver();
}

function disableclickvalues() {
  $("#content table td").unbind("click");
}

function gameEnd() {
  for (var i = 0; i < 3; i++) {
    if (allsame(board[i][1], board[i][2], board[i][0])) {
      return [i, 1, i, 2, i, 0];
    }
    if (allsame(board[0][i], board[1][i], board[2][i])) {
      return [0, 1, 1, i, 2, i];
    }
  }
  if (allsame(board[0][0], board[1][1], board[2][2])) {
    return [0, 0, 1, 1, 2, 2];
  }
  if (allsame(board[0][2], board[1][1], board[2][0])) {
    return [0, 2, 1, 1, 2, 0];
  }
  var tie = true;
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      if (board[i][j] == '') {
        tie = false;
      }
    }
  }
  return tie;
}

function gameOver() {
  var winner;
  if (typeof gameEnd()[1] == "number") {
    var arr = gameEnd();
    if (board[arr[0]][arr[1]] == token.self) {
      winner = board[arr[0]][arr[1]];
      color = "#7281E8";
    } else {
      color = "#EB5349";
    }
    for (var i = 0; i < 3; i++) {
      $("#content table tr:eq(" + arr[((i * 2))] + ") td:eq(" + arr[((i * 2) + 1)] + ")").css("color", color)
    }
  }
  if (gameEnd() == true && prevChance) {
    setTimeout(function () {
      sock.emit("Tie");
    }, 3000);
  } else if (gameEnd()[1] && prevChance) {
    setTimeout(function () {
      sock.emit("gameOver");
    }, 6000);
  }
}