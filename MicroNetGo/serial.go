package main

import (
	"bytes"
	"log"
	"time"

	"go.bug.st/serial"
	"go.bug.st/serial/enumerator"
)

var (
	openedPorts map[string]*serial.Port
	portDataMap map[string]*PortData
)

type PortData struct {
	Name   string
	Buffer []byte
}

func startSerial() {
	openedPorts = make(map[string]*serial.Port)
	portDataMap = make(map[string]*PortData)

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
			content := string(line)
			broadcastMessage(content)
			log.Printf("%s: %s", portName, content)
			portData.Buffer = portData.Buffer[idx+1:]
		}
	}
}

func isPortOpened(portName string) bool {
	_, exists := openedPorts[portName]
	return exists
}
