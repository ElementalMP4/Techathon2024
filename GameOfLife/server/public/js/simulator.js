const socket = new WebSocket(`ws://${location.host}/gateway`);

var layoutCreated = false;

const simulator = document.getElementById("simulator");

function send(data) {
    if (socket.readyState == WebSocket.OPEN) socket.send(JSON.stringify(data));
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

function createSimulator(data) {
    let newLayout = { width: data.displayWidth, height: data.displayHeight };
    layout = newLayout;
    let table = "";
    for (let row = 0; row < layout.height * 5; row++) {
        table += "<tr>\n";
        for (let cell = 0; cell < layout.width * 5; cell++) {
            table += `<td class="simulator-cell off"><h3></h3></td>\n`
        }
        table += "</tr>\n";
    }
    simulator.innerHTML = table;
    layoutCreated = true;
}

socket.onopen = function () {
    send({ type: "identify", data: { nodeType: "client" } });
    send({ type: "status", data: {} });
}

socket.onmessage = function (event) {
    const msg = JSON.parse(event.data);
    console.log(msg);

    switch (msg.type) {
        case "status":
            if (!msg.success && !isReady) {
                setInterval(() => refresh(), 1000);
            }
            if (!layoutCreated) {
                createSimulator(msg.data);
            }
            break;
        case "game-update":
            updateSimulator(msg.data);
            break;
    }
};