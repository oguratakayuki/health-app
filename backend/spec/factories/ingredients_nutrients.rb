FactoryBot.define do
  factory :ingredients_nutrient do
    ingredient
    nutrient
    content_quantity
    content_unit { "kcal" }
    content_unit_per { 100 }
    content_unit_per_unit { "g" }
  end
end

 
