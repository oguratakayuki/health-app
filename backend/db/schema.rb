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

ActiveRecord::Schema.define(version: 2026_01_17_085034) do

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
    t.index ["dish_id"], name: "index_dish_ingredients_on_dish_id"
    t.index ["ingredient_id"], name: "index_dish_ingredients_on_ingredient_id"
  end

  create_table "dishes", charset: "utf8mb4", collation: "utf8mb4_bin", force: :cascade do |t|
    t.string "name", comment: "料理名"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "ingredient_nutrients", charset: "utf8mb4", collation: "utf8mb4_bin", force: :cascade do |t|
    t.bigint "ingredient_id"
    t.bigint "nutrient_id"
    t.integer "content_quantity"
    t.string "content_unit"
    t.integer "content_unit_per"
    t.string "content_unit_per_unit"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["ingredient_id"], name: "index_ingredient_nutrients_on_ingredient_id"
    t.index ["nutrient_id"], name: "index_ingredient_nutrients_on_nutrient_id"
  end

  create_table "ingredient_tags", charset: "utf8mb4", collation: "utf8mb4_bin", force: :cascade do |t|
    t.integer "ingredient_id"
    t.integer "tag_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "ingredients", charset: "utf8mb4", collation: "utf8mb4_bin", force: :cascade do |t|
    t.string "name"
    t.text "remarks"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "original_name"
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

  create_table "meals", charset: "utf8mb4", collation: "utf8mb4_bin", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.date "meal_date", null: false
    t.string "category", null: false
    t.time "start_time"
    t.time "end_time"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_meals_on_user_id"
  end

  create_table "nutrients", charset: "utf8mb4", collation: "utf8mb4_bin", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "parent_id"
    t.index ["name"], name: "index_nutrients_on_name", unique: true
    t.index ["parent_id"], name: "fk_rails_687edf74d9"
  end

  create_table "nutrients_intake_standards", charset: "utf8mb4", collation: "utf8mb4_bin", force: :cascade do |t|
    t.bigint "nutrient_id"
    t.integer "content"
    t.integer "unit"
    t.integer "gender"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.decimal "age_from", precision: 10
    t.decimal "age_to", precision: 10
  end

  create_table "nutrients_relations", charset: "utf8mb4", collation: "utf8mb4_bin", force: :cascade do |t|
    t.integer "parent_id"
    t.integer "child_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "tag_categories", charset: "utf8mb4", collation: "utf8mb4_bin", force: :cascade do |t|
    t.integer "tag_id"
    t.integer "category_id"
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
  add_foreign_key "meal_dishes", "dishes"
  add_foreign_key "meal_dishes", "meals"
  add_foreign_key "meals", "users"
  add_foreign_key "nutrients", "nutrients", column: "parent_id"
end
