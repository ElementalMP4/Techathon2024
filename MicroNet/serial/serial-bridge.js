const config = require("./config.json");
const WebSocket = require('ws');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const { LogLevel, log } = require("./logger");

const noSerial = config.noSerial || false;

let ws;
let serialPorts = new Map();

function forwardMessage(data) {
    log(LogLevel.INFO, `Forwarding to ${data.group}: ${data.message}`);
    sendDataToSerial(data.group, `${data.message}\r\n`);
}

function createWebSocket() {
    ws = new WebSocket(config.websocket);

    ws.on('open', () => {
        log(LogLevel.OK, 'Connected to WebSocket server');
        ws.send(JSON.stringify({ "type": "identify", "data": { nodeType: "bridge", channels: config.devices.map(d => d.channel) } }));
    });

    ws.on('message', (data) => {
        const msg = JSON.parse(data);

        if (!msg.success) {
            log(LogLevel.ERROR, "Source: " + msg.type + " Error: " + msg.data.error);
            return;
        }

        switch (msg.type) {
            case "forward":
                forwardMessage(msg.data);
                break;
        }

    });

    ws.on('error', (error) => {
        log(LogLevel.ERROR, `WebSocket error: ${error.message}`);
    });

    ws.on('close', (code, reason) => {
        log(LogLevel.ERROR, `WebSocket connection closed - Reconnecting in 3 seconds`);
        setTimeout(createWebSocket, 3000);
    });
}

function createSerialPort(device) {
    let serialPort = new SerialPort({ path: device.port, baudRate: config.baudRate });
    let serialParser = serialPort.pipe(new ReadlineParser({ delimiter: '\r\n' }));

    serialPort.on('open', () => {
        log(LogLevel.OK, 'Opened serial for channel ' + device.channel);
        sendDataToSerial(device.channel, `id ${device.channel}\r\n`);
    });

    serialParser.on('data', (data) => {
        log(LogLevel.INFO, `Received data from channel ${device.channel}: ${data}`);
        sendMessage({ type: "forward", data: { group: device.channel, message: data.trim() } });
    });

    serialPort.on('error', (err) => {
        log(LogLevel.ERROR, `Serial port error: ${err.message}`);
        setTimeout(() => createSerialPort(device), 3000);
    });

    if (serialPorts.has(device.channel)) serialPorts.delete(device.channel);
    serialPorts.set(device.channel, serialPort);
}

function sendMessage(message) {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
    } else {
        log(LogLevel.ERROR, 'WebSocket not open. Message not sent.');
    }
}

function sendDataToSerial(channel, data) {
    let serialPort = serialPorts.get(channel);
    if (serialPort && serialPort.isOpen) {
        serialPort.write(data, (err) => {
            if (err) {
                log(LogLevel.ERROR, `Error writing to ${channel}`, err.message);
            }
        });
    } else {
        if (config.logConnectionFaults) log(LogLevel.ERROR, `Channel ${channel} not open, cannot send data`);
    }
}

if (noSerial) {
    createWebSocket();
} else {
    createWebSocket();
    for (device of config.devices) {
        createSerialPort(device)
    }
}
