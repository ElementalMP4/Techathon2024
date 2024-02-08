input.onButtonPressed(Button.A, function () {
    serial.writeLine("MicroNet Rocks!")
})
radio.onReceivedString(function (receivedString) {
    serial.writeLine(receivedString)
})
input.onButtonPressed(Button.B, function () {
    basic.showNumber(id)
})
let payload: string[] = []
let serialData = ""
let id = 0
serial.redirectToUSB()
serial.setBaudRate(BaudRate.BaudRate115200)
serial.setTxBufferSize(128)
serial.setRxBufferSize(128)
basic.forever(function () {
    serialData = serial.readLine()
    payload = serialData.split(" ")
    if (payload[0] == "id") {
        id = parseFloat(payload[1])
        radio.setGroup(id)
        basic.showNumber(id)
    } else {
        radio.sendString(serialData)
    }
})
