package repository_test

import (
	"goapi/internal/infrastructure/repository"
	"testing"
)

func TestFindByID_InMemory(t *testing.T) {
	repo := repository.NewInMemoryUserRepository()

	// 成功ケース
	user, err := repo.FindByID("123")
	if err != nil {
		t.Fatalf("Expected no error, but got %v", err)
	}
	if user.ID != "123" || user.Name != "John Doe" {
		t.Errorf("FindByID(123) failed. Expected {ID:123, Name:John Doe}, got %v", user)
	}

	// ユーザーが見つからないケース
	user, err = repo.FindByID("999")
	if err != nil {
		t.Fatalf("Expected no error for not-found user, but got %v", err)
	}
	if user != nil {
		t.Errorf("FindByID(999) failed. Expected nil, got %v", user)
	}
}
