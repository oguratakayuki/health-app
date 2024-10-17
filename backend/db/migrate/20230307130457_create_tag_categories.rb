class CreateTagCategories < ActiveRecord::Migration[6.1]
  def change
    create_table :tag_categories do |t|
      t.integer :tag_id
      t.integer :category_id

      t.timestamps
    end
  end
end
