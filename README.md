# Micro:Net - Game Of Life

## Brief

This madness comprises of 3 sections:
- A web-based UI for clients to interact with
- A server to orchestrate communication and run the simulator
- A micro:bit array to display the simulation

## Technical Stuff

This has been designed from the ground up to work without an internet connection. From the hardware to the build process and the software implementation, this entire system can run without an active internet connection.

This being said, a LAN and initial internet connection are required to gather the dependencies.

### Hardware

- TP-Link TL-WA801ND wireless access point and router
- TP-Link 5 port Gigabit Ethernet Switch
- Dell Wyse N03D 3290 Thin Client
- At least one Micro:Bit (V1 or V2)

### Software

- Java WS/HTTP server, built with Spring web & Java 17
- Node.JS WS/Serial client, built with Node.JS 20
- Ubuntu Server