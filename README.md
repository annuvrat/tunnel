# Tunnel
![alt text](./assets/image.png)

Secure localhost tunneling built in Go using WebSockets.

Tunnel exposes your local HTTP server to the public internet through a secure reverse tunnel — similar to ngrok.

Built with:
- Go
- WebSockets
- Docker
- Caddy
- Cobra CLI

---

## Features

- Reverse HTTP tunneling
- HTTPS public forwarding
- WebSocket transport (WSS)
- Concurrent request handling
- Heartbeat monitoring
- Graceful shutdown
- Dockerized deployment
- Cross-platform CLI binaries

---

## Architecture

```text
Browser
   ↓
Caddy HTTPS Reverse Proxy
   ↓
Tunnel Server
   ↓ WSS
Tunnel CLI
   ↓
localhost app
```

---

## Installation

### Linux

```bash
chmod +x tunnel

./tunnel http 5000
```

### Windows

```bash
tunnel.exe http 5000
```

---

## Example

```bash
./tunnel http 5000
```

Example output:
![alt text](./assets/image.png)
```text
✔ Tunnel established

Forwarding:
https://localhost/t/abc123
   ↓
http://localhost:5000

Status: connected
Protocol: HTTPS + WSS
```

---

## Tech Stack

- Go
- Gorilla WebSocket
- Cobra CLI
- Docker
- Caddy

---

## Future Improvements

- Custom subdomains
- Authentication
- Persistent tunnels
- Dashboard UI
- Metrics & analytics