# ビルドステージ: 依存関係のダウンロードとツールのインストール
FROM golang:1.24-alpine AS builder

WORKDIR /app/goapi

# go.modとgo.sumをコピー
COPY go.mod .
COPY go.sum .
RUN go mod download

# go-air をインストール
RUN go install github.com/air-verse/air@v1.62.0

# --- デバッグ用のRUNコマンドは削除します ---

# アプリケーションコードをコピー
COPY . .

# go.mod, go.sumで指定されたバージョンでインストール
RUN go mod tidy

# 実行ステージをこのbuilderイメージで統一
FROM builder

# アプリケーションをビルド
RUN CGO_ENABLED=0 go build -o /goapi ./main.go

# 実行
CMD ["/goapi"]
