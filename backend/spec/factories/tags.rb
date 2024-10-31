FactoryBot.define do
  factory :tag do
    name { Faker::Commerce.product_name }
  end
end
 
