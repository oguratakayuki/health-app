# frozen_string_literal: true

class CreateNutrientsRelations < ActiveRecord::Migration[6.1]
  def change
    create_table :nutrients_relations do |t|
      t.integer :parent_id
      t.integer :child_id

      t.timestamps
    end
  end
end
