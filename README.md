# README

# SETUP

docker-compose run web rails csv_import:nutrients['nutrients.csv']
docker-compose run web rails csv_import:nutrients_intake_standards['nutrients_intake_standards.csv']
bundle exec rails csv_import:ingredients_nutrients

## TODO
* 食材栄養素seedスクリプト
* 食材栄養素管理機能(admin crud, マスタデータ管理)
* 食材栄養素api(ユーザーデータ)
* 食材栄養素編集機能(front, ユーザーデータ)
* 献立管理機能構築
* 食材在庫管理
* サマリー(レポーティング)
* サジェスト（おすすめの献立の提案)


## next task
docker-compose run web bundle exec rails csv_import:ingredients_nutrients
でingredients_nutrientsにimportできるようにする
