//Micro:Net API
//You don't need to edit this file.

const socketURL = 'ws://micronet.local/gateway';

let socket;
let msgHandler = null;
let opnHandler = null;
let groupId = 0;
let identified = false;

const LogLevel = {
    OK: "[ \x1b[1m\x1b[32mOK\x1b[0m ]",
    ERROR: "[\x1b[1m\x1b[31mFAIL\x1b[0m]",
    INFO: "[\x1b[1m\x1b[33mINFO\x1b[0m]"
}

function log(level, msg) {
    console.log(`\x1b[1m\x1b[31m[Micro:Net]\x1b[0m ${level} ${msg}`);
}

function sendToMicroNet(message) {
    if (identified && socket.readyState == WebSocket.OPEN) {
        let data = { type: "forward", data: { message: message } };
        socket.send(JSON.stringify(data));
    } else {
        log(LogLevel.ERROR, "MicroNet isn't connected!");
    }
}

function connectWebSocket() {
    socket = new WebSocket(socketURL);
    log(LogLevel.INFO, "Connecting...");

    socket.onopen = function () {
        log(LogLevel.OK, 'Connected!');
        socket.send(JSON.stringify({ type: "identify", data: { nodeType: "client", group: groupId } }));
    };

    socket.onmessage = function (event) {
        const msg = JSON.parse(event.data);
        log(LogLevel.INFO, 'Received message from MicroNet');
        console.log(msg);
        if (!msg.success) {
            log(LogLevel.ERROR, msg.data.error);
            window.alert(msg.data.error);
            return;
        }

        switch (msg.type) {
            case "forward":
                if (typeof msgHandler == 'function') msgHandler(msg.data.message);
                break;
            case "identify":
                identified = true;
                if (typeof opnHandler == 'function') opnHandler();
                break;
        }
    };

    socket.onclose = function () {
        log(LogLevel.ERROR, 'Disconnected');
        setTimeout(connectWebSocket, 3000);
    };

    socket.onerror = function (error) {
        log(LogLevel.ERROR, 'Connection error');
    };
}

function connectToMicroNet(id, messageHandler, openedHandler) {
    groupId = id;
    msgHandler = messageHandler;
    opnHandler = openedHandler;
    connectWebSocket();
}
