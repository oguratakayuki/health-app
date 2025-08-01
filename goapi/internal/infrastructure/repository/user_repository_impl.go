// internal/infrastructure/repository/user_repository_impl.go
package repository

import (
	"goapi/internal/domain"
	"goapi/internal/usecase"
)

type InMemoryUserRepository struct {
}

// NewInMemoryUserRepository はInMemoryUserRepositoryの新しいインスタンスを作成します。
func NewInMemoryUserRepository() usecase.UserRepository {
	return &InMemoryUserRepository{}
}

func (r *InMemoryUserRepository) FindByID(id string) (*domain.User, error) {
	if id == "123" {
		return &domain.User{ID: "123", Name: "John Doe"}, nil
	}
	if id == "456" {
		return &domain.User{ID: "456", Name: "Jane Smith"}, nil
	}

	return nil, nil
}
