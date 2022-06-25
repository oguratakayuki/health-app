# README

# admin
rails,vuejs
# nestJs
api

# front
react, or nuxt

健康管理
食材在庫管理
栄養素・必須栄養素管理
献立管理

ingredients
  name 食品名
  remarks 備考
tags
  name
nutrients

nutrients_alias_names
  nutrient_id どの栄養素
  alias_name


ingredients食品
  ingredients_nutrients
    nutrients
      栄養価１
  ingredients_nutrients
    nutrients
      name こちらにγ-トコフェロール いれる
      parent_nutrient 
        nutrients
          name こちらは親カテゴリ びたみん




ingredients_nutrients
  どの食品がどの栄養素をどれだけ保持しているか(単位量あたり)
  content_quantity     integer  100gあたり30mg -> 30
  content_unit         string   100gあたり30mg -> mg
  content_unit_per     integer  100gあたり30mg  ->  100
  content_unit_per_unit string  100gあたり30mg  ->   g

IngredientsNutrient content_quantity:integer content_unit:string  content_unit_per:integer content_unit_per_unit: string 

 docker exec -it health-app_db_1 mysql -u root -p

docker network create shared-network
docker-compose run web rake db:create RAILS_ENV=development
docker-compose run web rake db:migrate

docker-compose run web rails g model Nutrient
docker-compose run web rails g model NutrientsIntakeStandard
docker-compose run web rails g model Ingredient
docker-compose run web rails g model IngredientsNutrient content_quantity:integer content_unit:string  content_unit_per:integer content_unit_per_unit: string 
docker-compose run web rails db:migrate
docker-compose run web rails g task import_nutrients
docker-compose run web rails g task import_nutrients_intake_standards
docker-compose run web rails g migration RemoveMonthFromNutrientsIntakeStandard
docker-compose run web rails g migration RenameAgeFromNutrientsIntakeStandard
docker-compose run web rails g migration AddAgeFromToNutrientsIntakeStandards age_from:decimal
docker-compose run web rails g migration AddAgeToToNutrientsIntakeStandards age_to:decimal
docker-compose run web rails g migration RenameNutrientsIdFromNutrientsIntakeStandard
docker-compose run web rails g migration RemoveAgeFromNutrientsIntakeStandards age:integer


docker-compose run web rails g migration AddParentIdToToNutrients parent_id:integer

docker-compose run web rails import_nutrients:export['nutrients.csv']
docker-compose run web rails csv_import:nutrients_intake_standards['nutrients_intake_standards.csv']





Nutrients 栄養素
　栄養種別 ビタミン name
  単位 content_unit_id


成人の一日の必須栄養素
https://jp.glico.com/navi/e07.html
NutrientsIntakeStandard
 standards of nutrients intake
  Nutrients id
　栄養量 1g content
  単位 content_unit enum
  age
  gender enum
  month

      t.column :unit, "enum('g','mg','mgNE', 'μgRAE','μg', 'kcal', '％エネルギー')"
      t.integer :gender, "enum('male', 'female')"



This README would normally document whatever steps are necessary to get the
application up and running.

Things you may want to cover:

* Ruby version

* System dependencies

* Configuration

* Database creation

* Database initialization

* How to run the test suite

* Services (job queues, cache servers, search engines, etc.)

* Deployment instructions

* ...
