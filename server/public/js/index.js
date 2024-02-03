const socket = new WebSocket(`ws://${location.host}/gateway`);

const messageModal = document.getElementById("message-modal");
const messageModalTitle = document.getElementById("message-modal-title");
const messageModalContent = document.getElementById("message-modal-content");

const microbitCount = document.getElementById("mbit-count");
const displayWidth = document.getElementById("display-width");
const displayHeight = document.getElementById("display-height");
const gameRunning = document.getElementById("game-running");

const simulator = document.getElementById("simulator");
const designer = document.getElementById("designer");

var layout = null;

function send(data) {
    if (socket.readyState == WebSocket.OPEN) socket.send(JSON.stringify(data));
}

function refresh() {
    send({ type: "status", data: {} });
}

function getDesignedBoard() {
    var result = [];
    for (var i = 0, row; row = designer.rows[i]; i++) {
        var rowArray = [];
        for (var j = 0, cell; cell = row.cells[j]; j++) {
            rowArray.push(cell.classList.contains("on") ? 1 : 0);
        }
        result.push(rowArray);
    }
    return result;
}

function start() {
    let board = getDesignedBoard();
    let data = {};
    let onCount = 0;

    for (row of board) {
        onCount += row.reduce((a, b) => a + b, 0);
    }

    if (onCount > 0) data = { board: board };
    send({ type: "start", data: data });
    refresh();
}

function stop() {
    send({ type: "stop", data: {} });
    refresh();
}

function showMessage(title, message) {
    messageModalTitle.textContent = title;
    messageModalContent.textContent = message;
    messageModal.style.display = "block";
}

function hideMessage() {
    messageModalTitle.textContent = "";
    messageModalContent.textContent = "";
    messageModal.style.display = "none";
}

function set(element, value) {
    element.innerHTML = value;
}

function updateStatus(data) {
    set(microbitCount, data.microbitCount);
    set(displayWidth, data.displayWidth);
    set(displayHeight, data.displayHeight);
    set(gameRunning, data.gameRunning);
}

function updateSimulator(data) {
    let table = "";
    for (row of data.board) {
        table += "<tr>\n";
        for (cell of row) {
            table += `<td class="simulator-cell ${cell == 1 ? "on" : "off"}"><h3></h3></td>\n`
        }
        table += "</tr>\n";
    }
    simulator.innerHTML = table;
}

function createBoardDesigner(data) {
    if (layout != null) {
        return;
    }
    let newLayout = { width: data.displayWidth, height: data.displayHeight };
    layout = newLayout;
    let table = "";
    for (let row = 0; row < layout.height * 5; row++) {
        table += "<tr>\n";
        for (let cell = 0; cell < layout.width * 5; cell++) {
            table += `<td class="simulator-cell off" onclick="toggle(this)"><h3></h3></td>\n`
        }
        table += "</tr>\n";
    }
    designer.innerHTML = table;
}

function toggle(cell) {
    if (cell.classList.contains("on")) {
        cell.classList.remove("on");
        cell.classList.add("off");
    } else {
        cell.classList.remove("off");
        cell.classList.add("on");
    }
}

socket.onopen = function () {
    send({ type: "identify", data: { nodeType: "client" } });
    refresh();
}

socket.onmessage = function (event) {
    const msg = JSON.parse(event.data);
    console.log(msg);

    if (!msg.success) {
        showMessage("Error", msg.data.error);
        return;
    }

    switch (msg.type) {
        case "start":
            showMessage("Success", msg.data.message);
            break;
        case "stop":
            showMessage("Success", msg.data.message);
            break;
        case "status":
            updateStatus(msg.data);
            createBoardDesigner(msg.data);
            break;
        case "game-update":
            updateSimulator(msg.data);
            break;
    }
};