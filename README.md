# README

docker exec -it  health-app-db-1  mysql -u root -p health_development
rootp

# SETUP
```
docker network create shared-network
docker compose up db -d
docker compose run web rails csv_import:nutrients['./common_data/nutrients.csv']
docker compose run web rails csv_import:nutrients_intake_standards['./common_data/nutrients_intake_standards.csv']
docker compose run web bundle exec rails csv_import:ingredients_nutrients
```

# DEVELOPMENT MEMO
```
nuxi cleanup
docker compose run --rm nuxt npm run lint:fix
# graphqlapi
docker compose run graphqlapi npx prisma generate
docker compose run graphqlapi npm run test:single NutrientsIntakeStandard
DATABASE_URL=mysql://root:rootp@db:3306/health_development npx prisma generate
```

## TODO
tagについて

* 別コンポーネントにして切り出す
* select boxの Option filteringにする、選択したものは下部の一覧に表示する。xボタンで消せるようにする
-> 紐付けずみのtag一覧と
-> 紐付け可能な全てのtag一覧
-> 選択、削除時に親コンポーネントを呼ぶ
-> 親は追加、削除の情報をもち、submit時に、さらに親に渡す
-> コンポーネント内のlocal変数に一度コピーする


-> tag検索機能から作る。基本的な機能は一緒なので
その際、絞り込み可能なselectboxを作る

- [x] 食材栄養素seedスクリプト(rails)
- [ ] 食材栄養素管理機能(admin crud, マスタデータ管理 nuxt) <---
- [ ] 食材栄養素api(rails) <---
- [ ] 献立管理機能構築(nuxt)
- [ ] 食材在庫管理
- [ ] サマリー(golang)
- [ ] サジェスト（python)


## TODO DETAIL
### 食材栄養素管理機能(admin crud, マスタデータ管理 nuxt)

- [x] サイドメニューを作る
- [ ] crud 処理作成を通す update,create
- [ ] crud 処理作成を通す update,create のtest作成
- [ ] crud 処理作成を通す front
- [ ] 更新作成処理にingredient_nutrientsを含めた形にする
- [ ] pageの分割を検討
- [ ] ソート機能を作る
- [ ] 栄養価のCRUDを作る
- [ ] 汎用的な認証機能を作る
