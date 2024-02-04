const socket = new WebSocket(`ws://${location.host}/gateway`);

const messageModal = document.getElementById("message-modal");
const messageModalTitle = document.getElementById("message-modal-title");
const messageModalContent = document.getElementById("message-modal-content");

const microbitCount = document.getElementById("mbit-count");
const displayWidth = document.getElementById("display-width");
const displayHeight = document.getElementById("display-height");
const gameRunning = document.getElementById("game-running");
const currentIteration = document.getElementById("current-iteration");

const simulator = document.getElementById("simulator");
const designer = document.getElementById("designer");

const upChevron = "&#x25B2;";
const downChevron = "&#x25BC;";

const systemMessageToggle = "tgl-sys-msg";

var layout = null;

function toggleMenu(menu) {
    let menuDiv = document.getElementById(menu);
    let toggle = document.getElementById(menu + "-toggle");

    if (menuDiv.style.display == "none") {
        menuDiv.style.display = "block";
        toggle.innerHTML = upChevron;
    } else {
        menuDiv.style.display = "none";
        toggle.innerHTML = downChevron;
    }

}

function toggleSystemMessages() {
    if (localStorage.hasOwnProperty(systemMessageToggle)) {
        if (localStorage.getItem(systemMessageToggle) == "on") {
            localStorage.setItem(systemMessageToggle, "off");
        } else {
            localStorage.setItem(systemMessageToggle, "on");
        }
    } else {
        localStorage.setItem(systemMessageToggle, "off");
    }
}

function sysMsgEnabled() {
    return localStorage.hasOwnProperty(systemMessageToggle) ? localStorage.getItem(systemMessageToggle) == "on" : true;
}

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

function clearBoardDesigner() {
    for (var i = 0, row; row = designer.rows[i]; i++) {
        for (var j = 0, cell; cell = row.cells[j]; j++) {
            cell.classList.remove("on");
            cell.classList.add("off");
        }
    }
}

function start() {
    let board = getDesignedBoard();
    let data = {};
    let onCount = board.map(row => row.reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0);
    console.log(onCount);
    if (onCount > 0) data = { board: board };
    send({ type: "start", data: data });
    refresh();
}

function stop() {
    send({ type: "stop", data: {} });
    refresh();
}

function restart() {
    send({ type: "stop", data: {} });
    start();
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
    set(currentIteration, data.currentIteration);
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
    currentIteration.innerHTML = data.currentIteration;
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
            if (sysMsgEnabled()) showMessage("Success", msg.data.message);
            break;
        case "stop":
            if (sysMsgEnabled()) showMessage("Success", msg.data.message);
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