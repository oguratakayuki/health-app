class DropMealIngredients < ActiveRecord::Migration[6.1]
  def change
    drop_table :meal_ingredients
  end
end
