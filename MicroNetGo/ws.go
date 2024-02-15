package main

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var (
	upgrader     = websocket.Upgrader{CheckOrigin: checkOrigin}
	connections  = make(map[*websocket.Conn]struct{})
	addClient    = make(chan *websocket.Conn)
	removeClient = make(chan *websocket.Conn)
)

func checkOrigin(r *http.Request) bool {
	return true
}

func startWebSocketServer() {
	http.HandleFunc("/", handleWebSocket)
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

	log.Println("New WS connection: " + r.RemoteAddr)

	connections[conn] = struct{}{}
	addClient <- conn

	defer func() {
		log.Println("WS connection closed: " + r.RemoteAddr)
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

func broadcastMessage(message string) {
	for conn := range connections {
		if err := conn.WriteMessage(websocket.TextMessage, []byte(message)); err != nil {
			log.Println("Error broadcasting message to client:", err)
		}
	}
}
