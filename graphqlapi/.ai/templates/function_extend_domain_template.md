# 🚀 【機能追加設計書（既存拡張）】{{FUNCTION_NAME}} 機能

本ドキュメントは、既存のオニオンアーキテクチャをベースに、既存 of ファイルやクラスに対して {{FUNCTION_NAME}} 機能のメソッド・処理を**追加（拡張）**するための詳細手順書である。
OpenCodeは各STEPを厳密に順を追って実行すること。また、**既存のコードや別メソッドを決して削除・上書き破壊しないこと。**

## 📋 追加機能の要件定義

- **対象ドメイン / 操作**: `{{DOMAIN_NAME}}` に対する `{{OPERATION_TYPE}}` 処理
- **データソース（スキーマ参照元）**: `{{SCHEMA_REFERENCE}}`
- **フロントエンドCRUD配置規約（全体構造）**:
{{FRONTEND_UI_SPEC.target_crud_structure}}

- **🚨 今回のフロントエンド実装対象パス（確定出力ルール）**:
  <!-- 
  【OpenCodeへの指示】
  指示書（Markdown）を最終出力する際は、以下のマッピング表から `OPERATION_TYPE`（今回は "{{OPERATION_TYPE}}"）に合致するパスを1つ抽出し、`{{DOMAIN_NAME_URL}}` などの変数をすべて実値に置換した「確定パス」のみをここに記載すること。
  [マッピング表]
  - List   -> app/(protected)/{{DOMAIN_NAME_URL}}/page.tsx
  - Create -> app/(protected)/{{DOMAIN_NAME_URL}}/create/page.tsx
  - Show   -> app/(protected)/{{DOMAIN_NAME_URL}}/[id]/page.tsx
  - Edit   -> app/(protected)/{{DOMAIN_NAME_URL}}/[id]/edit/page.tsx
  -->
  `app/(protected)/{{DOMAIN_NAME_URL}}/[id]/page.tsx` (※Showに対応するパスに確定して出力すること)

- **フロントエンド表示・処理項目**:
{{FRONTEND_FIELDS_SPEC}}
- **必須ビジネスロジック・算出ルール**:
{{BUSINESS_LOGIC_DETAILS}}

## STEP 0 【API/型定義ファースト】バックエンドのResolver Mockと型生成
1. graphql用input用の型定義を作る
   - 実装パス: `src/backend/infrastructure/graphql/inputs/{{OPERATION_TYPE}}{{DOMAIN_NAME}}Input.ts`
   - ✨ **リファレンスサンプル**: `src/backend/infrastructure/graphql/inputs/UpdateMealInput.ts`
   - 💡 **注意**: 新規ファイルとして作成するか、既存の類似Inputファイルがある場合はその末尾に追記すること。
2. graphql用output用の型定義を作る(既にあれば既存の型を流用する)
   - 実装パス: `src/backend/infrastructure/graphql/types/{{DOMAIN_NAME}}.ts`
   - ✨ **リファレンスサンプル**: `src/backend/infrastructure/graphql/types/Meal.ts` の `Meal`
3. 対象のresolverにメソッドを作る(mock)
   - 実装パス: `src/backend/presentation/resolvers/{{DOMAIN_NAME}}Resolver.ts`
   - ✨ **リファレンスサンプル**: `src/backend/presentation/resolvers/MealResolver.ts`
   - ⚠️ **絶対遵守**: 既存のResolverファイルを編集する際、**既存の他のメソッド（Queries/Mutations）やimport文を決して削除しないこと。** 新しいメソッドはクラスの末尾に追記すること。
   - 仕様: 引数として上記Inputを受け取り、上記Outputのmockデータ(固定値)を返却する。
4. testの追加実装と実行
   - 実装パス: `src/backend/presentation/resolvers/__tests__/{{DOMAIN_NAME}}Resolver.spec.ts`
   - 処理内容: 既存のテストファイルを開き、今回のメソッド用のテストケースを `describe` 内に**追記**する。
   - テスト実行コマンド:
     `docker compose run graphqlapi npm run test:single src/backend/presentation/resolvers/__tests__/{{DOMAIN_NAME}}Resolver.spec.ts`
6. サーバーの再起動と型自動生成
   - コマンド: `docker compose restart graphqlapi`
   - コマンド: `yarn codegen` # docker経由ではないことに注意。フロント用の型 `@/frontend/generated/graphql` を最新化する。

## STEP 1 フロントの実装
1. STEP 0 で生成された `@/frontend/generated/graphql` の最新の型（例: `{{DOMAIN_NAME}}Query` や `{{OPERATION_TYPE}}{{DOMAIN_NAME}}Mutation`）をインポートして、画面を実装する。
2. 実際にリクエストを行い、STEP 0 で作ったMockデータが画面に表示されることを確認する。
   - 画面仕様: {{FRONTEND_UI_SPEC}}
   - 💡 **注意**: 実装ファイルは、上記の「🚨 今回のフロントエンド実装対象パス」にのみ作成すること。

## STEP 2 frontとの繋ぎこみ
1. STEP 0でモックした処理を廃止し、実際にgraphqlのエンドポイントにリクエストするように実装する。
   - 実装パス: `src/frontend/graphql/queries/{{DOMAIN_NAME_LOWER}}.ts`
   - ✨ **リファレンスサンプル**: `src/frontend/graphql/queries/nutrient.ts`
   - 💡 **注意**: 既存ファイルがある場合は、その末尾にGraphQLドキュメント（`query` や `mutation`）を追記すること。

