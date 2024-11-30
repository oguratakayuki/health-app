# frozen_string_literal: true

class CreateIngredientNutrient < ActiveRecord::Migration[6.1]
  def change
    create_table :ingredient_nutrients do |t|
      t.references :ingredient
      t.references :nutrient
      t.integer :content_quantity
      t.string :content_unit
      t.integer :content_unit_per
      t.string :content_unit_per_unit

      t.timestamps
    end
  end
end
