const http = require('http');
const express = require('express');
const socketio = require('socket.io');
var users = [];
const app = express();

const clientPath = `${__dirname}/../client`;
console.log(`Serving static from ${clientPath}`);

app.use(express.static(clientPath));

const server = http.createServer(app);
const io = socketio(server);
const rooms = [];
var readyPlayers = [];
io.on('connection', function (sock) {
    console.log("someone connected");
    sock.emit('message', 'Hi. You are now connected!');
    sock.emit('connected', users);

    sock.on('message', function (text) {
        sock.broadcast.emit('message', text);
    });

    sock.on('new-user', function (name) {
        users.push({
            name: name,
            id: sock.id
        });
    });


    sock.on('createRoom', function (name) {
        var num = 1;
        while (rooms.filter(function (x) {
                return x.no == num
            })[0]) {
            num += 1;
        }
        rooms.push({
            no: num,
            players: [name]
        });
        sock.emit("message", "Room created successfully!  your room no. is " + num);
        sock.emit("room-created", num)
        sock.join(num)
        console.log(rooms);
    });

    sock.on('joinRoom', function (num) {
        if (rooms.filter(function (x) {
                return x.no == parseInt(num);
            })[0]) {
            var arr = rooms.filter(function (x) {
                return x.no == parseInt(num)
            })[0].players;
            arr.push(getNamebyID(sock.id));
            console.log(rooms);
            sock.join(parseInt(num));
            sock.emit("room-joined", num);
            io.to(getRoomByID(sock.id)).emit("message", getNamebyID(sock.id) + " joined the room.");
            if (arr.length > 2) {
                io.to(getRoomByID(sock.id)).emit("message", "there are more than 2 players in the game.2 random players will be chosen before each game")
            }
        } else {
            sock.emit("message", "room not found");
        }
    });

    sock.on("ready", function () {
        console.log("ready");
        if (readyPlayers.indexOf(getNamebyID(sock.id) < 0)) {
            console.log("ready1");
            readyPlayers.push(getNamebyID(sock.id));
            var allready = true;
            for (var i = 0; i < rooms.filter(function (x) {
                    return x.no == getRoomByID(sock.id)
                })[0].players.length; i++) {
                var roomplayer = rooms.filter(function (x) {
                    return x.no == getRoomByID(sock.id)
                })[0].players[i];
                if (readyPlayers.indexOf(roomplayer) < 0) {
                    console.log(roomplayer);
                    allready = false;
                }
            }
            if (allready) {
                console.log("allready");
                var luckyplayers = chooseRandomPlayers(rooms.filter(function (x) {
                    return x.no == getRoomByID(sock.id)
                })[0].players);
                io.to(getRoomByID(sock.id)).emit("message", luckyplayers[0] + " and " + luckyplayers[1] + " are playing this round");
                io.to(getRoomByID(sock.id)).emit("start", luckyplayers);
            }
        }
    });

    sock.on("send-chat", function (txt) {

        io.to(getRoomByID(sock.id)).emit("chat", [txt, getNamebyID(sock.id)]);
    });

    sock.on("played", function (board) {
        io.to(getRoomByID(sock.id)).emit("nextTurn", board);
    });

    sock.on("disconnect", function () {
        // var x = users.indexOf(users.filter(function (x) {
        //     return x.id = sock.id;
        // })[0]);
        // console.log(x);
        // if (readyPlayers.indexOf(getNamebyID(sock.id))) {
        //     readyPlayers.splice(readyPlayers.indexOf(getNamebyID(sock.id)), 1)
        // }
        // if (getRoomByID(sock.id)) {
        //     var arr = rooms.filter(function (x) {
        //         return x.id == getRoomByID(sock.id);
        //     })[0];
        //     if(arr){
        //     arr.players.splice(arr.players.indexOf(arr.players.filter(function (x) {
        //         x == getNamebyID(sock.id)
        //     })), 1);
        // }
        // }
        // if(users[x]){
        // users.splice(x, x + 1);
        // }
        console.log(users);
    });

    sock.on("gameOver", function () {
        io.to(getRoomByID(sock.id)).emit("message", getNamebyID(sock.id) + " has won the game");
        if(getRoom(sock.id)){
        var roomPlayers = getRoom(sock.id).players;
        for (var i = 0; i < readyPlayers.length; i++) {
            for (var x = 0; x < roomPlayers.length; x++) {
                if (roomPlayers[x] == readyPlayers[i]) {
                    readyPlayers.splice(readyPlayers.indexOf(roomPlayers[x], 1));
                }
            }
        }
    }
        io.to(getRoomByID(sock.id)).emit("gameDone");
    });





});

server.on('error', function (err) {
    console.log("server ERROR!! :    " + err);
});

function chooseRandomPlayers(arr) {
    var luck = Math.ceil(Math.random() * arr.length) - 1;
    var luck2 = Math.ceil(Math.random() * arr.length) - 1;
    while (luck2 == luck) {
        luck2 = Math.ceil(Math.random() * arr.length) - 1;
    }
    return [arr[luck], arr[luck2]];
}

function getNamebyID(id) {
    return users.filter(function (x) {
        return x.id == id
    })[0].name;
}

function getIDbyName(name) {
    return users.filter(function (x) {
        return x.name == name
    })[0].id;
}

function getRoomByID(id) {
    if (rooms.filter(function (x) {
            return x.players.filter(function (y) {
                return getIDbyName(y) == id
            })
        })[0].no) {
        return rooms.filter(function (x) {
            return x.players.filter(function (y) {
                return getIDbyName(y) == id
            })
        })[0].no;
    } else {
        return false;
    }
}

server.listen(2434, function () {
    console.log('server started!');
});

function getRoom(id){
    if (rooms.filter(function (x) {
        return x.players.filter(function (y) {
            return getIDbyName(y) == id
        })
    })[0].no) {
    return rooms.filter(function (x) {
        return x.players.filter(function (y) {
            return getIDbyName(y) == id
        })
    })[0];
} else {
    return false;
}
}