## STEP 3 serviceクラスとメソッドの作成 (mock)
1. serviceクラスに渡すDtoの型を作る
   - 実装パス: `src/backend/application/dtos/{{OPERATION_TYPE}}{{DOMAIN_NAME}}Dto.ts`
   - ✨ **リファレンスサンプル**: `src/backend/application/dtos/UpdateMealUseCaseDto.ts`
2. serviceクラスが返すDomainEntityの型を作る(既にあれば既存の型を流用)
   - 実装パス: `src/backend/domain/entities/{{DOMAIN_NAME}}.ts`
   - ✨ **リファレンスサンプル**: `src/backend/domain/entities/Meal.ts` の `Meal`
3. serviceクラスのinterfaceに追加するメソッドを追加定義する
   - 実装パス: `src/backend/domain/interfaces/I{{DOMAIN_NAME}}Service.ts`
   - ⚠️ **絶対遵守**: 既存のインターフェース定義を崩さず、新しいメソッドのシグネチャを追記すること。
4. serviceクラスに新たなメソッドをmock実装(resolverから呼ばれる想定)
   - 実装パス: `src/backend/application/services/{{DOMAIN_NAME}}Service.ts`
   - ⚠️ **絶対遵守**: 既存の他のメソッド実装を消さずに、新しいメソッドを固定値返却(Mock)の状態で追記すること。
5. testの追加実装と実行
   - 実装パス: `src/backend/application/services/__tests__/{{DOMAIN_NAME}}Service.spec.ts`
   - 処理内容: 既存のテストファイルに、今回のメソッド用のテストケースを追記。
   - コマンド: `docker compose run graphqlapi npm run test:single src/backend/application/services/__tests__/{{DOMAIN_NAME}}Service.spec.ts`

## STEP 4 resolverの繋ぎこみ(resolver, mapper, service)
1. input ➔ Dto 変換および DomainEntity ➔ Output 変換を担うPresentationMapperにメソッドを追加(既存の実装が流用できる場合は不要)
   - 実装パス: `src/backend/acl/presentation_application/{{DOMAIN_NAME}}PresentationMapper.ts`
   - ✨ **リファレンスサンプル**: `src/backend/acl/presentation_application/MealPresentationMapper.ts`
   - 💡 **注意**: 既存のMapperクラス内に、今回必要なマッピングメソッドを追記する。

## STEP 4.8 Resolverに追加したメソッドの本実装の結合
1. resolverの修正
   - 実装パス: `src/backend/presentation/resolvers/{{DOMAIN_NAME}}Resolver.ts`
   - 処理内容: STEP0で作成したメソッドから固定値返却(Mock)を削除し、Contextから既にDI登録されている `{{RESOLVER_METHOD_NAME}}Service` を取得。PresentationMapperを用いて安全に呼び出すように本実装を行う。
2. testの修正と実行 (ResolverテストをServiceモック方式に修正)

## STEP 5 repositoryクラスのmock実装
1. repositoryInput型の型定義を実装: `src/backend/domain/entities/{{DOMAIN_NAME}}.ts` (※Meal.tsのInput構造を参照)
   - 既に型が定義されていればそれを流用する。
2. repositoryインターフェースにメソッド追加: `src/backend/domain/interfaces/I{{DOMAIN_NAME}}Repository.ts`
   - ⚠️ **絶対遵守**: 既存のインターフェース定義を決して消さずに、新しいメソッドのシグネチャを追記すること。
3. repositoryクラスにメソッドをmock実装: `src/backend/infrastructure/repositories/mock/{{DOMAIN_NAME}}Repository.ts`
   - ⚠️ **絶対遵守**: 既存のMock実装を壊さないよう、末尾にメソッドを追記する。

## STEP 6 repositoryクラスの繋ぎこみ(repository, service)
1. STEP 3で追加した`{{DOMAIN_NAME}}Service` のメソッドに対する本実装
   - 固定値返却(Mock)を削除し、Repositoryを呼び出すように書き換える。
   - 💡 **ビジネスロジックの組み込み**:
     {{BUSINESS_LOGIC_DETAILS}}

## STEP 7 repositoryクラスの本実装
1. RepositoryMapperクラスへのメソッド追加（または新規作成）
   - 実装パス: `src/backend/acl/domain_infrastructure/{{DOMAIN_NAME}}RepositoryMapper.ts`
   - ✨ **リファレンスサンプル**: `src/backend/acl/domain_infrastructure/MealRepositoryMapper.ts`
   - 💡 **注意**: 既存のRepositoryMapperクラスのメソッドが流用できるようであればそれを使い、足りなければメソッドを追記する。
2. STEP 5でリポジトリクラスに追加したメソッドに対して、本実装を行う
   - PrismaClientを利用し、recordに対してqueryを発行する。
   - **[create, update系のクエリだった場合]**: このクエリ実行後に再度selectして、該当レコードのentityを返すようにすること。
   - 実装パス: `src/backend/infrastructure/repositories/prisma/{{DOMAIN_NAME}}Repository.ts`
   - ✨ **リファレンスサンプル**: `src/backend/infrastructure/repositories/prisma/MealRepository.ts`
