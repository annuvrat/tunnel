package main

import (
	// "encoding/json"
	"fmt"
	"io"
	"strings"

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

	// Full incoming path
	// Example:
	// /t/abc123/api/users
	fullPath := r.URL.Path

	// Remove "/t/" from beginning
	// Result:
	// abc123/api/users
	pathWithoutPrefix := strings.TrimPrefix(fullPath, "/t/")

	// Split path by "/"
	// Result:
	// ["abc123", "api", "users"]
	parts := strings.Split(pathWithoutPrefix, "/")

	// Safety check
	// If URL is invalid, return error
	if len(parts) < 1 {
		http.Error(w, "Invalid tunnel path", http.StatusBadRequest)
		return
	}

	// First part is tunnel ID
	// Example:
	// abc123
	tunnelID := parts[0]

	// Default forwarded path
	// If user only visits:
	// /t/abc123
	// then forward "/"
	forwardPath := "/"

	// If extra path exists
	// Example:
	// /api/users
	if len(parts) > 1 {

		// Join remaining parts back into path
		// ["api", "users"] -> "/api/users"
		forwardPath += strings.Join(parts[1:], "/")
	}

	// Debug logs
	fmt.Println("Tunnel ID:", tunnelID)
	fmt.Println("Forward path:", forwardPath)

	// Find websocket connection for tunnel
	conn, exists := tunnel.Tunnels[tunnelID]

	// If tunnel doesn't exist
	if !exists {
		http.Error(w, "Tunnel not found", http.StatusNotFound)
		return
	}

	// Read request body
	// Important for POST/PUT requests
	body, _ := io.ReadAll(r.Body)

	// Generate unique request ID
	requestID := uuid.New().String()


	headers := make(map[string]string)

	for key,values := range r.Header{
		headers[key] = values[0]
	}
	// Create protocol message
	msg := protocol.Message{
		Type:      "request",
		RequestID: requestID,
		Method:    r.Method,

		// IMPORTANT:
		// Send correct forwarded path
		Path: forwardPath,
		Headers: headers,

		Body: body,
	}

	// Create response channel
	// This request waits here for response
	responseChan := make(chan protocol.Message)

	// Lock shared map before modifying
	tunnel.Mutex.Lock()

	// Store response channel
	tunnel.ResponseChannels[requestID] = responseChan

	// Unlock after modification
	tunnel.Mutex.Unlock()

	fmt.Println("Forwarding request to tunnel:", tunnelID)

	// Send request through websocket
	err := conn.WriteJSON(msg)

	if err != nil {
		http.Error(w, "Failed to forward request", 500)
		return
	}

	// WAIT for client response
	response := <-responseChan

	fmt.Println("Response received from client")
for key, value := range response.Headers {

	// Set response header
	w.Header().Set(key, value)
}
	// Send status code back to browser
	w.WriteHeader(response.StatusCode)

	// Send body back to browser
	w.Write(response.Body)

	// Cleanup response channel
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