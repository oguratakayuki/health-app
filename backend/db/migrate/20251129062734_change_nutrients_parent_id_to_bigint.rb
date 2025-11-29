class ChangeNutrientsParentIdToBigint < ActiveRecord::Migration[6.1]
  def up
    change_column :nutrients, :parent_id, :bigint
    add_foreign_key :nutrients, :nutrients, column: :parent_id
  end

  def down
    remove_foreign_key :nutrients, column: :parent_id if foreign_key_exists?(:nutrients, column: :parent_id)
    change_column :nutrients, :parent_id, :integer
  end
end
