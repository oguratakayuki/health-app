package main

import (
	"log"
	"goapi/internal/di"
	"github.com/gin-gonic/gin"
)

func main() {
	container := di.NewContainer()

	r := gin.Default()

	api := r.Group("/api")
	api.GET("/users", container.UserController.ListUsers)
	api.GET("/users/:id", container.UserController.GetUser)
	api.POST("/users", container.UserController.CreateUser)
	api.PUT("/users/:id", container.UserController.UpdateUser)
	api.DELETE("/users/:id", container.UserController.DeleteUser)

	api.GET("/ingredients", container.IngredientController.ListIngredients)
	api.GET("/ingredients/:id", container.IngredientController.GetIngredient)
	api.POST("/ingredients", container.IngredientController.CreateIngredient)
	api.PUT("/ingredients/:id", container.IngredientController.UpdateIngredient)
	api.DELETE("/ingredients/:id", container.IngredientController.DeleteIngredient)

	log.Println("Listening on :8080")
	if err := r.Run(":8080"); err != nil {
		log.Fatalf("Failed to run server: %v", err)
	}
}
