# frozen_string_literal: true

FactoryBot.define do
  factory :ingredient_nutrient do
    ingredient
    nutrient
    content_quantity { 1 }
    content_unit { 'kcal' }
    content_unit_per { 100 }
    content_unit_per_unit { 'g' }
  end
end
