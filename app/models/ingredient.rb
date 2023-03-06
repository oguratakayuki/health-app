class Ingredient < ApplicationRecord
  has_many :ingredient_tags
  has_many :tags, through :ingredient_tags
  has_many :ingredients_nutrients
  has_many :nutrients, through :ingredients_nutrients
end
