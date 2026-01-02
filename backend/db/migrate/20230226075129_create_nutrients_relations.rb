# frozen_string_literal: true

class CreateNutrientsRelations < ActiveRecord::Migration[6.1]
  def change
    create_table :nutrients_relations do |t|
      t.bigint :parent_id
      t.bigint :child_id

      t.timestamps
    end
  end
end
