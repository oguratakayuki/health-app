# frozen_string_literal: true

class IngredientNutrientSerializer
  include JSONAPI::Serializer
  belongs_to :ingredient
  belongs_to :nutrient

  attributes :content_quantity, :content_unit, :content_unit_per, :content_unit_per_unit
end
