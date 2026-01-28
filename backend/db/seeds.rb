# frozen_string_literal: true

# --- 1. 単位定義 ---
UNIT_KCAL = "kcal"
UNIT_G    = "g"
UNIT_MG   = "mg"
UNIT_UG   = "μg"
UNIT_PCT  = "energy_percent" # "％エネルギー"

# --- 2. 栄養素マスタの作成 ---
# --- 2. 栄養素マスタの作成 ---
nutrients_list = {
  "エネルギー"   => UNIT_KCAL,
  "たんぱく質"   => UNIT_G,
  "脂質"         => UNIT_PCT,
  "炭水化物"     => UNIT_PCT,
  "食物繊維"     => UNIT_G,
  "ビタミンA"    => UNIT_UG,
  "ビタミンC"    => UNIT_MG,
  "ビタミンD"    => UNIT_UG,
  "カルシウム"   => UNIT_MG,
  "鉄"           => UNIT_MG,
  "亜鉛"         => UNIT_MG,
  "カリウム"     => UNIT_MG
}


nutrients_list.each do |name, unit|
  Nutrient.find_or_create_by!(name: name)
end

# --- 3. レーダーチャート定義の作成 ---
charts = [
  { name: "主要栄養サマリー", slug: "summary", items: ["エネルギー", "たんぱく質", "食物繊維", "カルシウム", "鉄", "ビタミンC"] },
  { name: "PFCバランス", slug: "pfc", items: ["たんぱく質", "脂質", "炭水化物"] },
  { name: "ビタミン類", slug: "vitamins", items: ["ビタミンA", "ビタミンC", "ビタミンD"] },
  { name: "ミネラル類", slug: "minerals", items: ["カルシウム", "鉄", "亜鉛", "カリウム"] }
]

charts.each_with_index do |c, idx|
  chart = RadarChart.find_or_create_by!(slug: c[:slug]) do |rc|
    rc.name = c[:name]
    rc.display_order = idx
  end
  c[:items].each_with_index do |n_name, pos|
    nutrient = Nutrient.find_by(name: n_name)
    RadarChartItem.find_or_create_by!(radar_chart: chart, nutrient: nutrient) do |item|
      item.position = pos
    end
  end
end

# --- 4. 摂取基準データ (30-70歳+、男女) ---
intake_standards = [
  [0, 30, 49, {"エネルギー"=>2700, "たんぱく質"=>65, "脂質"=>25, "炭水化物"=>60, "食物繊維"=>21, "ビタミンA"=>900, "ビタミンC"=>100, "ビタミンD"=>8.5, "カルシウム"=>750, "鉄"=>7.5, "亜鉛"=>11, "カリウム"=>3000}],
  [0, 50, 74, {"エネルギー"=>2400, "たんぱく質"=>65, "脂質"=>25, "炭水化物"=>60, "食物繊維"=>20, "ビタミンA"=>900, "ビタミンC"=>100, "ビタミンD"=>8.5, "カルシウム"=>750, "鉄"=>7.5, "亜鉛"=>11, "カリウム"=>3000}],
  [0, 75, 120, {"エネルギー"=>2100, "たんぱく質"=>60, "脂質"=>25, "炭水化物"=>60, "食物繊維"=>19, "ビタミンA"=>850, "ビタミンC"=>100, "ビタミンD"=>8.5, "カルシウム"=>700, "鉄"=>7.0, "亜鉛"=>10, "カリウム"=>3000}],
  [1, 30, 49, {"エネルギー"=>2050, "たんぱく質"=>50, "脂質"=>25, "炭水化物"=>60, "食物繊維"=>18, "ビタミンA"=>700, "ビタミンC"=>100, "ビタミンD"=>8.5, "カルシウム"=>650, "鉄"=>10.5, "亜鉛"=>8, "カリウム"=>2600}],
  [1, 50, 74, {"エネルギー"=>1900, "たんぱく質"=>50, "脂質"=>25, "炭水化物"=>60, "食物繊維"=>17, "ビタミンA"=>700, "ビタミンC"=>100, "ビタミンD"=>8.5, "カルシウム"=>650, "鉄"=>6.5, "亜鉛"=>8, "カリウム"=>2600}],
  [1, 75, 120, {"エネルギー"=>1650, "たんぱく質"=>50, "脂質"=>25, "炭水化物"=>60, "食物繊維"=>16, "ビタミンA"=>650, "ビタミンC"=>100, "ビタミンD"=>8.5, "カルシウム"=>600, "鉄"=>6.0, "亜鉛"=>8, "カリウム"=>2600}]
]

