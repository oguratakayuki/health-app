class CreateMealDishes < ActiveRecord::Migration[6.1]
  def change
    create_table :meal_dishes, comment: "食事の各料理" do |t|
      t.references :meal, null: false, foreign_key: true

      t.references :dish, null: false, foreign_key: true

      t.timestamps
    end
    add_index :meal_dishes, [:meal_id, :dish_id], unique: true
  end
end
