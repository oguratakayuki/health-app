# frozen_string_literal: true

# --- 1. 単位定義 ---
UNIT_KCAL = "kcal"
UNIT_G    = "g"
UNIT_MG   = "mg"
UNIT_UG   = "μg"
UNIT_PCT  = "energy_percent" # "％エネルギー"

# --- 2. 栄養素マスタの作成 ---
nutrients_list = {
  "エネルギー" => { code: "energy_kcal", unit: UNIT_KCAL },
  "たんぱく質" => { code: "protein_g", unit: UNIT_G },
  "脂質"       => { code: "fat_g", unit: UNIT_PCT },
  "炭水化物"   => { code: "carbohydrate_g", unit: UNIT_PCT },
  "食物繊維"   => { code: "fiber_g", unit: UNIT_G },
  "ビタミンA"  => { code: "vitamin_a_ug", unit: UNIT_UG },
  "ビタミンC"  => { code: "vitamin_c_mg", unit: UNIT_MG },
  "ビタミンD"  => { code: "vitamin_d_ug", unit: UNIT_UG },
  "カルシウム" => { code: "calcium_mg", unit: UNIT_MG },
  "鉄"         => { code: "iron_mg", unit: UNIT_MG },
  "亜鉛"       => { code: "zinc_mg", unit: UNIT_MG },
  "カリウム"   => { code: "potassium_mg", unit: UNIT_MG }
}

nutrients = {}
nutrients_list.each do |name, data|
  nutrients[name] = Nutrient.find_or_create_by!(code: data[:code]) do |n|
    n.name = name
  end
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
    nutrient = nutrients[n_name]
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
    nutrient = nutrients[n_name]
    NutrientsIntakeStandard.find_or_create_by!(
      nutrient: nutrient, gender: gender, age_from: a_from, age_to: a_to, content: val, unit: nutrients_list[n_name][:unit]
    )
  end
end

user = User.find_or_create_by!(email: "test@example.com")

# --- 5. 食材マスターの作成 ---
load Rails.root.join("db/seeds/ingredients.rb")

# --- 6. 栄養素データのロード (分割ファイル) ---
Dir.glob(Rails.root.join("db/seeds/nutrients/*.rb")).sort.each do |file|
  load file
end

# --- 7. 料理マスターの作成 ---
curry = Dish.find_or_create_by!(name: "カレーライス")
yakisoba = Dish.find_or_create_by!(name: "焼きそば")

dish_recipe = [
  { dish: curry, ing: "豚肉", qty: 50 },
  { dish: curry, ing: "じゃがいも", qty: 100 },
  { dish: curry, ing: "にんじん", qty: 30 },
  { dish: curry, ing: "白米", qty: 200 },
  { dish: curry, ing: "植物油", qty: 5 },
  { dish: yakisoba, ing: "中華麺", qty: 150 },
  { dish: yakisoba, ing: "豚肉", qty: 30 },
  { dish: yakisoba, ing: "キャベツ", qty: 50 },
  { dish: yakisoba, ing: "植物油", qty: 10 },
  { dish: yakisoba, ing: "ソース", qty: 30 }
]

dish_recipe.each do |item|
  DishIngredient.find_or_create_by!(
    dish: item[:dish],
    ingredient: Ingredient.find_by!(name: item[:ing]),
    content_quantity: item[:qty],
    content_unit: "g"
  )
end

# --- 8. 食事履歴の作成 ---
meal_1 = Meal.find_or_create_by!(user: user, meal_date: Date.new(2026, 1, 17), category: :dinner, start_time: "19:00", end_time: "19:30")
MealDish.find_or_create_by!(meal: meal_1, dish: curry)

meal_2 = Meal.find_or_create_by!(user: user, meal_date: Date.new(2026, 1, 18), category: :lunch, start_time: "11:30", end_time: "12:30")
MealDish.find_or_create_by!(meal: meal_2, dish: yakisoba)

puts "Seeds created successfully with split nutrient files."
