/**
 * format:
 * 
 * 00000,00000,00000,00000
 */
serial.onDataReceived(serial.delimiters(Delimiters.NewLine), function () {
    input2 = serial.readString()
    rows = input2.split(",")
    for (let y = 0; y <= 4; y++) {
        currentRow = rows[y].split("")
        for (let x = 0; x <= 4; x++) {
            if (currentRow[x] == "1") {
                led.plot(x, y)
            } else {
                led.unplot(x, y)
            }
        }
    }
})
let currentRow: string[] = []
let rows: string[] = []
let input2 = ""
serial.redirectToUSB()
