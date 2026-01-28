class AddUniqueConstraintToMeals < ActiveRecord::Migration[6.1]
  def up
    add_index :meals, [:user_id, :meal_date, :category], 
              unique: true, 
              name: 'index_meals_on_user_id_meal_date_category_unique'
  end

  def down
    # インデックスを削除
    remove_index :meals, name: 'index_meals_on_user_id_meal_date_category_unique'
  end
end
