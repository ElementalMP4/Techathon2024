const config = require("./config.json");
const WebSocket = require('ws');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

let ws;
let serialPort;
let serialParser;

function createWebSocket() {
    ws = new WebSocket(config.websocket);

    ws.on('open', () => {
        console.log('Connected to WebSocket server');
    });

    ws.on('message', (data) => {
        console.log(`Received message from WebSocket: ${data}`);
        sendDataToSerial(data);
    });

    ws.on('error', (error) => {
        console.error(`WebSocket error: ${error.message}`);
    });

    ws.on('close', (code, reason) => {
        console.log(`WebSocket connection closed - Reconnecting in 3 seconds`);
        setTimeout(createWebSocket, 3000);
    });
}

function createSerialPort() {
    serialPort = new SerialPort({ path: config.devicePath, baudRate: config.baudRate });
    serialParser = serialPort.pipe(new ReadlineParser({ delimiter: '\r\n' }));

    serialPort.on('open', () => {
        console.log('Serial port is open');
    });

    serialParser.on('data', (data) => {
        console.log(`Received data from Serial port: ${data}`);
        sendMessage(data);
    });

    serialPort.on('error', (err) => {
        console.error(`Serial port error: ${err.message}`);
        setTimeout(createSerialPort, 3000);
    });
}

function sendMessage(message) {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(message);
        console.log(`Sent message to WebSocket: ${message}`);
    } else {
        console.warn('WebSocket not open. Message not sent.');
    }
}

function sendDataToSerial(data) {
    if (serialPort && serialPort.isOpen) {
        serialPort.write(data, (err) => {
            if (err) {
                console.error('Error writing to serial port:', err.message);
            }
        });
    } else {
        console.warn('Serial port not open. Data not sent.');
    }
}

createWebSocket();
createSerialPort();