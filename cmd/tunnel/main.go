package main

import (
	"bytes"
	"fmt"
	"io"
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
	"github.com/spf13/cobra"

	"github.com/annuvrat/tunnel/internal/protocol"
)

// Stores local port from CLI flag
var localPort string
// Protect websocket writes
var writeMutex sync.Mutex
// Root CLI command
// Example:
// tunnel
var rootCmd = &cobra.Command{
	Use:   "tunnel",
	Short: "Tunnel CLI",
}

// Connect command
// Example:
// tunnel connect --local 5000
var connectCmd = &cobra.Command{

	// Command name
	Use: "connect",

	// Short help description
	Short: "Connect local server to tunnel",

	// This function runs when command executes
	Run: func(cmd *cobra.Command, args []string) {

		// Connect websocket to tunnel server
		conn, _, err := websocket.DefaultDialer.Dial(
			"ws://localhost:8080/ws",
			nil,
		)

		if err != nil {
			log.Fatal(err)
		}

		// Read initial tunnel message
		var msg protocol.Message

		err = conn.ReadJSON(&msg)

		if err != nil {
			log.Fatal(err)
		}

		fmt.Println("Tunnel established!")
		fmt.Println("Tunnel ID:", msg.TunnelID)

		// Infinite loop
		// Wait for requests from server
		for {

			var req protocol.Message

			// Read websocket message
			err := conn.ReadJSON(&req)

			if err != nil {
				log.Fatal(err)
			}

			fmt.Println("Received request from tunnel server")

			// Handle forwarded request
			if req.Type == "request" {
				go handleRequest(conn, req)
			}
		}
	},
}

// Initialize CLI
func init() {

	// Add connect command to root
	rootCmd.AddCommand(connectCmd)

	// Define --local flag
	// Example:
	// --local 5000
	connectCmd.Flags().StringVar(
		&localPort,
		"local",
		"5000",
		"Local port to forward",
	)
}

func main() {

	// Execute CLI
	err := rootCmd.Execute()

	if err != nil {
		log.Fatal(err)
	}
}

func handleRequest(conn *websocket.Conn, req protocol.Message) {

	// Build localhost URL
	url := "http://localhost:" + localPort + req.Path

	fmt.Println("Forwarding to:", url)

	// Create HTTP request
	httpReq, err := http.NewRequest(
		req.Method,
		url,
		bytes.NewBuffer(req.Body),
	)

	if err != nil {
		return
	}

	// Forward headers
	for key, value := range req.Headers {
		httpReq.Header.Set(key, value)
	}

	client := &http.Client{}

	// Send request to localhost
	resp, err := client.Do(httpReq)

	if err != nil {
		fmt.Println("Request failed:", err)
		return
	}

	fmt.Println("Received response from localhost")

	defer resp.Body.Close()

	// Store response headers
	responseHeaders := make(map[string]string)

	for key, values := range resp.Header {
		responseHeaders[key] = values[0]
	}

	// Read response body
	body, _ := io.ReadAll(resp.Body)

	// Create websocket response message
	responseMsg := protocol.Message{
		Type:       "response",
		RequestID:  req.RequestID,
		StatusCode: resp.StatusCode,
		Headers:    responseHeaders,
		Body:       body,
	}
  fmt.Println(responseMsg)
	// Send response through websocket
// Lock before websocket write
writeMutex.Lock()

// Unlock when function ends
defer writeMutex.Unlock()

// Safe websocket write
conn.WriteJSON(responseMsg)
}