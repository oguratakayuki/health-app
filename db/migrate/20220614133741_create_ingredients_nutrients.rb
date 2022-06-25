class CreateIngredientsNutrients < ActiveRecord::Migration[6.1]
  def change
    create_table :ingredients_nutrients do |t|
      t.references :ingredients
      t.references :nutrients
      t.integer :content_quantity
      t.string :content_unit
      t.integer :content_unit_per
      t.string :content_unit_per_unit

      t.timestamps
    end
  end
end
