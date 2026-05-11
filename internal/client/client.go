package client

import (
	"github.com/gorilla/websocket"

	"github.com/annuvrat/tunnel/internal/protocol"
)

// Client represents tunnel client connection
type Client struct {

	// Websocket connection
	Conn *websocket.Conn

	// Channel for outgoing websocket messages
	Send chan protocol.Message
}
// WritePump continuously sends websocket messages
func (c *Client) WritePump() {

	// Infinite loop
	for {

		// Wait for outgoing message
		msg := <-c.Send

		// Write message to websocket
		err := c.Conn.WriteJSON(msg)

		if err != nil {
			return
		}
	}
}