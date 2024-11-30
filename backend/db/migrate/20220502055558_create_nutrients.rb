# frozen_string_literal: true

class CreateNutrients < ActiveRecord::Migration[6.1]
  def change
    create_table :nutrients do |t|
      t.string :name

      t.timestamps
    end
  end
end
