from microbit import *
import radio
import music

uart.init(115200)
music.set_tempo(ticks=20)

id = 10
radio.config(group=id, power=7)
radio.on()

buf = bytearray()
last_uart_read_time = 0
uart_timeout = 100

def power_on_tone():
    music.play(['c', 'c'])

def identified_tone():
    music.play(['e', 'd', 'e'])

def send_chunked(data):
    chunk_size = 10
    for i in range(0, len(data), chunk_size):
        uart.write(data[i:i+chunk_size])
        sleep(20)

power_on_tone()

while True:
    if uart.any():
        buf.extend(uart.read(1))
        last_uart_read_time = running_time()
    
    if buf.decode().endswith('\r\n'):
        content = str(buf, 'utf-8').strip()
        args = content.split(' ')
        if args[0] == 'id':
            id = int(args[1])
            radio.config(group=id)
            identified_tone()
        else:
            radio.send(content)
        
        buf = bytearray()
    
    if running_time() - last_uart_read_time > uart_timeout:
        buf = bytearray()

    received = radio.receive()
    if received:
        send_chunked(received + '\r\n')
    
    if button_a.was_pressed():
        send_chunked('MicroNet Rocks!\r\n')
    
    if button_b.was_pressed():
        display.scroll(str(id))

    sleep(20)
