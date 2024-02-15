from microbit import *
import radio

power = 0
display.show(power)

radio.config(group=10, power=power)
radio.on()

while True:
    received = radio.receive()
    if received:
        display.scroll(received)
    
    if button_a.was_pressed():
        radio.send("Radio Rocks!")
        
    if button_b.was_pressed():
        power += 1
        if power > 7:
            power = 0
        display.show(power)
        radio.config(power=power)
