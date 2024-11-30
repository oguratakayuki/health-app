# frozen_string_literal: true

class IngredientNutrient < ApplicationRecord
  belongs_to :ingredient
  belongs_to :nutrient
end
