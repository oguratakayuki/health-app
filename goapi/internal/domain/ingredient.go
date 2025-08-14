package domain

import (
	"time"
)

type Ingredient struct {
	ID           int64     `gorm:"primaryKey;autoIncrement" json:"id"`
	Name         string    `gorm:"type:varchar(255)" json:"name"`
	Remarks      string    `gorm:"type:text" json:"remarks"`
	CreatedAt    time.Time `gorm:"type:datetime(6);not null" json:"created_at"`
	UpdatedAt    time.Time `gorm:"type:datetime(6);not null" json:"updated_at"`
	OriginalName string    `gorm:"type:varchar(255)" json:"original_name"`
}

// TableName 明示的にテーブル名を指定
func (Ingredient) TableName() string {
	return "ingredients"
}

