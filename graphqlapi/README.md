
* yarn add -D typeorm-model-generator
* yarn typeorm-model-generator -h db -d health_development -u root -x rootp -e mysql -o ./src/entities/
* docker compose run graphqlapi npm run test:single NutrientsIntakeStandard

* prismaのキャッシュクリア rm -rf ~/.cache/prisma
* rm -rf node_modules/.prisma
* rm -rf node_modules/@prisma/client
* DATABASE_URL=mysql://root:rootp@db:3306/health_development npx prisma generate

