package domain

import "gorm.io/gorm"

// User はユーザーエンティティを表します。
type User struct {
	gorm.Model
	Email string `gorm:"uniqueIndex;type:varchar(255)"`
}

// UserUpdateInput はユーザー更新時の入力データを表します。
type UserUpdateInput struct {
	Email string `json:"email"`
}
