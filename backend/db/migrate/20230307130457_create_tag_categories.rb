# frozen_string_literal: true

class CreateTagCategories < ActiveRecord::Migration[6.1]
  def change
    create_table :tag_categories do |t|
      t.bigint :tag_id
      t.bigint :category_id

      t.timestamps
    end
  end
end
