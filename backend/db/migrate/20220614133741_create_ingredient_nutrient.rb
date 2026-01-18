# frozen_string_literal: true

class CreateIngredientNutrient < ActiveRecord::Migration[6.1]
  def change
    create_table :ingredient_nutrients, comment: '食材に含まれる栄養素マスタ' do |t|
      t.references :ingredient
      t.references :nutrient
      t.integer :content_quantity, comment: "含有量（例: 30mgの「30」）"
      t.string :content_unit, comment: "含有量の単位（例: 30mgの「mg」）"
      t.integer :content_unit_per, comment: "基準量（例: 100gあたりの「100」）"
      t.string :content_unit_per_unit, comment: "基準量の単位（例: 100gあたりの「g」）"

      t.timestamps
    end
  end
end
