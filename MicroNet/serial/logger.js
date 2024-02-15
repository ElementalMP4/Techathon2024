const LogLevel = {
    OK: "[  \x1b[1m\x1b[32mOK\x1b[0m  ]",
    ERROR: "[ \x1b[1m\x1b[31mFAIL\x1b[0m ]",
    INFO: "[ \x1b[1m\x1b[33mINFO\x1b[0m ]"
}

function pad(n) {
    return n < 10 ? '0' + n : n;
}

function padMillis(m) {
    return m < 100 
    ? m < 10 ? '00' + m : '0' + m
    : m;
}

function getDate() {
    let date = new Date();
    return `${date.getFullYear().toString()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${padMillis(date.getMilliseconds())}`;
}

function log(level, msg) {
    console.log(`\x1b[90m[${getDate()}]\x1b[0m ${level} ${msg}`);
}

module.exports = { LogLevel, log };