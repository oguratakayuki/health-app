# frozen_string_literal: true

class CreateIngredients < ActiveRecord::Migration[6.1]
  def change
    create_table :ingredients do |t|
      t.string :name
      t.text   :remarks

      t.timestamps
    end
  end
end
