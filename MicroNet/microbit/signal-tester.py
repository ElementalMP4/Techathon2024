from microbit import *
import radio

power = 0
display.show(power)

radio.config(group=19, power=power)
radio.on()

while True:
    received = radio.receive()
    if received is not None and received == 'ping':
        radio.send('ack')
    
    if button_a.was_pressed():
        radio.send("Test Message")
        
    if button_b.was_pressed():
        power += 1
        if power > 7:
            power = 0
        display.show(power)
        radio.config(power=power)
