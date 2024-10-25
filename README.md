# README

docker exec -it  health-app-db-1  mysql -u root -p health_development
rootp

# SETUP
```
docker network create shared-network
docker-compose up db -d
docker-compose run web rails csv_import:nutrients['nutrients.csv']
docker-compose run web rails csv_import:nutrients_intake_standards['nutrients_intake_standards.csv']
docker-compose run web bundle exec rails csv_import:ingredients_nutrients
```

## TODO
- [x] 食材栄養素seedスクリプト(rails)
- [ ] 食材栄養素管理機能(admin crud, マスタデータ管理 nuxt) <---
- [ ] 食材栄養素api(rails) <---
- [ ] 献立管理機能構築(nuxt)
- [ ] 食材在庫管理
- [ ] サマリー(golang)
- [ ] サジェスト（python)


## TODO DETAIL
### 食材栄養素管理機能(admin crud, マスタデータ管理 nuxt)

- [ ] サイドメニューを作る
- [ ] ソート機能を作る
- [ ] 栄養価のCRUDを作る
- [ ] 汎用的な認証機能を作る
