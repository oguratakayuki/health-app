# frozen_string_literal: true

FactoryBot.define do
  factory :tag do
    name { Faker::Commerce.product_name }
  end
end
