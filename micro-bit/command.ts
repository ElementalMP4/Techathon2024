radio.onReceivedString(function (receivedString) {
    serial.writeLine(receivedString)
})
serial.onDataReceived(serial.delimiters(Delimiters.NewLine), function () {
    serialData = serial.readLine()
    radio.sendString(serialData)
})
let serialData = ""
radio.setGroup(73)