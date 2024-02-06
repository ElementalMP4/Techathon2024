const config = require("./config.json");
const WebSocket = require('ws');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

let ws;
let serialPort;

function handleGameUpdate(data) {
    if (data.width != config.layout.width || data.height != config.layout.height) {
        console.error("Received non-matching width or height parameters. Ignoring");
        return;
    }
    let fieldSize = data.width * data.height;
    for (microbit = 0; microbit < fieldSize; microbit++) {
        let frame = data.frames[microbit];
        sendDataToSerial(`dsp ${microbit} ${frame.map(row => row.join('')).join(",")}\n`);
    }
}

function showDisplayLayout(data) {
    for (microbit = 0; microbit < config.devices.length; microbit++) {
        if (data.display == "on") sendDataToSerial(config.devices[microbit], `lyt on ${microbit}\n`);
        else sendDataToSerial(config.devices[microbit], `lyt off\n`);
    }
}

function createWebSocket() {
    ws = new WebSocket(config.websocket);

    ws.on('open', () => {
        console.log('Connected to WebSocket server');
        ws.send(JSON.stringify({ "type": "identify", "data": { nodeType: "command", width: config.layout.width, height: config.layout.height } }));
    });

    ws.on('message', (data) => {
        console.log(`Received message from WebSocket: ${data}`);
        const payload = JSON.parse(data);
        switch (payload.type) {
            case "game-update":
                handleGameUpdate(payload.data);
                break;
            case "display-layout":
                showDisplayLayout(payload.data);
                break;
        }

    });

    ws.on('error', (error) => {
        console.error(`WebSocket error: ${error.message}`);
    });

    ws.on('close', (code, reason) => {
        if (config.logConnectionFaults) console.log(`WebSocket connection closed - Reconnecting in 3 seconds`);
        setTimeout(createWebSocket, 3000);
    });
}

function createSerialPort() {
    serialPort = new SerialPort({ path: config.serialPort, baudRate: config.baudRate });
    let serialParser = serialPort.pipe(new ReadlineParser({ delimiter: '\n' }));

    serialPort.on('open', () => {
        console.log('Serial port is open');
    });

    serialParser.on('data', (data) => {
        console.log(`Received data from serial: ${data}`);
        sendMessage(data);
    });

    serialPort.on('error', (err) => {
        if (config.logConnectionFaults) console.error(`Serial port error: ${err.message}`);
        setTimeout(() => createSerialPort(path), 3000);
    });
}

function sendMessage(message) {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "microbit", data: { msg: message } }));
        console.log(`Sent message to WebSocket: ${message}`);
    } else {
        console.warn('WebSocket not open. Message not sent.');
    }
}

function sendDataToSerial(data) {
    if (serialPort && serialPort.isOpen) {
        console.log(data);
        serialPort.write(data, (err) => {
            if (err) {
                console.error(`Error writing to ${port}`, err.message);
            }
        });
    } else {
        if (config.logConnectionFaults) console.warn('Serial port not open. Data not sent.');
    }
}

createWebSocket();
createSerialPort()