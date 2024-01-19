let messagePayload: string[] = []
let opcode = ""
let recipientId = ""
let args: string[] = []
let id = convertToText(randint(1000, 9999))
radio.setGroup(73)

function sendRadioResponse (opcode: string, payload: string) {
    radio.sendString("0 " + opcode + " " + payload)
}

radio.onReceivedString(function (receivedString) {
    args = receivedString.split(" ")
    recipientId = args.shift()
    opcode = args.shift()
    messagePayload = args
    if (opcode == "HB_RQ") {
        sendRadioResponse("HB_ACK", id)
    }
})
