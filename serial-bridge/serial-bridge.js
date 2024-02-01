const config = require("./config.json");
const WebSocket = require('ws');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

let ws;
let serialPorts = new Map();

function createWebSocket() {
    ws = new WebSocket(config.websocket);

    ws.on('open', () => {
        console.log('Connected to WebSocket server');
        ws.send(JSON.stringify({ "type": "identify", "data": { nodeType: "command", width: config.layout.width, height: config.layout.height } }));
    });

    ws.on('message', (data) => {
        console.log(`Received message from WebSocket: ${data}`);
        const payload = JSON.parse(data);
        if (payload.type == "game-update") {

            if (payload.data.width != config.layout.width || payload.data.height != config.layout.height) {
                console.error("Received non-matching width or height parameters. Ignoring");
                return;
            }
            let fieldSize = payload.data.width * payload.data.height;
            for (microbit = 0; microbit < fieldSize; microbit++) {
                let frame = payload.data.frames[microbit];
                sendDataToSerial(config.devices[microbit], `${frame.map(row => row.join('')).join(',')}\n`);
            }
        }
    });

    ws.on('error', (error) => {
        console.error(`WebSocket error: ${error.message}`);
    });

    ws.on('close', (code, reason) => {
        console.log(`WebSocket connection closed - Reconnecting in 3 seconds`);
        setTimeout(createWebSocket, 3000);
    });
}

function createSerialPort(path) {
    let serialPort = new SerialPort({ path: path, baudRate: config.baudRate });
    let serialParser = serialPort.pipe(new ReadlineParser({ delimiter: '\r\n' }));

    serialPort.on('open', () => {
        console.log('Serial port is open on ' + path);
    });

    serialParser.on('data', (data) => {
        console.log(`Received data from serial: ${data}`);
        sendMessage(data);
    });

    serialPort.on('error', (err) => {
        console.error(`Serial port error: ${err.message}`);
        setTimeout(() => createSerialPort(path), 3000);
    });

    if (serialPorts.has(path)) serialPorts.delete(path);
    serialPorts.set(path, serialPort);
}

function sendMessage(message) {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "microbit", data: { msg: message } }));
        console.log(`Sent message to WebSocket: ${message}`);
    } else {
        console.warn('WebSocket not open. Message not sent.');
    }
}

function sendDataToSerial(port, data) {
    let serialPort = serialPorts.get(port);
    if (serialPort && serialPort.isOpen) {
        serialPort.write(data, (err) => {
            if (err) {
                console.error(`Error writing to ${port}`, err.message);
            }
        });
    } else {
        console.warn('Serial port not open. Data not sent.');
    }
}

if (config.devices.length != config.layout.height * config.layout.width) {
    console.log("Height and width parameters in config do not equal number of serial devices");
} else {
    createWebSocket();
    for (path of config.devices) {
        createSerialPort(path)
    }
}