class AddConstraintsToIngredientNutrients < ActiveRecord::Migration[6.1]
  def change
    change_column_null :ingredient_nutrients, :ingredient_id, false
    change_column_null :ingredient_nutrients, :nutrient_id, false

    add_foreign_key :ingredient_nutrients, :ingredients
    add_foreign_key :ingredient_nutrients, :nutrients
  end
end
