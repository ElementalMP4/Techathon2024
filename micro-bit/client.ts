input.onButtonPressed(Button.A, function () {
    if (order_set == 0) {
        radio.sendString("order_increment")
        order_set = 1
        images.iconImage(IconNames.Yes).showImage(0)
        basic.pause(500)
        basic.clearScreen()
    }
})
radio.onReceivedString(function (receivedString) {
    if (receivedString == "order_increment" && order_set == 0) {
        index += 1
        basic.showNumber(index)
    }
    if (receivedString.includes("dsp")) {
        message_parts = receivedString.split(" ")
        if (index == parseFloat(message_parts[1])) {
            row = message_parts[3].split("")
            y = parseFloat(message_parts[2])
            x = 0
            for (let value of row) {
                if (value == "1") {
                    led.plot(x, y)
                } else {
                    led.unplot(x, y)
                }
                x += 1
            }
        }
    }
})
input.onButtonPressed(Button.B, function () {
    radio.sendString("dsp 1 0 10000")
    radio.sendString("dsp 1 1 01000")
    radio.sendString("dsp 1 2 00100")
    radio.sendString("dsp 1 3 00010")
    radio.sendString("dsp 1 4 00001")
})
let x = 0
let y = 0
let row: string[] = []
let message_parts: string[] = []
let order_set = 0
let index = 0
radio.setGroup(73)
basic.showNumber(index)
