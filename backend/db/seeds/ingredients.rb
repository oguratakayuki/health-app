# frozen_string_literal: true

ingredients_data = [
  { name: "豚肉", original_name: "豚ロース" },
  { name: "じゃがいも", original_name: "男爵" },
  { name: "にんじん", original_name: "にんじん" },
  { name: "中華麺", original_name: "蒸し麺" },
  { name: "キャベツ", original_name: "キャベツ" },
  { name: "白米", original_name: "精白米（めし）" },
  { name: "植物油", original_name: "サラダ油" },
  { name: "ソース", original_name: "濃厚ソース" }
]

ingredients_data.each do |data|
  Ingredient.find_or_create_by!(name: data[:name]) do |i|
    i.original_name = data[:original_name]
  end
end
