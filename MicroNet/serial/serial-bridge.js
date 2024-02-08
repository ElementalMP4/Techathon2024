const config = require("./config.json");
const WebSocket = require('ws');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const noSerial = config.noSerial || false;

let ws;
let serialPorts = new Map();

function forwardMessage(data) {
    sendDataToSerial(data.group, data.message);
}

function createWebSocket() {
    ws = new WebSocket(config.websocket);

    ws.on('open', () => {
        console.log('Connected to WebSocket server');
        ws.send(JSON.stringify({ "type": "identify", "data": { nodeType: "bridge", channels: config.devices.map(d => d.channel) } }));
    });

    ws.on('message', (data) => {
        const msg = JSON.parse(data);

        if (!msg.success) {
            console.log("Source: " + msg.type + " Error: " + msg.data.error);
            return;
        }

        switch (msg.type) {
            case "forward":
                forwardMessage(msg.data);
                break;
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

function createSerialPort(device) {
    let serialPort = new SerialPort({ path: device.port, baudRate: config.baudRate });
    let serialParser = serialPort.pipe(new ReadlineParser({ delimiter: '\r\n' }));

    serialPort.on('open', () => {
        console.log('Opened serial for channel ' + device.channel);
        sendDataToSerial(device.channel, `id ${device.channel}\n`);
    });

    serialParser.on('data', (data) => {
        console.log(`Received data from channel ${device.channel}: ${data}`);
        sendMessage({ type: "forward", data: { group: device.channel, message: data.trim() } });
    });

    serialPort.on('error', (err) => {
        console.error(`Serial port error: ${err.message}`);
        setTimeout(() => createSerialPort(device), 3000);
    });

    if (serialPorts.has(device.channel)) serialPorts.delete(device.channel);
    serialPorts.set(device.channel, serialPort);
}

function sendMessage(message) {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
    } else {
        console.warn('WebSocket not open. Message not sent.');
    }
}

function sendDataToSerial(channel, data) {
    let serialPort = serialPorts.get(channel);
    if (serialPort && serialPort.isOpen) {
        serialPort.write(data, (err) => {
            if (err) {
                console.error(`Error writing to ${channel}`, err.message);
            }
        });
    } else {
        if (config.logConnectionFaults) console.warn(`Channel ${channel} not open, cannot send data`);
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
