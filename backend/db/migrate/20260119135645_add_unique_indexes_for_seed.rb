class AddUniqueIndexesForSeed < ActiveRecord::Migration[6.1]
  def change
    add_index :ingredients, :name, unique: true

    add_index :ingredient_nutrients,
              [:ingredient_id, :nutrient_id],
              unique: true,
              name: :index_ingredient_nutrients_on_ingredient_and_nutrient
  end
end