intake_standards.each do |gender, a_from, a_to, values|
  values.each do |n_name, val|
    nutrient = Nutrient.find_by(name: n_name)
    NutrientsIntakeStandard.find_or_create_by!(
      nutrient: nutrient, gender: gender, age_from: a_from, age_to: a_to, content: val, unit: nutrients_list[n_name]
    )
  end
end

user = User.find_or_create_by!(email: "test@example.com")

# --- 1. 食材マスターの作成 (白米、植物油、ソースを追加) ---
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

ingredients = {}
ingredients_data.each do |data|
  ingredients[data[:name]] = Ingredient.find_or_create_by!(name: data[:name]) do |i|
    i.original_name = data[:original_name]
  end
end

# --- 2. 食材ごとの栄養素（100gあたり）の登録 ---
nutrient_values = {
  "豚肉" => { "エネルギー" => 263, "たんぱく質" => 19, "脂質" => 19 },
  "じゃがいも" => { "エネルギー" => 76, "たんぱく質" => 1.6, "炭水化物" => 17 },
  "にんじん" => { "エネルギー" => 37, "ビタミンA" => 700, "食物繊維" => 2.8 },
  "中華麺" => { "エネルギー" => 198, "たんぱく質" => 5, "炭水化物" => 40 },
  "キャベツ" => { "エネルギー" => 23, "ビタミンC" => 40, "食物繊維" => 1.8 },
  "白米" => { "エネルギー" => 156, "たんぱく質" => 2.5, "炭水化物" => 37.1 },
  "植物油" => { "エネルギー" => 921, "脂質" => 100 },
  "ソース" => { "エネルギー" => 132, "炭水化物" => 30 }
}

nutrient_values.each do |ing_name, nuts|
  ing = ingredients[ing_name]
  nuts.each do |n_name, val|
    nutrient = Nutrient.find_by(name: n_name)
    next unless nutrient

    # 単位の自動判別ロジック
    unit_str = case n_name
               when "エネルギー" then "kcal"
               when "ビタミンA" then "μg"
               when "ビタミンC", "カルシウム", "鉄", "亜鉛", "カリウム" then "mg"
               else "g"
               end

    IngredientNutrient.find_or_create_by!(
      ingredient_id: ing.id,
      nutrient_id: nutrient.id,
      content_quantity: val,
      content_unit: unit_str,
      content_unit_per: 100,
      content_unit_per_unit: "g"
    )
  end
end

# --- 3. 料理マスターの作成 ---
curry = Dish.find_or_create_by!(name: "カレーライス")
yakisoba = Dish.find_or_create_by!(name: "焼きそば")

# 料理の材料を紐付け (g単位)
dish_recipe = [
  { dish: curry, ing: "豚肉", qty: 50 },
  { dish: curry, ing: "じゃがいも", qty: 100 },
  { dish: curry, ing: "にんじん", qty: 30 },
  { dish: curry, ing: "白米", qty: 200 }, # カレーにライスを追加
  { dish: curry, ing: "植物油", qty: 5 },  # 調理油
  { dish: yakisoba, ing: "中華麺", qty: 150 },
  { dish: yakisoba, ing: "豚肉", qty: 30 },
  { dish: yakisoba, ing: "キャベツ", qty: 50 },
  { dish: yakisoba, ing: "植物油", qty: 10 }, # 焼きそばに油を追加
  { dish: yakisoba, ing: "ソース", qty: 30 }  # ソースを追加
]

dish_recipe.each do |item|
  DishIngredient.find_or_create_by!(
    dish: item[:dish],
    ingredient: ingredients[item[:ing]],
    content_quantity: item[:qty],
    content_unit: "g"
  )
end

# --- 4. 食事履歴の作成 ---
meal_1 = Meal.find_or_create_by!(user: user, meal_date: Date.new(2026, 1, 17), category: :dinner)
MealDish.find_or_create_by!(meal: meal_1, dish: curry)

meal_2 = Meal.find_or_create_by!(user: user, meal_date: Date.new(2026, 1, 18), category: :lunch)
MealDish.find_or_create_by!(meal: meal_2, dish: yakisoba)

puts "Seeds created successfully with fixed units and ingredients."
