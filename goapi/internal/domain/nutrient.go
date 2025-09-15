package domain

import "time"

type Nutrient struct {
    ID        uint      `json:"id" gorm:"primaryKey"`
    Name      string    `json:"name"`
    ParentID  *uint     `json:"parent_id"`
    CreatedAt time.Time `json:"created_at"`
    UpdatedAt time.Time `json:"updated_at"`
}
