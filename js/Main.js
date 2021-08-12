var ws = require("nodejs-websocket");
var UNetworkSystem = require("./Engine/Engine/NetworkSystem/Server/NetworkSystem");


var server = new UNetworkSystem.default();

server.init();

server._broadcast = function broadcast(ws, msg) {
    ws.connections.forEach(function (conn) {
        conn.sendText(msg)
    })
}

server.sendText = function (conn, msg) {
    conn.sendText(msg);
}

var ws = ws.createServer(function (conn) {
    server.onNewClient(conn);

    conn.on("connect", function () {
        console.log("Connection connect")
    })

    conn.on("text", function (str) {
        server.onReceive(conn, str);
    })

    conn.on("binary", function (inStream) {

        console.log("Connection inStream")
    })
    conn.on("pong", function (data) {

        console.log("Connection pong", data)
    })
    conn.on("error", function (err) {

        console.log("Connection error", err)
    })
    conn.on("close", function (code, reason) {
        server.onClose(conn, code, reason);
    })

}).listen(52312)
server.ws = ws;


ws.on("listening", () => {
    console.log("Server Listening");
})
ws.on("error", () => {
    console.log("Server error");
})
ws.on("close", () => {
    console.log("Server Close");
})
