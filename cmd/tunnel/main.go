package main

import (
	"bytes"
	"crypto/tls"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
"os/signal"
"syscall"
"github.com/fatih/color"
	clientpkg "github.com/annuvrat/tunnel/internal/client"
	"github.com/annuvrat/tunnel/internal/protocol"
	"github.com/gorilla/websocket"
	"github.com/spf13/cobra"
)

// Stores local port from CLI flag
var localPort string
// Protect websocket writes
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
var httpCmd = &cobra.Command{

	// Command name
	Use: "http [port]",

	// Short help description
	Short: "Expose local HTTP server",

	// This function runs when command executes
	Run: func(cmd *cobra.Command, args []string) {
		printBanner()
		
if len(args) < 1 {

	fmt.Println("Usage: tunnel http <port>")
	return
}

// Store local port
localPort = args[0]
		// Connect websocket to tunnel server
		dialer := websocket.Dialer{
	TLSClientConfig: &tls.Config{
		InsecureSkipVerify: true,
	},
}

conn, _, err := dialer.Dial(
	"wss://tunnel.annuvrat.com/ws",
	nil,
)
		// Create client instance
    client := &clientpkg.Client{
	Conn: conn,

	// Buffered outgoing queue
	Send: make(chan protocol.Message, 100),
}
// Start websocket writer goroutine
go client.WritePump()

		if err != nil {
			log.Fatal(err)
		}
		// NOW conn exists safely

signalChan := make(chan os.Signal, 1)

signal.Notify(
	signalChan,
	os.Interrupt,
	syscall.SIGTERM,
)

go func() {

	<-signalChan

	fmt.Println()

	color.Yellow("Shutting down tunnel...")

	conn.Close()

	color.Green("Tunnel closed successfully.")

	os.Exit(0)
}()

		// Read initial tunnel message
		var msg protocol.Message

		err = conn.ReadJSON(&msg)

		if err != nil {
			log.Fatal(err)
		}

	// Empty line for spacing
fmt.Println()

// Success message
color.Green("✔ Tunnel established")

// Empty line
fmt.Println()

// Forwarding section
color.Cyan("Forwarding:")

// Public URL
color.Blue(
	"https://tunnel.annuvrat.com/t/%s",
	msg.TunnelID,
)

// Visual arrow
fmt.Println("   ↓")

// Local URL
color.Yellow(
	"http://localhost:%s",
	localPort,
)


// Empty line
fmt.Println()

// Status info
color.Green("Status: connected")

// Transport info
color.Cyan("Protocol: HTTPS + WSS")

// Empty line
fmt.Println()

// Exit help
color.White("Press Ctrl+C to stop")
		// Infinite loop
		// Wait for requests from server
		for {

			var req protocol.Message

			// Read websocket message
			err := conn.ReadJSON(&req)

			if err != nil {
				log.Fatal(err)
			}


			// Handle forwarded request
			if req.Type == "request" {
				go handleRequest(client, req)
			}
		}
	},
}

// Initialize CLI
func init() {

	// Add connect command to root
	rootCmd.AddCommand(httpCmd)

	// Define --local flag
	// Example:
	// --local 5000

}
func printBanner() {

	// Cyan ASCII logo
	color.Cyan(`
████████╗██╗   ██╗███╗   ██╗███╗   ██╗███████╗██╗     
╚══██╔══╝██║   ██║████╗  ██║████╗  ██║██╔════╝██║     
   ██║   ██║   ██║██╔██╗ ██║██╔██╗ ██║█████╗  ██║     
   ██║   ██║   ██║██║╚██╗██║██║╚██╗██║██╔══╝  ██║     
   ██║   ╚██████╔╝██║ ╚████║██║ ╚████║███████╗███████╗
   ╚═╝    ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═══╝╚══════╝╚══════╝
`)

	// Small subtitle
	color.White("Secure localhost tunneling for developers")

	// Empty spacing
	fmt.Println()
}
func main() {

	// Execute CLI
	err := rootCmd.Execute()

	if err != nil {
		log.Fatal(err)
	}
}

func handleRequest(client *clientpkg.Client, req protocol.Message) {

	// Build localhost URL
	url := "http://localhost:" + localPort + req.Path


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

	httpClient := &http.Client{}

	// Send request to localhost
	resp, err := httpClient.Do(httpReq)

	if err != nil {
		fmt.Println("Request failed:", err)
		return
	}


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

	fmt.Printf(
	"%-6s %-20s %d\n",
	req.Method,
	req.Path,
	resp.StatusCode,
)
	// Send response through websocket
// Lock before websocket write
// writeMutex.Lock()

// // Unlock when function ends
// defer writeMutex.Unlock()

// Safe websocket write
// Send message into outgoing queue
client.Send <- responseMsg
}