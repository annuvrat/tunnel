package main

import (
	"bytes"
	"fmt"
	"io"
	"log"
	"net/http"

	"github.com/gorilla/websocket"

	"github.com/annuvrat/tunnel/internal/protocol"
)

func main() {
	conn, _, err := websocket.DefaultDialer.Dial("ws://localhost:8080/ws", nil)
	if err != nil {
		log.Fatal(err)
	}

	var msg protocol.Message

	err = conn.ReadJSON(&msg)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Tunnel established!")
	fmt.Println("Tunnel ID:", msg.TunnelID)

	for {
		var req protocol.Message

		err := conn.ReadJSON(&req)
		if err != nil {
			log.Fatal(err)
		}

		if req.Type == "request" {
			fmt.Println("Received request from tunnel server")
			handleRequest(conn, req)
		}
	}
}
var localPort = "5000"
func handleRequest(conn *websocket.Conn, req protocol.Message) {
	url := "http://localhost:" + localPort

	httpReq, err := http.NewRequest(
		req.Method,
		url,
		bytes.NewBuffer(req.Body),
	)

	if err != nil {
		return
	}

	client := &http.Client{}
fmt.Println("Forwarding request to localhost...")
	resp, err := client.Do(httpReq)
	fmt.Println("Received response from localhost")
	if err != nil {
    fmt.Println("Request failed:", err)
    return
}

	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)

	fmt.Println("Response body:", string(body))

	responseMsg := protocol.Message{
		Type:       "response",
		RequestID:  req.RequestID,
		StatusCode: resp.StatusCode,
		Body:       body,
	}

	conn.WriteJSON(responseMsg)
}