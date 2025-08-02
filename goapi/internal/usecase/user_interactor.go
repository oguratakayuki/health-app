// internal/usecase/user_interactor.go
package usecase

import (
	"fmt"
	"goapi/internal/domain" 
)

type UserUseCase interface {
	GetUserByID(id string) (*domain.User, error)
	// 他のユースケースメソッドもここに追加
}

type UserInteractor struct {
	UserRepository UserRepository
}

// NewUserInteractor はUserInteractorの新しいインスタンスを作成します。
// NewUserInteractorの戻り値の型をインターフェースにする
func NewUserInteractor(r UserRepository) UserUseCase {
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
		return nil, ErrUserNotFound // ErrUserNotFound を使用
	}

	return user, nil
}
