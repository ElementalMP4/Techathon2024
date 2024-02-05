const socket = new WebSocket(`ws://${location.host}/gateway`);

const messageModal = document.getElementById("message-modal");
const messageModalTitle = document.getElementById("message-modal-title");
const messageModalContent = document.getElementById("message-modal-content");

const loader = document.getElementById("loader");

const microbitCount = document.getElementById("mbit-count");
const displayWidth = document.getElementById("display-width");
const displayHeight = document.getElementById("display-height");
const gameRunning = document.getElementById("game-running");
const currentIteration = document.getElementById("current-iteration");

const simulator = document.getElementById("simulator");
const designer = document.getElementById("designer");
const periodInput = document.getElementById("period-input");

const upChevron = "&#x25B2;";
const downChevron = "&#x25BC;";

const systemMessageToggle = "tgl-sys-msg";

var layout = null;
var isReady = false;

function ready() {
    isReady = true;
    loader.style.display = "none";
}

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
    let period = periodInput.value;
    let data = { period: period };
    let onCount = board.map(row => row.reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0);
    if (onCount > 0) data = { ...data, board: board };
    send({ type: "start", data: data });
}

function stop() {
    send({ type: "stop", data: {} });
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

function showDisplayMode() {
    send({ type: "display-layout", data: { display: "on" } });
}

function hideDisplayMode() {
    send({ type: "display-layout", data: { display: "off" } });
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
    ready();
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
}

socket.onmessage = function (event) {
    const msg = JSON.parse(event.data);
    console.log(msg);

    if (!msg.success && isReady) {
        showMessage("Error", msg.data.error);
        return;
    }

    switch (msg.type) {
        case "identify":
            refresh();
            break;
        case "start":
            if (sysMsgEnabled()) showMessage("Success", msg.data.message);
            break;
        case "stop":
            if (sysMsgEnabled()) showMessage("Success", msg.data.message);
            break;
        case "status":
            if (!msg.success && !isReady) {
                setInterval(() => refresh(), 1000);
            }
            updateStatus(msg.data);
            createBoardDesigner(msg.data);
            break;
        case "game-update":
            updateSimulator(msg.data);
            break;
    }
};