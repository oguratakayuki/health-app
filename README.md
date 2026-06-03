# README


# SETUP
```
docker network create shared-network
docker compose up db -d
docker compose run web rails csv_import:nutrients['./common_data/nutrients.csv']
docker compose run web rails csv_import:nutrients_intake_standards['./common_data/nutrients_intake_standards.csv']
docker compose run web bundle exec rails csv_import:ingredients_nutrients
docker compose run web bundle exec rails db:migrate
docker compose run web bundle exec rails db:seed
```
# 設計ドキュメント
[GraphQLにおける認証・認可アーキテクチャ設計](graphqlapi/docs/graphql-auth-architecture.md)

# DEVELOPMENT MEMO
```
docker exec -it  health-app-db-1  mysql -u root -p health_development

# graphqlapi
docker compose run graphqlapi npx prisma generate
docker compose run graphqlapi npm run test:single NutrientsIntakeStandard
DATABASE_URL=mysql://root:rootp@db:3306/health_development npx prisma generate
```

## TODO

- [x] seedスクリプト(rails)
- [x] 認証認可ロジック
- [x] master系のCRUD機能
- [x] 献立データ、グラフ表示機能
- [ ] user情報のCRUD
- [ ] フロントの状態管理
- [ ] キャッシュ機構の導入
- [ ] 分析機能(月単位の過不足)
- [ ] レコメンデーション(月単位の過不足から最適なレシピを提案)
- [ ] 体重、体脂肪情報(の推移), 運動情報の取り込み
- [ ] 血圧情報の取り込み



