package repository

import (
	"errors"
	"goapi/internal/domain"
	"goapi/internal/usecase"

	"gorm.io/gorm"
)

// GormUserRepository はusecase.UserRepositoryインターフェースのGorm実装です。
type GormUserRepository struct {
	db *gorm.DB
}

// NewGormUserRepository はGormUserRepositoryの新しいインスタンスを作成します。
func NewGormUserRepository(db *gorm.DB) usecase.UserRepository {
	return &GormUserRepository{
		db: db,
	}
}

// FindByID は指定されたIDのユーザーをデータベースから取得します。
func (r *GormUserRepository) FindByID(id int64) (*domain.User, error) {
	var user domain.User
	result := r.db.First(&user, id)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, nil // ユーザーが見つからない場合は nil, nil を返す
		}
		return nil, result.Error
	}
	return &user, nil
}

// Update は指定されたユーザー情報をデータベースで更新します。
func (r *GormUserRepository) Update(user *domain.User) (*domain.User, error) {
	result := r.db.Save(user)
	if result.Error != nil {
		return nil, result.Error
	}
	return user, nil
}
