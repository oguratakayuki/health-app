class AddUniqueIndexToNutrientsName < ActiveRecord::Migration[6.1]
  def change
    add_index :nutrients, :name, unique: true
  end
end
