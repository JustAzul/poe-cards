const express = require('express');
const http = require('http');
const SocketIO = require('socket.io');
const app = express();
const next = require("next");

const Server = http.createServer(app);
const IO = SocketIO(Server);

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

const ServerPort = 80;

process.nextTick(async () => {
    await nextApp.prepare();

    app.get("*", (req, res) => {
        return nextHandler(req, res);
    });

    Server.listen(ServerPort, () => {
        console.log(`> Listening on ${ServerPort}`);
    });

});

IO.sockets.on("connection", Socket => {
    console.log(`> [${Socket['id']}] New Connection!`);

    //Socket.on("LeagueSelect", console.log);

    Socket.once('disconnect', () => {
        console.log(`> [${Socket['id']}] Disconnected`);
    })

    //Socket.emit("ping", "cu depilado");
});