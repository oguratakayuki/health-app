class Dish < ApplicationRecord
  has_many :dish_ingredients, dependent: :destroy
  has_many :ingredients, through: :dish_ingredients
  has_many :meal_dishes
  has_many :meals, through: :meal_dishes
end
