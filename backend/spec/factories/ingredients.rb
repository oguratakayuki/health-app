FactoryBot.define do
  factory :ingredient do
    name { Faker::Company.unique.name }
    original_name { Faker::Company.unique.name }
    remarks { Faker::Company.unique.name }
  end
end
