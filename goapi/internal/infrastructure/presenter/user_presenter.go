// internal/infrastructure/presenter/user_presenter.go
package presenter

import (
	"encoding/json"
	"net/http"
	"goapi/internal/domain"
)

type UserResponse struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

func RenderUserJSON(w http.ResponseWriter, user *domain.User) error {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	res := UserResponse{
		ID:   user.ID,
		Name: user.Name,
	}

	return json.NewEncoder(w).Encode(res)
}

func RenderErrorJSON(w http.ResponseWriter, message string, statusCode int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(map[string]string{"error": message})
}
