package tunnel

import (
	"sync"

	"github.com/annuvrat/tunnel/internal/protocol"
)

var (
	ResponseChannels = make(map[string]chan protocol.Message)
	Mutex            sync.Mutex
)