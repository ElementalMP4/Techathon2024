package main

import (
	"os"
	"os/signal"
	"syscall"
)

func main() {
	go startWebSocketServer()
	go startSerial()
	done := make(chan os.Signal, 1)
	signal.Notify(done, syscall.SIGINT, syscall.SIGTERM)
	<-done
}
