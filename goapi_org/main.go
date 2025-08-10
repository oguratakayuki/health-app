package main

import (
	"fmt"
	"log"
	"net/http"
	"goapi/internal/di"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func main() {
	container := di.NewContainer()

	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("welcome"))
	})

	// GET /users?id={id} エンドポイント
	r.Get("/users", container.UserController.GetUserByIDHandler)
	
	// PUT /users/{id} エンドポイント
	r.Put("/users/{id}", container.UserController.UpdateUserHandler)
	http.ListenAndServe(":8080", r)

	fmt.Println("Listening on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))

}
