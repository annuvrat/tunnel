package protocol


type Message struct {
	Type    string `json:"type"`
	TunnelID string `json:"tunnel_id,omitempty"`
}