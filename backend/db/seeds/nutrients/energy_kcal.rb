# frozen_string_literal: true

nutrient = Nutrient.find_or_create_by!(code: "energy_kcal") { |n| n.name = "エネルギー" }
data = {
  "豚肉" => 263,
  "じゃがいも" => 76,
  "にんじん" => 37,
  "中華麺" => 198,
  "キャベツ" => 23,
  "白米" => 156,
  "植物油" => 921,
  "ソース" => 132
}

data.each do |ing_name, val|
  ing = Ingredient.find_or_create_by!(name: ing_name)
  IngredientNutrient.find_or_create_by!(
    ingredient: ing,
    nutrient: nutrient,
    content_quantity: val,
    content_unit: "kcal",
    content_unit_per: 100,
    content_unit_per_unit: "g"
  )
end
