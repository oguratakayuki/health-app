class CreateDishIngredients < ActiveRecord::Migration[6.1]
  def change
    create_table :dish_ingredients, comment: "料理に使用した食材" do |t|
      t.references :dish, null: false, foreign_key: true

      t.references :ingredient, null: false, foreign_key: true

      t.float :content_quantity,
        comment: "量",
        null: false,
        default: 0.0

      t.string :content_unit,
        comment: "量の単位",
        null: false

      t.timestamps
    end
  end
end
