# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2026_01_21_135405) do

  create_table "categories", charset: "utf8mb4", collation: "utf8mb4_bin", force: :cascade do |t|
    t.string "name"
    t.string "display_name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "dish_ingredients", charset: "utf8mb4", collation: "utf8mb4_bin", comment: "料理に使用した食材", force: :cascade do |t|
    t.bigint "dish_id", null: false
    t.bigint "ingredient_id", null: false
    t.float "content_quantity", default: 0.0, null: false, comment: "量"
    t.string "content_unit", null: false, comment: "量の単位"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["dish_id", "ingredient_id"], name: "index_dish_ingredients_on_dish_id_and_ingredient_id_unique", unique: true
    t.index ["dish_id"], name: "index_dish_ingredients_on_dish_id"
    t.index ["ingredient_id"], name: "index_dish_ingredients_on_ingredient_id"
  end

  create_table "dishes", charset: "utf8mb4", collation: "utf8mb4_bin", force: :cascade do |t|
    t.string "name", null: false, comment: "料理名"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "ingredient_nutrients", charset: "utf8mb4", collation: "utf8mb4_bin", comment: "食材に含まれる栄養素マスタ", force: :cascade do |t|
    t.bigint "ingredient_id", null: false
    t.bigint "nutrient_id", null: false
    t.integer "content_quantity", comment: "含有量（例: 30mgの「30」）"
    t.string "content_unit", comment: "含有量の単位（例: 30mgの「mg」）"
    t.integer "content_unit_per", comment: "基準量（例: 100gあたりの「100」）"
    t.string "content_unit_per_unit", comment: "基準量の単位（例: 100gあたりの「g」）"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["ingredient_id", "nutrient_id"], name: "index_ingredient_nutrients_on_ingredient_and_nutrient", unique: true
    t.index ["ingredient_id"], name: "index_ingredient_nutrients_on_ingredient_id"
    t.index ["nutrient_id"], name: "index_ingredient_nutrients_on_nutrient_id"
  end

  create_table "ingredient_tags", charset: "utf8mb4", collation: "utf8mb4_bin", force: :cascade do |t|
    t.bigint "ingredient_id"
    t.bigint "tag_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "ingredients", charset: "utf8mb4", collation: "utf8mb4_bin", comment: "食材マスター(ジャガイモなど)", force: :cascade do |t|
    t.string "name", null: false
    t.text "remarks", comment: "備考"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "original_name"
    t.index ["name"], name: "index_ingredients_on_name", unique: true
  end

  create_table "meal_dishes", charset: "utf8mb4", collation: "utf8mb4_bin", comment: "食事の各料理", force: :cascade do |t|
    t.bigint "meal_id", null: false
    t.bigint "dish_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["dish_id"], name: "index_meal_dishes_on_dish_id"
    t.index ["meal_id", "dish_id"], name: "index_meal_dishes_on_meal_id_and_dish_id", unique: true
    t.index ["meal_id"], name: "index_meal_dishes_on_meal_id"
  end

  create_table "meals", charset: "utf8mb4", collation: "utf8mb4_bin", comment: "食事履歴", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.date "meal_date", null: false, comment: "食事した日付"
    t.string "category", null: false, comment: "食事分類 enum(朝食、昼食、晩飯)"
    t.time "start_time", comment: "食事の開始時刻"
    t.time "end_time", comment: "食事の終了時刻"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id", "meal_date", "category"], name: "index_meals_on_user_id_meal_date_category_unique", unique: true
    t.index ["user_id"], name: "index_meals_on_user_id"
  end

  create_table "nutrients", charset: "utf8mb4", collation: "utf8mb4_bin", comment: "栄養素マスタ(炭水化物,脂質など)", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "parent_id"
    t.index ["name"], name: "index_nutrients_on_name", unique: true
    t.index ["parent_id"], name: "fk_rails_687edf74d9"
  end

  create_table "nutrients_intake_standards", charset: "utf8mb4", collation: "utf8mb4_bin", force: :cascade do |t|
    t.bigint "nutrient_id"
    t.integer "content"
    t.integer "gender"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.decimal "age_from", precision: 10
    t.decimal "age_to", precision: 10
    t.string "unit", null: false
  end

  create_table "nutrients_relations", charset: "utf8mb4", collation: "utf8mb4_bin", force: :cascade do |t|
    t.bigint "parent_id"
    t.bigint "child_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "radar_chart_items", charset: "utf8mb4", collation: "utf8mb4_bin", comment: "どのチャートにどの栄養素を表示するかを管理する中間テーブル", force: :cascade do |t|
    t.bigint "radar_chart_id", null: false, comment: "関連するチャートID"
    t.bigint "nutrient_id", null: false, comment: "表示する栄養素ID"
    t.integer "position", default: 0, comment: "チャート内での表示順（時計回り）"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["nutrient_id"], name: "index_radar_chart_items_on_nutrient_id"
    t.index ["radar_chart_id"], name: "index_radar_chart_items_on_radar_chart_id"
  end

  create_table "radar_charts", charset: "utf8mb4", collation: "utf8mb4_bin", comment: "レーダーチャートの定義（器）を管理するテーブル", force: :cascade do |t|
    t.string "name", null: false, comment: "チャートの表示名（例：ビタミンバランス）"
    t.string "slug", null: false, comment: "プログラムから参照するための識別子（例：vitamins）"
    t.integer "display_order", default: 0, comment: "アプリ内での表示順"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["slug"], name: "index_radar_charts_on_slug", unique: true
  end

  create_table "tag_categories", charset: "utf8mb4", collation: "utf8mb4_bin", force: :cascade do |t|
    t.bigint "tag_id"
    t.bigint "category_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "tags", charset: "utf8mb4", collation: "utf8mb4_bin", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "users", charset: "utf8mb4", collation: "utf8mb4_bin", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "name"
    t.string "cognito_sub"
    t.boolean "is_admin", default: false, null: false
    t.integer "gender"
    t.integer "age"
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "dish_ingredients", "dishes"
  add_foreign_key "dish_ingredients", "ingredients"
  add_foreign_key "ingredient_nutrients", "ingredients"
  add_foreign_key "ingredient_nutrients", "nutrients"
  add_foreign_key "meal_dishes", "dishes"
  add_foreign_key "meal_dishes", "meals"
  add_foreign_key "meals", "users"
  add_foreign_key "nutrients", "nutrients", column: "parent_id"
  add_foreign_key "radar_chart_items", "nutrients"
  add_foreign_key "radar_chart_items", "radar_charts"
end
