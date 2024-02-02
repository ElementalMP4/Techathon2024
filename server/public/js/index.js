const socket = new WebSocket(`ws://${location.host}/gateway`);

const messageModal = document.getElementById("message-modal");
const messageModalTitle = document.getElementById("message-modal-title");
const messageModalContent = document.getElementById("message-modal-content");

const microbitCount = document.getElementById("mbit-count");
const displayWidth = document.getElementById("display-width");
const displayHeight = document.getElementById("display-height");
const gameRunning = document.getElementById("game-running");

function send(data) {
    if (socket.readyState == WebSocket.OPEN) socket.send(JSON.stringify(data));
}

function refresh() {
    send({ type: "status", data: {} });
}

function start() {
    send({ type: "start", data: {} });
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

socket.onopen = function () {
    send({ type: "identify", data: { nodeType: "client" } });
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
            break;
    }
};