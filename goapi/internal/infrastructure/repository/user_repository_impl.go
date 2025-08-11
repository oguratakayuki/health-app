package repository

import (
	"errors"
	"goapi/internal/domain"
	"goapi/internal/usecase"

	"gorm.io/gorm"
)

// usecase.UserRepositoryインターフェースの実装
type GormUserRepository struct {
	db *gorm.DB
}

func NewGormUserRepository(db *gorm.DB) usecase.UserRepository {
	return &GormUserRepository{
		db: db,
	}
}

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

func (r *GormUserRepository) Update(user *domain.User) (*domain.User, error) {
	result := r.db.Save(user)
	if result.Error != nil {
		return nil, result.Error
	}
	return user, nil
}

func (r *GormUserRepository) Create(user *domain.User) (*domain.User, error) {
	result := r.db.Create(user)
	if result.Error != nil {
		return nil, result.Error
	}
	return user, nil
}

func (r *GormUserRepository) Delete(id int64) error {
	result := r.db.Delete(&domain.User{}, id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("user not found")
	}
	return nil
}

func (r *GormUserRepository) FindAll() ([]*domain.User, error) {
	var users []*domain.User
	result := r.db.Find(&users)
	if result.Error != nil {
		return nil, result.Error
	}
	return users, nil
}
