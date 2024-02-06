let radioLayout = ""
let row = ""
let completeLayout: string[] = []
let displayId = ""
let payload: string[] = []
let input = ""
serial.redirectToUSB()
serial.setTxBufferSize(128)
serial.setRxBufferSize(128)
let showingLayout = false
radio.setGroup(58)
radio.setTransmitPower(7)
basic.forever(function () {
    input = serial.readLine()
    payload = input.split(" ")
    if (payload[0] == "dsp") {
        if (!(showingLayout)) {
            displayId = payload[1]
            completeLayout = payload[2].split(",")
            if (displayId == "0") {
                for (let y = 0; y <= 4; y++) {
                    row = completeLayout[y]
                    for (let x = 0; x <= 4; x++) {
                        if (row[x] == "1") {
                            led.plot(x, y)
                        } else {
                            led.unplot(x, y)
                        }
                    }
                }
            } else {
                radioLayout = ""
                for (let index = 0; index <= 4; index++) {
                    radioLayout = "" + radioLayout + completeLayout[index]
                }
                radio.sendString("d" + " " + displayId + " " + radioLayout)
            }
        }
    }
    if (payload[0] == "lyt") {
        if (payload[1] == "on") {
            showingLayout = true
            basic.showNumber(parseFloat(payload[2]) + 1)
            radio.sendString("l on")
        } else {
            showingLayout = false
            radio.sendString("l off")
            basic.clearScreen()
        }
    }
})
