// internal/usecase/user_repository.go
package usecase

import "goapi/internal/domain"

type UserRepository interface {
	FindByID(id string) (*domain.User, error)
	Update(user *domain.User) (*domain.User, error)
}
