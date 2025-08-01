// internal/usecase/user_interactor.go
package usecase

import (
	"errors"
	"fmt"
	"goapi/internal/domain" 
)

type UserInteractor struct {
	UserRepository UserRepository
}

func NewUserInteractor(r UserRepository) *UserInteractor {
	return &UserInteractor{
		UserRepository: r,
	}
}

func (ui *UserInteractor) GetUserByID(id string) (*domain.User, error) {
	user, err := ui.UserRepository.FindByID(id)
	if err != nil {
		// データベースエラーの場合
		return nil, fmt.Errorf("failed to get user by ID from repository: %w", err)
	}
	if user == nil {
		// ユーザーが見つからない場合
		return nil, errors.New("user not found")
	}

	return user, nil
}
