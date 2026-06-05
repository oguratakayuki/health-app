# frozen_string_literal: true

nutrient = Nutrient.find_or_create_by!(code: "carbohydrate_g") { |n| n.name = "炭水化物" }
data = {
  "じゃがいも" => 17,
  "中華麺" => 40,
  "白米" => 37.1,
  "ソース" => 30,
  "豚骨" => 0,
  "豚脂" => 0,
  "長ねぎ" => 4.5,
  "鶏ガラスープの素" => 50,
  "もやし" => 1.8,
  "味付卵" => 5
}

data.each do |ing_name, val|
  ing = Ingredient.find_or_create_by!(name: ing_name)
  IngredientNutrient.find_or_create_by!(
    ingredient: ing,
    nutrient: nutrient,
    content_quantity: val,
    content_unit: "g",
    content_unit_per: 100,
    content_unit_per_unit: "g"
  )
end
