module IngredientsNutrientsImportService
  class IngredientsNutrientsMapper

    include ActiveModel::Model
    include ActiveModel::Attributes

    attribute :ingredient_entity
    attribute :nutrients_unit_entity
    attribute :nutrient
    # ingredients_id どの食品
    # nutrient_id どの栄養
    
    def execute
      ingredient = Ingredient.find_or_create_by(original_name: ingredient_entity.original_name)
      ingredient_entity.tags.each do |tag|
        tag = Tag.find_or_create_by(name: tag)
        IngredientTag.find_or_create_by(ingredient_id: ingredient.id, tag_id: tag.id)
      end
      IngredientNutrient.new(
        ingredient: ingredient,
        nutrient: nutrient,
        content_quantity: nutrients_unit_entity.content_quantity,
        content_unit: nutrients_unit_entity.content_unit,
        content_unit_per: nutrients_unit_entity.content_unit_per,
        content_unit_per_unit: nutrients_unit_entity.content_unit_per_unit
      )
    end
  end
end

