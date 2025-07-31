# goapi/Dockerfile
# Dockerfile (for development with hot-reloading)
FROM golang:1.24-alpine AS builder

WORKDIR /app/goapi

# Hot-reloading tool Airをインストール
RUN go install github.com/air-verse/air@latest


COPY goapi/go.mod ./
RUN go mod download

# ソースコードはボリュームマウントで提供されるため、ここではコピーしない
# CMDでAirを実行する際に必要となるので、コピーはせず、VOLUMEで参照する
# COPY goapi/*.go ./

# コンテナ起動時に Air を実行
# Airはワーキングディレクトリのファイル変更を監視し、自動でビルド・再起動します。
CMD ["air"]
