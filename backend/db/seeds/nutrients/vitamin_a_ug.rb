# frozen_string_literal: true

nutrient = Nutrient.find_or_create_by!(code: "vitamin_a_ug") { |n| n.name = "ビタミンA" }
data = {
  "にんじん" => 700
}

data.each do |ing_name, val|
  ing = Ingredient.find_or_create_by!(name: ing_name)
  IngredientNutrient.find_or_create_by!(
    ingredient: ing,
    nutrient: nutrient,
    content_quantity: val,
    content_unit: "μg",
    content_unit_per: 100,
    content_unit_per_unit: "g"
  )
end
