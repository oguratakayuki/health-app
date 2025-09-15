package domain

import "time"

type IngredientNutrient struct {
    ID                  uint      `json:"id" gorm:"primaryKey"`
    IngredientID        uint      `json:"ingredient_id"`
    NutrientID          uint      `json:"nutrient_id"`
    ContentQuantity     int       `json:"content_quantity"`
    ContentUnit         string    `json:"content_unit"`
    ContentUnitPer      int       `json:"content_unit_per"`
    ContentUnitPerUnit  string    `json:"content_unit_per_unit"`
    CreatedAt           time.Time `json:"created_at"`
    UpdatedAt           time.Time `json:"updated_at"`
}
