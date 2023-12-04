## ビタミンについて

子要素でエクセルから取得しnutriantsをせってい
親要素はビタミンBとかなので
この親子関係を紐付ける

ingredients
  tags
    name: "マグロ"
    tag_categories
      tag_id:
      category_id: 
        categories
          name: "group"
          display_name: グループ名




## 脂肪酸について


飽和脂肪酸 <- nutrients_intake_standards
不飽和脂肪酸<- nutrients のparent
  一価不飽和脂肪酸 <- nutrients のparent
    オレイン酸
    ω-9脂肪酸の一部 <- nutrients のchild <- nutrients_intake_standards
  多価不飽和脂肪酸
    ω-6脂肪酸 n-6
    ω-3脂肪酸
    ω-9脂肪酸の一部
    共役リノール酸
    が含まれる。


nutrients

(基準値の)n-3系脂肪,n-6系脂肪酸の合算値 <-> 多価不飽和脂肪酸(商品単位)
で比較する



多価不飽和脂肪酸(商品単位)
をどこにマッピングするか

栄養をきちんと摂っているか評価する時
　必須栄養素について
    子要素を親要素で合算する
    n-6,n-3の基準値の合算値を多価不飽和脂肪酸の摂取理想値とする
    (実際に摂取した栄養素は親要素で記録する場合もある(多価不飽和脂肪酸)ので)

不飽和脂肪酸
  リノール酸
  γ-リノレン酸
  エイコサジエン酸
  ジホモ-γ-リノレン酸
  アラキドン酸
  ドコサジエン酸
  ドコサテトラエン酸
  ドコサペンタエン酸
  カレンジン酸







Nutrient.find(63).parent
Nutrient.find(10).childs



nutritional ingredients 栄養成分



ingredients_nutrients
IngredientsNutrient
  どの食品がどの栄養素をどれだけ保持しているか(単位量あたり)
  ingredients_id どの食品
  nutrient_id どの栄養
  content_quantity     integer  100gあたり30mg -> 30
  content_unit         string   100gあたり30mg -> mg
  content_unit_per     integer  100gあたり30mg  ->  100
  content_unit_per_unit string  100gあたり30mg  ->   g








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
サマリー(レポーティング)
サジェスト（おすすめの献立の提案)

ingredient
  name 食品名
  remarks 備考
tags
  name
nutrients


ingredients 食品
  ingredients_nutrients
    nutrients
      栄養価１
  ingredients_nutrients
    nutrients
      name こちらにγ-トコフェロール いれる
      parent_nutrient 
        nutrients
          name こちらは親カテゴリ びたみん




IngredientsNutrient content_quantity:integer content_unit:string  content_unit_per:integer content_unit_per_unit: string 

 docker exec -it health-app-db-1 mysql -u root -p

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
docker-compose run web rails g migration AddOriginalNameToIngredients original_name:string

docker-compose run web rails g migration AddParentIdToToNutrients parent_id:integer
docker-compose run web rails g model NutrientsRelation parent_id:integer child_id:integer
docker-compose run web rails g model Tag name:string
docker-compose run web rails g model IngredientTag ingredient_id:integer tag_id:integer
docker-compose run web rails g model TagCategory tag_id:integer category_id:integer
docker-compose run web rails g model Category name:string display_name:string



docker-compose run web rails csv_import:nutrients['nutrients.csv']
docker-compose run web rails csv_import:nutrients_intake_standards['nutrients_intake_standards.csv']
bundle exec rails csv_import:ingredients_nutrients





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




