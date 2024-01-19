const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const morgan = require('morgan');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server: server, path: "/gateway" });

const connections = new Map();

app.use(morgan('dev'));
app.use(express.static('public'));

app.get("/", (req, res) => {
    res.redirect("/index.html");
});

wss.on('connection', (ws) => {
    const id = uuidv4();
    console.log(`New connection ${id}`);

    connections.set(id, ws);
    ws.on('message', (data) => {
        console.log(`${id}: ${data}`);
    });

    ws.on('close', () => {
        console.log(`Connection to ${id} lost`);
        connections.delete(id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});