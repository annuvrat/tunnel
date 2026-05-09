package tunnel

import "github.com/gorilla/websocket"

var Tunnels = make(map[string]*websocket.Conn)