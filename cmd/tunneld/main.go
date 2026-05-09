package main

import (
	// "encoding/json"
	"fmt"
	"io"
	// "bytes"
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
	var msg protocol.Message

	err := conn.ReadJSON(&msg)
	if err != nil {
		fmt.Println("Client disconnected")
		delete(tunnel.Tunnels, tunnelID)
		break
	}

	if msg.Type == "response" {
		tunnel.Mutex.Lock()

		ch, exists := tunnel.ResponseChannels[msg.RequestID]

		tunnel.Mutex.Unlock()

		if exists {
			ch <- msg
		}
	}
}
}
func tunnelHandler(w http.ResponseWriter, r *http.Request) {
	tunnelID := r.URL.Path[len("/t/"):]

	conn, exists := tunnel.Tunnels[tunnelID]
	if !exists {
		http.Error(w, "Tunnel not found", http.StatusNotFound)
		return
	}

	body, _ := io.ReadAll(r.Body)

	requestID := uuid.New().String()

	msg := protocol.Message{
		Type:      "request",
		RequestID: requestID,
		Method:    r.Method,
		Path:      "/",
		Body:      body,
	}

	responseChan := make(chan protocol.Message)

	tunnel.Mutex.Lock()
	tunnel.ResponseChannels[requestID] = responseChan
	tunnel.Mutex.Unlock()
fmt.Println("Forwarding request to tunnel:", tunnelID)
fmt.Println("Request path:", r.URL.Path)
	err := conn.WriteJSON(msg)
	if err != nil {
		http.Error(w, "Failed to forward request", 500)
		return
	}

	response := <-responseChan

	w.WriteHeader(response.StatusCode)
	w.Write(response.Body)

	tunnel.Mutex.Lock()
	delete(tunnel.ResponseChannels, requestID)
	tunnel.Mutex.Unlock()
}
func main() {
	http.HandleFunc("/ws", wsHandler)
	http.HandleFunc("/t/", tunnelHandler)

	fmt.Println("Tunnel server running on :8080")

	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		panic(err)
	}
}