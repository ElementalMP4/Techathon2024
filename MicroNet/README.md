# Micro:Net

An API to bridge micro:bit radio to websockets

## Architecture 

![Architecture Diagram](http://url/to/img.png)

Things to note:
- API server supports multiple bridge nodes across multiple devices
- Channel configuration is done purely on the serial bridge
- Everything in the Network and Server zones are managed by us. The bridge nodes in the radio zone are also managed by us.

Software:
- API Server (Java 17)
- Serial Bridge (Node.JS)
- Micro:Bit Bridge (JavaScript)
- Raspberry Pi OS Lite

Hardware:
- Raspberry Pi 5
- Generic TP-Link 5 port gigabit ethernet switch
- Generic TP-Link wireless access point
- At least one BBC Micro:Bit (V1 or V2)

## How it works

The `API server` is booted. It makes a websocket server available.

A `bridge node` is booted, it connects to the `API server` and sends a list of `channels` that it can operate on.

One of the `channels` on the `serial bridge` receives a message, the `bridge` sends the messge to the `API server`. 

The `API server` forwards the message to all `clients` subscribed to that `channel`.

In essence:

`micro:bit radio` -> `serial bridge` -> `API server` -> `client`

And in reverse too.