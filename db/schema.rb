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

ActiveRecord::Schema.define(version: 2023_04_02_141106) do

  create_table "categories", charset: "utf8mb4", collation: "utf8mb4_bin", force: :cascade do |t|
    t.string "name"
    t.string "display_name"
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

  create_table "nutrients", charset: "utf8mb4", collation: "utf8mb4_bin", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "parent_id"
  end

  create_table "nutrients_intake_standards", charset: "utf8mb4", collation: "utf8mb4_bin", force: :cascade do |t|
    t.integer "nutrient_id"
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

end
