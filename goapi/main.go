package main

import (
	"fmt"
	"log"
	"net/http"
	"goapi/internal/di"
)

func main() {
	container := di.NewContainer()

	// ルーティングの設定
	// /users?id={id} エンドポイントをUserControllerのGetUserByIDHandlerにマッピング
	http.HandleFunc("/users", container.UserController.GetUserByIDHandler)

	fmt.Println("Listening on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))

}
