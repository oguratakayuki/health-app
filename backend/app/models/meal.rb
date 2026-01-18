class Meal < ApplicationRecord
  belongs_to :user
  has_many :meal_ingredients, dependent: :destroy
  has_many :ingredients, through: :meal_ingredients
  has_many :meal_dishes, dependent: :destroy
  has_many :dishes, through: :meal_dishes

  validates :meal_date, presence: true
  validates :category, presence: true
  validates :user_id, presence: true

  enum category: { 
    breakfast: 'breakfast', 
    lunch: 'lunch', 
    dinner: 'dinner', 
    snack: 'snack' 
  }
end
