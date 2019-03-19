var ws = require("nodejs-websocket");

var PORT = 3000;

var clientCount = 0;

// Scream server example: "hi" -> "HI!!!"
var server = ws.createServer(function (conn) {
    console.log("New connection");

    // 用户名
    clientCount++;
    conn.nickname = 'user' + clientCount;

    // 定义一个消息对象
    var mes = {};
    mes.type = "enter";
    mes.data = conn.nickname + ' coms in';
    broadcast(JSON.stringify(mes));

    broadcast(conn.nickname + ' comes in');

    conn.on("text", function (str) {
        console.log("Received " + str);
        var mes = {};
        mes.type = "message";
        mes.data = conn.nickname + ' says: ' + str;
        broadcast(JSON.stringify(mes));
    });

    conn.on("close", function (code, reason) {
        console.log("Connection closed");
        var mes = {};
        mes.type = "leave";
        mes.data = conn.nickname + ' left';
        broadcast(JSON.stringify(mes));
    });

    conn.on("error", function (err) {
        console.log("handle err");
        console.log(err);
    })
}).listen(PORT);

console.log("websocket server listening on port " + PORT);

// 消息进行广播 📢
function broadcast(str) {
    server.connections.forEach(function (connection) {
        connection.sendText(str)
    })
}


