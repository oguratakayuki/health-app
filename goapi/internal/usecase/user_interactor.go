package usecase

import (
	"goapi/internal/domain"
	"errors"
)

// UserRepository はユーザーデータへのアクセスを抽象化するインターフェースです。
type UserRepository interface {
	FindByID(id int64) (*domain.User, error)
	Update(user *domain.User) (*domain.User, error)
}

// UserUseCase はユーザー関連のビジネスロジックを定義するインターフェースです。
type UserUseCase interface {
	GetUserByID(id int64) (*domain.User, error)
	UpdateUser(user *domain.User) (*domain.User, error)
}

var ErrUserNotFound = errors.New("user not found")

type UserInteractor struct {
	UserRepository UserRepository
}

func NewUserInteractor(r UserRepository) UserUseCase {
	return &UserInteractor{
		UserRepository: r,
	}
}

func (ui *UserInteractor) GetUserByID(id int64) (*domain.User, error) {
	user, err := ui.UserRepository.FindByID(id)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, ErrUserNotFound
	}
	return user, nil
}

func (ui *UserInteractor) UpdateUser(user *domain.User) (*domain.User, error) {
	updatedUser, err := ui.UserRepository.Update(user)
	if err != nil {
		return nil, err
	}
	return updatedUser, nil
}
