package domain

import "time"

type User struct {
	ID        int64      `json:"id" gorm:"primaryKey"`
	Email     string     `json:"email"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
	DeletedAt *time.Time `json:"deleted_at,omitempty"`
}

type UserUpdateInput struct {
	Email string `json:"email"`
}
