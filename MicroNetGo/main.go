package main

import (
	"bytes"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
	"go.bug.st/serial"
	"go.bug.st/serial/enumerator"
)

type PortData struct {
	Name   string
	Buffer []byte
}

var (
	openedPorts  map[string]*serial.Port
	portDataMap  map[string]*PortData
	upgrader     = websocket.Upgrader{}
	connections  = make(map[*websocket.Conn]struct{})
	addClient    = make(chan *websocket.Conn)
	removeClient = make(chan *websocket.Conn)
)

func main() {
	openedPorts = make(map[string]*serial.Port)
	portDataMap = make(map[string]*PortData)

	http.HandleFunc("/", handleWebSocket)
	go startWebSocketServer()

	for {
		ports, err := enumerator.GetDetailedPortsList()
		if err != nil {
			log.Fatal(err)
		}
		if len(ports) == 0 {
			log.Println("No serial ports found!")
		}

		for _, port := range ports {
			if port.IsUSB {
				if !isPortOpened(port.Name) {
					log.Printf("Opening port: %s\n", port.Name)
					go openPort(port.Name)
				}
			}
		}

		//Delay between port scans
		time.Sleep(1 * time.Second)
	}
}

func startWebSocketServer() {
	log.Println("Starting WebSocket server on port 80")
	if err := http.ListenAndServe(":80", nil); err != nil {
		log.Fatal("WebSocket server failed to start: ", err)
	}
}

func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Error upgrading to WebSocket:", err)
		return
	}

	connections[conn] = struct{}{}
	addClient <- conn

	defer func() {
		conn.Close()
		removeClient <- conn
	}()

	for {
		//Read message from the WebSocket client
		_, _, err := conn.ReadMessage()
		if err != nil {
			return
		}
	}
}

func openPort(portName string) {
	mode := &serial.Mode{
		BaudRate: 115200,
		Parity:   serial.EvenParity,
		DataBits: 8,
		StopBits: serial.OneStopBit,
	}

	port, err := serial.Open(portName, mode)
	if err != nil {
		log.Printf("Error opening port %s: %v\n", portName, err)
		return
	}
	openedPorts[portName] = &port
	portDataMap[portName] = &PortData{Name: portName, Buffer: make([]byte, 0)}

	defer func() {
		port.Close()
		delete(openedPorts, portName)
		delete(portDataMap, portName)
	}()

	for {
		buf := make([]byte, 128)
		n, err := port.Read(buf)
		if err != nil {
			log.Printf("Error reading from port %s: %v\n", portName, err)
			return
		}
		data := buf[:n]

		portData := portDataMap[portName]
		portData.Buffer = append(portData.Buffer, data...)

		if idx := bytes.IndexByte(portData.Buffer, '\n'); idx != -1 {
			line := portData.Buffer[:idx+1]
			broadcastMessage(string(line))
			log.Printf("Port %s: %s", portName, string(line))
			portData.Buffer = portData.Buffer[idx+1:]
		}
	}
}

func broadcastMessage(message string) {
	for conn := range connections {
		if err := conn.WriteMessage(websocket.TextMessage, []byte(message)); err != nil {
			log.Println("Error broadcasting message to client:", err)
		}
	}
}

func isPortOpened(portName string) bool {
	_, exists := openedPorts[portName]
	return exists
}
