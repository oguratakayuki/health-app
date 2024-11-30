# frozen_string_literal: true

FactoryBot.define do
  factory :ingredient_tag do
    ingredient
    tag
  end
end
