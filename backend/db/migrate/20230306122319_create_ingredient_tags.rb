# frozen_string_literal: true

class CreateIngredientTags < ActiveRecord::Migration[6.1]
  def change
    create_table :ingredient_tags do |t|
      t.bigint :ingredient_id
      t.bigint :tag_id

      t.timestamps
    end
  end
end
