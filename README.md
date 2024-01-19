# micro:aws

## Messaging over radio

Any message should follow this format:

```
<recipient ID> <opcode> <optional data>
```

micro:bits will generate a random ID when they boot. 

The command node micro:bit will always be ID 0.

A broadcast ID will always be 1.

A back and forth communication between the server and a client micro:bit could look like this:

```
1 HB_RQ              // Server broadcasts a heartbeat request message
0 HB_ACK 2           // ALL micro:bits MUST respond with a heartbeat acknowledged message
2 EXEC flash_led     // Server tells micro:bit with ID 2 to flash its LED display
```

All communications are stateless. Additionally, a heartbeat will be sent every 3 seconds to ensure connected micro:bits are still available.

### New micro:bit identifying on boot

When a client micro:bit boots, it will automatically send a heartbeat acknowledge request to inform the server that it has become available

```
0 HB_ACK <id>
```

If a micro:bit misses 2 heartbeat intervals, it will be considered invalid and removed from the pool.

### Instructions

| Command | Arguments            |
| ------- | -------------------- |
| HB_ACK  | client id            |
| HB_RQ   | <none>               |
| EXEC    | valid command string |