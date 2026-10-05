
# 設計ドキュメント
- [GraphQLにおける認証・認可アーキテクチャ設計](graphqlapi/docs/graphql-auth-architecture.md)
- [フロントエンドの認証・認可アーキテクチャ設計](graphqlapi/docs/frontend-auth-architecture.md)
- [バックエンドにおけるデータマッピング・腐敗防止層（ACL）の設計規律](graphqlapi/docs/backend-data-mapping-architecture.md)
- [GraphQL Code Generator を用いた型同期アーキテクチャ](graphqlapi/docs/graphql-codegen.md)


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
- [x] フロントの状態管理
- [ ] user情報のCRUD
- [ ] 体重、体脂肪情報(の推移), 運動情報の取り込み
- [ ] 分析機能(月単位の過不足)
- [ ] CausalImpactの導入(特定の食事を取らなかったら、もし運動しなかったら、どうなっていたかをsimulation)
- [ ] レコメンデーション(月単位の過不足から最適なレシピを提案)
- [ ] キャッシュ機構の導入
- [ ] 血圧情報の取り込み


# cognitoの設定手順

## ユーザープールを作成
```
curl -X POST http://localhost:9229/ \
  -H "Content-Type: application/x-amz-json-1.1" \
  -H "X-Amz-Target: AWSCognitoIdentityProviderService.CreateUserPool" \
  -d '{
    "PoolName": "local-user-pool",
    "AutoVerifiedAttributes": ["email"]
  }'  | jq | grep Id

-> UserPoolId: local_0bIbQfA0
local_4kfVP0Df
```
-> .env.developmentに設定

## アプリクライアント作成
```
curl -X POST http://localhost:9229/ \
 -H "Content-Type: application/x-amz-json-1.1" \
 -H "X-Amz-Target: AWSCognitoIdentityProviderService.CreateUserPoolClient" \
 -d '{
   "UserPoolId": "local_4kfVP0Df",
   "ClientName": "test-client",
   "ExplicitAuthFlows": ["USER_PASSWORD_AUTH", "ALLOW_REFRESH_TOKEN_AUTH"]
 }' | jq | grep ClientId
```
    "ClientId": "3l4vtfxsv2w4gw5qpewhm40ey",
3ddxhq90ayi283913js9cq84a
-> .env.developmentに設定
## graphqlapiを再起動
```
docker compose restart graphqlapi
```
## signIn
http://localhost:3000/signIn
でuser作成
## congnitoのログからワンタイムパスワードを取得
* docker compose logs -f cognito-local

# test
* docker compose run graphqlapi npm run test:single NutrientsIntakeStandard

# prisma
* prismaのキャッシュクリア
```
rm -rf ~/.cache/prisma
rm -rf node_modules/.prisma
rm -rf node_modules/@prisma/client
docker compose run -e DATABASE_URL="mysql://root:rootp@db:3306/health_development" graphqlapi npx prisma generate
yarn codegen
```


