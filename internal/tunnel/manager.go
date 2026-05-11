package tunnel

import (
	"sync"

	"github.com/annuvrat/tunnel/internal/protocol"
)


// Stores requestID -> response channel
var ResponseChannels = make(map[string]chan protocol.Message)

// Stores requestID -> tunnelID
var RequestTunnelMap = make(map[string]string)

// Shared mutex
var Mutex sync.Mutex