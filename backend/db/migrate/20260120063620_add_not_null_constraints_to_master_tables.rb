class AddNotNullConstraintsToMasterTables < ActiveRecord::Migration[6.1]
  def change
    change_column_null :ingredients, :name, false
    change_column_null :nutrients, :name, false
    change_column_null :dishes, :name, false
  end
end
