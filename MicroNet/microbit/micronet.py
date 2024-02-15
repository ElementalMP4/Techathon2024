from microbit import *
import radio

id = 10

uart.init(115200)
radio.config(group=id, power=7)
radio.on()

def send_chunked(data):
    chunk_size = 10
    for i in range(0, len(data), chunk_size):
        uart.write(data[i:i+chunk_size])
        sleep(20)

while True:
    buf = uart.readline()
    if buf:
        buf = buf.decode().strip()
        args = buf.split(' ')
        if args[0] == 'id':
            id = int(args[1])
            radio.config(group=id)
        else:
            radio.send(buf)
    
    while uart.any():
        uart.read(1)
    
    received = radio.receive()
    if received:
        send_chunked(received + '\r\n')
    
    if button_a.was_pressed():
        send_chunked('MicroNet Rocks!\r\n')
    
    if button_b.was_pressed():
        display.scroll(str(id))
