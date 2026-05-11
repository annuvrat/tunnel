# -----------------------------
# BUILD STAGE
# -----------------------------

# Use official Go image
FROM golang:1.25.9 AS builder

# Set working directory inside container
WORKDIR /app

# Copy go.mod and go.sum first
# Helps Docker cache dependencies
COPY go.mod go.sum ./

# Download Go dependencies
RUN go mod download

# Copy entire project
COPY . .

# Build tunnel server binary
RUN go build -o tunneld ./cmd/tunneld

# -----------------------------
# RUNTIME STAGE
# -----------------------------

# Small lightweight Linux image
FROM debian:bookworm-slim

# Set working directory
WORKDIR /app

# Copy built binary from builder stage
COPY --from=builder /app/tunneld .

# Expose server port
EXPOSE 8080

# Start tunnel server
CMD ["./tunneld"]