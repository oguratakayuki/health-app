# frozen_string_literal: true

class AddOriginalNameToIngredients < ActiveRecord::Migration[6.1]
  def change
    add_column :ingredients, :original_name, :string
  end
end
