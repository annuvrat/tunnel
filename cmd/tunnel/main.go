package main

import (
	"fmt"
	"log"

	"github.com/gorilla/websocket"

	"github.com/annuvrat/tunnel/internal/protocol"
)

func main() {
	conn, _, err := websocket.DefaultDialer.Dial("ws://localhost:8080/ws", nil)
	if err != nil {
		log.Fatal("Connection failed:", err)
	}

	fmt.Println("Connected to server")

	var msg protocol.Message

	err = conn.ReadJSON(&msg)
	if err != nil {
		log.Fatal("Read error:", err)
	}

	fmt.Println("Tunnel established!")
	fmt.Println("Tunnel ID:", msg.TunnelID)

	select {}
}