# 🚀 【機能追加設計書】{{FUNCTION_NAME}} 機能

本ドキュメントは、既存のオニオンアーキテクチャをベースに {{FUNCTION_NAME}} 機能をOutside-Inで追加するための詳細手順書である。
OpenCodeは各STEPを厳密に順を追って実行すること。

## 📋 追加機能の要件定義

- **対象ドメイン / 操作**: `{{DOMAIN_NAME}}` に対する `{{OPERATION_TYPE}}` 処理
- **データソース（スキーマ参照元）**: `{{SCHEMA_REFERENCE}}`
- **フロントエンド表示・処理項目**:
{{FRONTEND_FIELDS_SPEC}}
- **必須ビジネスロジック・算出ルール**:
{{BUSINESS_LOGIC_DETAILS}}

## STEP 0 【API/型定義ファースト】バックエンドのResolver Mockと型生成
1. graphql用input用の型定義を作る
   - 実装パス: `src/backend/infrastructure/graphql/inputs/{{OPERATION_TYPE}}{{DOMAIN_NAME}}Input.ts`
   - ✨ **リファレンスサンプル**: `src/backend/infrastructure/graphql/inputs/UpdateMealInput.ts`
2. graphql用output用の型定義を作る
   - 実装パス: `src/backend/infrastructure/graphql/types/{{DOMAIN_NAME}}.ts`
   - ✨ **リファレンスサンプル**: `src/backend/infrastructure/graphql/types/Meal.ts` の `Meal`
3. resolverとメソッドを作る(mock)
   - 実装パス: `src/backend/presentation/resolvers/{{DOMAIN_NAME}}Resolver.ts`
   - ✨ **リファレンスサンプル**: `src/backend/presentation/resolvers/MealResolver.ts`
   - 仕様: 引数として上記Inputを受け取り、上記Outputのmockデータ(固定値)を返却する。
4. testの実装と実行
   - 実装パス: `src/backend/presentation/resolvers/__tests__/{{DOMAIN_NAME}}Resolver.spec.ts`
   - テスト実行コマンド:
     `docker compose run graphqlapi npm run test:single src/backend/presentation/resolvers/__tests__/{{DOMAIN_NAME}}Resolver.spec.ts`
5. resolverの一括export用配列への登録
   - 実装パス: `src/backend/presentation/resolvers/index.ts`
   - 処理内容: 作成した `{{DOMAIN_NAME}}Resolver` をimportし、一括export用配列 `resolvers` に追加する（※buildSchemaに渡されるため必須）。
6. サーバーの再起動と型自動生成
   - コマンド: `docker compose restart graphqlapi`
   - コマンド: `yarn codegen` # docker経由ではないことに注意。フロント用の型 `@/frontend/generated/graphql` を最新化する。

## STEP 1 フロントの実装
1. STEP 0 で生成された `@/frontend/generated/graphql` の最新の型（例: `{{DOMAIN_NAME}}Query`）をインポートして、画面を実装する。
2. 実際にリクエストを行い、STEP 0 で作ったMockデータが画面に表示されることを確認する。
   - 画面仕様: {{FRONTEND_UI_SPEC}}

## STEP 2 frontとの繋ぎこみ
1. STEP 0でモックした処理を廃止し、実際にgraphqlのエンドポイントにリクエストするように実装する。
   - 実装パス: `src/frontend/graphql/queries/{{DOMAIN_NAME_LOWER}}.ts`
   - ✨ **リファレンスサンプル**: `src/frontend/graphql/queries/nutrient.ts`

## STEP 3 serviceクラスとメソッドの作成 (mock)
1. serviceクラスに渡すDtoの型を作る
   - 実装パス: `src/backend/application/dtos/{{OPERATION_TYPE}}{{DOMAIN_NAME}}Dto.ts`
   - ✨ **リファレンスサンプル**: `src/backend/application/dtos/UpdateMealUseCaseDto.ts`
2. serviceクラスが返すDomainEntityの型を作る
   - 実装パス: `src/backend/domain/entities/{{DOMAIN_NAME}}.ts`
   - ✨ **リファレンスサンプル**: `src/backend/domain/entities/Meal.ts` の `Meal`
3. serviceクラスのinterfaceを定義する
   - 実装パス: `src/backend/domain/interfaces/I{{DOMAIN_NAME}}Service.ts`
   - ✨ **リファレンスサンプル**: `src/backend/domain/interfaces/IMealService.ts`
