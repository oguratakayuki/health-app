package usecase

import (
	"goapi/internal/domain"
	"errors"
)

// ユーザーデータへのアクセスを抽象化
type UserRepository interface {
	FindByID(id int64) (*domain.User, error)
	Update(user *domain.User) (*domain.User, error)
  FindAll() ([]*domain.User, error)
  Create(user *domain.User) (*domain.User, error)
  Delete(id int64) error
}

// ユーザー関連のビジネスロジックを定義
type UserUseCase interface {
	// test
  GetUserByID(id int64) (*domain.User, error)
  UpdateUser(id int64, user *domain.User) (*domain.User, error)
  ListUsers() ([]*domain.User, error)
  CreateUser(user *domain.User) (*domain.User, error)
  DeleteUser(id int64) error
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

func (ui *UserInteractor) UpdateUser(id int64, user *domain.User) (*domain.User, error) {
	updatedUser, err := ui.UserRepository.Update(user)
	if err != nil {
		return nil, err
	}
	return updatedUser, nil
}

func (ui *UserInteractor) ListUsers() ([]*domain.User, error) {
    return ui.UserRepository.FindAll()
}

func (ui *UserInteractor) CreateUser(user *domain.User) (*domain.User, error) {
    return ui.UserRepository.Create(user)
}

func (ui *UserInteractor) DeleteUser(id int64) error {
    return ui.UserRepository.Delete(id)
}
