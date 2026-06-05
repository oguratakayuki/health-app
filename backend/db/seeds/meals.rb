# frozen_string_literal: true

user = User.find_by!(email: "test@example.com")
dishes = Dish.all.to_a

# カテゴリ別の料理割り当て
dish_categories = {
  breakfast: [" french toast", "オムレツ", "だし巻き卵", "サラダ", "味噌汁"],
  lunch: ["焼きそば", "親子丼", "チャーハン", "パスタ・トマトソース", "オムライス"],
  dinner: ["カレーライス", "肉じゃが", "ハンバーグ", "鶏の照り焼き", "餃子", "豚の生姜焼き", "鯖の味噌煮", "唐揚げ", "肉野菜炒め", "ポトフ", "久留米系濃厚豚骨ラーメン"]
}

# 存在しない料理名がある場合に備え、実際に存在する料理だけに絞り込む
dish_categories.each do |cat, names|
  dish_categories[cat] = names.select { |n| Dish.exists?(name: n) }
end

start_date = Date.new(2026, 1, 1)
end_date = Date.new(2026, 2, 10)

(start_date..end_date).each do |date|
  # 朝食
  if dish_categories[:breakfast].any?
    breakfast_dish_name = dish_categories[:breakfast].sample
    meal_b = Meal.find_or_create_by!(
      user: user, meal_date: date, category: :breakfast, 
      start_time: "07:00", end_time: "08:00"
    )
    MealDish.find_or_create_by!(meal: meal_b, dish: Dish.find_by!(name: breakfast_dish_name))
  end

  # 昼食
  if dish_categories[:lunch].any?
    lunch_dish_name = dish_categories[:lunch].sample
    meal_l = Meal.find_or_create_by!(
      user: user, meal_date: date, category: :lunch, 
      start_time: "12:00", end_time: "13:00"
    )
    MealDish.find_or_create_by!(meal: meal_l, dish: Dish.find_by!(name: lunch_dish_name))
  end

  # 夕食
  if dish_categories[:dinner].any?
    dinner_dish_name = dish_categories[:dinner].sample
    meal_d = Meal.find_or_create_by!(
      user: user, meal_date: date, category: :dinner, 
      start_time: "19:00", end_time: "20:00"
    )
    MealDish.find_or_create_by!(meal: meal_d, dish: Dish.find_by!(name: dinner_dish_name))
  end
end
