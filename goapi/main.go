package main

import (
	"log"
	"goapi/internal/di"
	"github.com/gin-gonic/gin"
)

func main() {
	container := di.NewContainer()

	r := gin.Default()

	r.GET("/users", container.UserController.ListUsers)
	r.GET("/users/:id", container.UserController.GetUser)
	r.POST("/users", container.UserController.CreateUser)
	r.PUT("/users/:id", container.UserController.UpdateUser)
	r.DELETE("/users/:id", container.UserController.DeleteUser)

	log.Println("Listening on :8080")
	if err := r.Run(":8080"); err != nil {
		log.Fatalf("Failed to run server: %v", err)
	}
}
