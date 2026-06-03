
# test
* docker compose run graphqlapi npm run test:single NutrientsIntakeStandard

# prisma
* prismaのキャッシュクリア rm -rf ~/.cache/prisma
* rm -rf node_modules/.prisma
* rm -rf node_modules/@prisma/client
* DATABASE_URL=mysql://root:rootp@db:3306/health_development npx prisma generate

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
local_2UIllGjY
```
-> .env.developmentに設定

## アプリクライアント作成
```
curl -X POST http://localhost:9229/ \
 -H "Content-Type: application/x-amz-json-1.1" \
 -H "X-Amz-Target: AWSCognitoIdentityProviderService.CreateUserPoolClient" \
 -d '{
   "UserPoolId": "local_2UIllGjY",
   "ClientName": "test-client",
   "ExplicitAuthFlows": ["USER_PASSWORD_AUTH", "ALLOW_REFRESH_TOKEN_AUTH"]
 }' | jq | grep ClientId
```
    "ClientId": "3l4vtfxsv2w4gw5qpewhm40ey",
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
