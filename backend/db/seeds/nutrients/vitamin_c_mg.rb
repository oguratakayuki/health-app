# frozen_string_literal: true

nutrient = Nutrient.find_or_create_by!(code: "vitamin_c_mg") { |n| n.name = "ビタミンC" }
data = {
  "キャベツ" => 40,
  "豚骨" => 0,
  "豚脂" => 0,
  "長ねぎ" => 20,
  "鶏ガラスープの素" => 0,
  "もやし" => 25,
  "味付卵" => 0
}

data.each do |ing_name, val|
  ing = Ingredient.find_or_create_by!(name: ing_name)
  IngredientNutrient.find_or_create_by!(
    ingredient: ing,
    nutrient: nutrient,
    content_quantity: val,
    content_unit: "mg",
    content_unit_per: 100,
    content_unit_per_unit: "g"
  )
end
