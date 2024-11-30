# frozen_string_literal: true

class AddParentIdToToNutrients < ActiveRecord::Migration[6.1]
  def change
    add_column :nutrients, :parent_id, :integer
  end
end
