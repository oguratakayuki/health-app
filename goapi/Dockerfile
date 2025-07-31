FROM golang:1.22.1 AS builder

WORKDIR /app/goapi

COPY goapi/go.mod ./
# COPY goapi/go.sum ./
RUN go mod download

COPY goapi/*.go ./
# 静的リンク指定
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o server .

# 最小イメージに移動（バイナリのみ）
FROM debian:bullseye-slim
WORKDIR /app
COPY --from=builder /app/goapi/server .
EXPOSE 8080
CMD ["./server"]
