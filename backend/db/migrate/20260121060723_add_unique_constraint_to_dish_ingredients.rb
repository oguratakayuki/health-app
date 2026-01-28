class AddUniqueConstraintToDishIngredients < ActiveRecord::Migration[6.1]
  def up
    # 既存の重複データを削除（必要な場合）
    # 重複しているデータがあれば削除
    duplicate_records = DishIngredient.select('dish_id, ingredient_id, MIN(id) as min_id')
                                      .group(:dish_id, :ingredient_id)
                                      .having('COUNT(*) > 1')
    duplicate_records.each do |record|
      DishIngredient.where(dish_id: record.dish_id, ingredient_id: record.ingredient_id)
                    .where.not(id: record.min_id)
                    .delete_all
    end
    # 複合ユニークインデックスを追加
    add_index :dish_ingredients, [:dish_id, :ingredient_id], unique: true, name: 'index_dish_ingredients_on_dish_id_and_ingredient_id_unique'
  end

  def down
    # インデックスを削除
    remove_index :dish_ingredients, name: 'index_dish_ingredients_on_dish_id_and_ingredient_id_unique'
  end
end
