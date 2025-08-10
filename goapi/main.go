package main

import (
	"log"
	"goapi/internal/di"
	"github.com/gin-gonic/gin"
)

func main() {
	container := di.NewContainer()

	r := gin.Default()

	// ルーティングの設定
	r.GET("/users", container.UserController.GetUserByID)
	r.PUT("/users/:id", container.UserController.UpdateUser)

	log.Println("Listening on :8080")
	if err := r.Run(":8080"); err != nil {
		log.Fatalf("Failed to run server: %v", err)
	}
}
