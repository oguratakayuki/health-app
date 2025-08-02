package domain_test

import (
	"goapi/internal/domain"
	"testing"
)

func TestUserCreation(t *testing.T) {
	user := domain.User{
		ID:   "123",
		Email: "test@example.com",
	}

	if user.ID != "123" {
		t.Errorf("Expected user ID to be '123', but got '%s'", user.ID)
	}

	if user.Email != "test@example.com" {
		t.Errorf("Expected user Email to be 'test@example.com', but got '%s'", user.Email)
	}
}
