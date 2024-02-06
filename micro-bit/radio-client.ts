input.onButtonPressed(Button.A, function () {
    if (!(identified)) {
        basic.showIcon(IconNames.Yes)
        displayIndex += 1
        radio.sendString("i " + displayIndex)
        identified = true
    }
})
radio.onReceivedString(function (receivedString) {
    if (receivedString.includes("i ")) {
        if (!(identified)) {
            displayIndex = parseFloat(receivedString.split(" ")[1])
            basic.showNumber(displayIndex)
        }
    }
    if (receivedString.includes("d ")) {
        if (identified) {
            payload = receivedString.split(" ")
            receivedId = parseFloat(payload[1])
            layout = payload[2].split("")
            if (receivedId == displayIndex) {
                x = 0
                y = 0
                for (let value of layout) {
                    if (x == 5) {
                        y += 1
                        x = 0
                    }
                    if (value == "1") {
                        led.plot(x, y)
                    } else {
                        led.unplot(x, y)
                    }
                    x += 1
                }
            }
        }
    }
})
let y = 0
let x = 0
let layout: string[] = []
let receivedId = 0
let payload: string[] = []
let displayIndex = 0
let identified = false
radio.setGroup(58)
radio.setTransmitPower(7)
identified = false
displayIndex = 1
basic.showNumber(displayIndex)
radio.sendNumber(0)
