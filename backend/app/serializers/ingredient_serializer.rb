# frozen_string_literal: true

class IngredientSerializer
  include JSONAPI::Serializer
  has_many :ingredient_nutrients, serializer: IngredientNutrientSerializer
  has_many :nutrients, through: :ingredient_nutrients, serializer: NutrientSerializer

  attributes :name, :remarks, :original_name
end
