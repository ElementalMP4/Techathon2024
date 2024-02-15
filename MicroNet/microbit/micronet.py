from microbit import *
import radio

id = 10

uart.init()
radio.config(group=id, power=7)
radio.on()

while True:
    buf = str(uart.readline())
    if buf:
        args = buf.split(' ')
        if args[0] == 'id':
            id = args[1]
            radio.config(group=int(id))
        else:
            radio.send(buf)
    buf = radio.receive()
    if buf:
        uart.write(f'{buf}\n')
    if button_a.was_pressed():
        uart.write('MicroNet Rocks!\n')
    if button_b.was_pressed():
        display.scroll(id)