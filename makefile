# -----------------------------
# Development Commands
# -----------------------------

# Run tunnel server locally
run-server:
	go run ./cmd/tunneld

# Run tunnel client locally
run-client:
	go run ./cmd/tunnel http 5000


# -----------------------------
# Build Commands
# -----------------------------

# Build Linux binary
build-linux:
	GOOS=linux GOARCH=amd64 go build -o dist/tunnel ./cmd/tunnel

# Build Windows binary
build-windows:
	GOOS=windows GOARCH=amd64 go build -o dist/tunnel.exe ./cmd/tunnel

# Build macOS binary
build-macos:
	GOOS=darwin GOARCH=amd64 go build -o dist/tunnel-macos ./cmd/tunnel


# -----------------------------
# Release Command
# -----------------------------

# Build all binaries
release:
	make build-linux
	make build-windows
	make build-macos


# -----------------------------
# Docker Commands
# -----------------------------

# Build Docker image
docker-build:
	docker build -t tunnel-server .

# Start Docker Compose
docker-up:
	docker compose up --build

# Start Docker Compose in background
docker-up-detached:
	docker compose up -d --build

# Stop Docker Compose
docker-down:
	docker compose down