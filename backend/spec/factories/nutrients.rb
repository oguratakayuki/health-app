# frozen_string_literal: true

FactoryBot.define do
  factory :nutrient do
    name { Faker::Commerce.product_name }
    parent_id { nil }
  end
end
