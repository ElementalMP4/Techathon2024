//Micro:Net API
//You don't need to edit this file.

const socketURL = 'ws://localhost/micronet';

let socket;
let msgHandler = null;

const LogLevel = {
    OK: "[ \x1b[1m\x1b[32mOK\x1b[0m ]",
    ERROR: "[\x1b[1m\x1b[31mFAIL\x1b[0m]",
    INFO: "[\x1b[1m\x1b[33mINFO\x1b[0m]"
}

function log(level, msg) {
    console.log(`\x1b[1m\x1b[31m[Micro:Net]\x1b[0m ${level} ${msg}`);
}

function sendToMicroNet(msg) {
    if (socket.readyState == WebSocket.OPEN) {
        socket.send(msg);
    } else {
        log(LogLevel.ERROR, "MicroNet isn't connected!");
    }
}

function connectWebSocket() {
    socket = new WebSocket(socketURL);
    log(LogLevel.INFO, "Connecting...");

    socket.onopen = function () {
        log(LogLevel.OK, 'Connected!');
    };

    socket.onmessage = function (event) {
        const msg = event.data;
        log(LogLevel.INFO, 'Received message from MicroNet: ' + msg);
        msgHandler(msg);
    };

    socket.onclose = function () {
        log(LogLevel.ERROR, 'Disconnected');
        setTimeout(connectWebSocket, 3000);
    };

    socket.onerror = function (error) {
        log(LogLevel.ERROR, 'Connection error');
    };
}

function connectToMicroNet(messageHandler) {
    msgHandler = messageHandler;
    connectWebSocket();
}
