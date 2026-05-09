package main

import (
	// "encoding/json"
	"fmt"
	"net/http"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"

	"github.com/annuvrat/tunnel/internal/protocol"
	"github.com/annuvrat/tunnel/internal/tunnel"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func wsHandler(w http.ResponseWriter, r *http.Request) {
	// Upgrade HTTP -> WebSocket
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("Upgrade error:", err)
		return
	}

	// Generate tunnel ID
	tunnelID := uuid.New().String()

	// Store connection
	tunnel.Tunnels[tunnelID] = conn

	fmt.Println("New tunnel connected:", tunnelID)

	// Send tunnel ID to client
	msg := protocol.Message{
		Type:     "connected",
		TunnelID: tunnelID,
	}

	err = conn.WriteJSON(msg)
	if err != nil {
		fmt.Println("Write error:", err)
		return
	}

	// Keep connection alive
	for {
		_, _, err := conn.ReadMessage()
		if err != nil {
			fmt.Println("Client disconnected")
			delete(tunnel.Tunnels, tunnelID)
			break
		}
	}
}

func main() {
	http.HandleFunc("/ws", wsHandler)

	fmt.Println("Tunnel server running on :8080")

	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		panic(err)
	}
}