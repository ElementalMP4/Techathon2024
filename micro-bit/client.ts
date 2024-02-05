let row = ""
let completeLayout: string[] = []
let payload: string[] = []
let input = ""
serial.redirectToUSB()
serial.setTxBufferSize(128)
serial.setRxBufferSize(128)
let showingLayout = false
basic.forever(function () {
    input = serial.readLine()
    payload = input.split(" ")
    if (payload[0] == "dsp") {
        if (!(showingLayout)) {
            completeLayout = payload[1].split(",")
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
        }
    }
    if (payload[0] == "lyt") {
        if (payload[1] == "on") {
            showingLayout = true
            basic.showNumber(parseFloat(payload[2]) + 1)
        } else {
            showingLayout = false
            basic.clearScreen()
        }
    }
})
