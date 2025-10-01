class MealIngredient < ApplicationRecord
  belongs_to :meal
  belongs_to :ingredient

  validates :ingredient_id, uniqueness: { scope: :meal_id }
end