4. serviceクラスのmock実装
   - 実装パス: `src/backend/application/services/{{DOMAIN_NAME}}Service.ts`
   - ✨ **リファレンスサンプル**: `src/backend/application/services/MealService.ts`
5. testの実装と実行
   - 実装パス: `src/backend/application/services/__tests__/{{DOMAIN_NAME}}Service.spec.ts`
   - コマンド: `docker compose run graphqlapi npm run test:single src/backend/application/services/__tests__/{{DOMAIN_NAME}}Service.spec.ts`

## STEP 4 resolverの繋ぎこみ(resolver, mapper, service)
1. input ➔ Dto 変換および DomainEntity ➔ Output 変換を担うPresentationMapperを作る
   - 実装パス: `src/backend/acl/presentation_application/{{DOMAIN_NAME}}PresentationMapper.ts`
   - ✨ **リファレンスサンプル**: `src/backend/acl/presentation_application/MealPresentationMapper.ts`

## STEP 4.5 【DI/インフラ登録】ServiceクラスをGraphqlContextおよびDIコンテナへ追加
1. GraphqlContextのinterface修正
   - 実装パス: `src/backend/application/types/context.ts`
   - 処理内容: interface `GraphqlContext` に、今回追加するServiceプロパティを追加する。
   - サンプル: `{{RESOLVER_METHOD_NAME}}Service?: I{{DOMAIN_NAME}}Service;` (※適切な型をimportすること)
2. DIコンポーズ関数の作成
   - 実装パス: `src/backend/application/services/adapters/PrismaAdapter.ts`
   - 処理内容: `prismaClient` やリポジトリのインスタンスを組み立て、今回追加したServiceクラスのインスタンスを生成して返すメソッド `create{{DOMAIN_NAME}}Service()` を作成する。
3. DIファクトリメソッドへの登録
   - 実装パス: `src/backend/application/services/adapters/index.tsx`
   - 処理内容: `getServicesFromContext()` 内で、`{{RESOLVER_METHOD_NAME}}Service` が未存在の場合に上記2の `create{{DOMAIN_NAME}}Service()` を呼び出してContextにDI・注入するロジックを実装する（既存の `createMealService()` などの実装を参照）。

## STEP 4.8 Resolver本実装の結合
1. resolverの修正
   - 実装パス: `src/backend/presentation/resolvers/{{DOMAIN_NAME}}Resolver.ts`
   - 処理内容: 固定値返却(Mock)を削除し、Contextから `{{RESOLVER_METHOD_NAME}}Service` を取得。PresentationMapperを用いて安全に呼び出すように本実装を行う。
2. testの修正と実行 (ResolverテストをServiceモック方式に修正)

## STEP 5 repositoryクラスのmock実装
1. repositoryInput型の型定義を実装: `src/backend/domain/entities/{{DOMAIN_NAME}}.ts` (※Meal.tsのInput構造を参照)
2. repositoryインターフェースの実装: `src/backend/domain/interfaces/I{{DOMAIN_NAME}}Repository.ts`
   - ✨ **リファレンスサンプル**: `src/backend/domain/interfaces/IMealRepository.ts`
3. repositoryクラスのmock実装: `src/backend/infrastructure/repositories/mock/{{DOMAIN_NAME}}Repository.ts`

## STEP 6 repositoryクラスの繋ぎこみ(repository, service)
1. `{{DOMAIN_NAME}}Service` の本実装
   - 固定値返却を削除し、Repositoryを呼び出す。
   - 💡 **ビジネスロジックの組み込み**:
     {{BUSINESS_LOGIC_DETAILS}}

## STEP 7 repositoryクラスの本実装
1. RepositoryMapperクラス作成とメソッドの実装
   - 実装パス: `src/backend/acl/domain_infrastructure/{{DOMAIN_NAME}}RepositoryMapper.ts`
   - ✨ **リファレンスサンプル**: `src/backend/acl/domain_infrastructure/MealRepositoryMapper.ts`
2. Prismaを利用した本リポジトリの実装
   - 実装パス: `src/backend/infrastructure/repositories/prisma/{{DOMAIN_NAME}}Repository.ts`
   - ✨ **リファレンスサンプル**: `src/backend/infrastructure/repositories/prisma/MealRepository.ts`
