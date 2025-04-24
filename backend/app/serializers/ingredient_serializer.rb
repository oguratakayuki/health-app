# frozen_string_literal: true

class IngredientSerializer
  include JSONAPI::Serializer
  has_many :ingredient_nutrients, serializer: IngredientNutrientSerializer
  has_many :nutrients, through: :ingredient_nutrients, serializer: NutrientSerializer
  has_many :ingredient_tags, dependent: :destroy, serializer: IngredientTagSerializer
  has_many :tags, through: :ingredient_tags, dependent: :destroy, serializer: TagSerializer

  attributes :name, :remarks, :original_name
end
