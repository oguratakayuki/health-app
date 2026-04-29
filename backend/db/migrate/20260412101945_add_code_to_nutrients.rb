class AddCodeToNutrients < ActiveRecord::Migration[6.1]
  def change
    add_column :nutrients, :code, :string
    add_index :nutrients, :code, unique: true
    change_column_null :nutrients, :code, false
  end
end
