class CreateIngredientTags < ActiveRecord::Migration[6.1]
  def change
    create_table :ingredient_tags do |t|
      t.integer :ingredient_id
      t.integer :tag_id

      t.timestamps
    end
  end
end
