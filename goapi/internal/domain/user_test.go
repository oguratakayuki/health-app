package domain_test

import (
	"goapi/internal/domain"
	"testing"
)

func TestUserCreation(t *testing.T) {
	user := domain.User{
		ID:   "123",
		Name: "John Doe",
	}

	if user.ID != "123" {
		t.Errorf("Expected user ID to be '123', but got '%s'", user.ID)
	}

	if user.Name != "John Doe" {
		t.Errorf("Expected user Name to be 'John Doe', but got '%s'", user.Name)
	}
}
