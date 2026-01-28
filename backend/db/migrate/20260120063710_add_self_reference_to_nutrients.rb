class AddSelfReferenceToNutrients < ActiveRecord::Migration[6.1]
 def change
    # add_foreign_key :nutrients, :nutrients, column: :parent_id
  end
end
