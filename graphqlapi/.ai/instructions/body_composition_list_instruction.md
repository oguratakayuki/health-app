# 🚀 【機能追加設計書（既存拡張）】体組成計測履歴一覧表示 機能

本ドキュメントは、既存のオニオンアーキテクチャをベースに、既存 of ファイルやクラスに対して 体組成計測履歴一覧表示 機能のメソッド・処理を**追加（拡張）**するための詳細手順書である。
OpenCodeは各STEPを厳密に順を追って実行すること。また、**既存のコードや別メソッドを決して削除・上書き破壊しないこと。**

## 📋 追加機能の要件定義

- **対象ドメイン / 操作**: `BodyComposition` に対する `List` 処理
- **データソース（スキーマ参照元）**: prisma/schema.prisma 内の `BodyComposition` モデルを参照すること
- **フロントエンドCRUD配置規約（全体構造）**:
app/(protected)/body-compositions/
├── [id]
│   ├── edit
│   │   ├── BodyCompositionForm.tsx
│   │   └── page.tsx
│   └── page.tsx
├── create
│   └── page.tsx
└── page.tsx                         # 一覧画面 (※今回のターゲット)

- **🚨 今回のフロントエンド実装対象パス（確定出力ルール）**:
  `app/(protected)/body-compositions/page.tsx`

- **フロントエンド表示・処理項目**:
  - 計測日時: `measured_at` (降順ソートで表示)
  - 体重: `weight` (kg)
  - BMI: `bmi`
  - 体脂肪率: `body_fat_percentage` (%)
  - 骨格筋率: `skeletal_muscle_percentage` (%)

- **必須ビジネスロジック・算出ルール**:
  1. ログインユーザー（`user_id`）に紐づく計測データを、計測日時（`measured_at`）の降順（新しい順）で取得すること。
  2. CSVからの大量インポートを想定し、パフォーマンス低下を防ぐためのペジネーション（または最新N件の取得制限）の考慮を入れること。

## STEP 0 【API/型定義ファースト】バックエンドのResolver Mockと型生成
1. graphql用input用の型定義を作る
   - 実装パス: `src/backend/infrastructure/graphql/inputs/ListBodyCompositionInput.ts`
   - ✨ **リファレンスサンプル**: `src/backend/infrastructure/graphql/inputs/UpdateMealInput.ts`
   - 💡 **注意**: 新規ファイルとして作成するか、既存の類似Inputファイルがある場合はその末尾に追記すること。
2. graphql用output用の型定義を作る(既にあれば既存の型を流用する)
   - 実装パス: `src/backend/infrastructure/graphql/types/BodyComposition.ts`
   - ✨ **リファレンスサンプル**: `src/backend/infrastructure/graphql/types/Meal.ts` の `Meal`
3. 対象のresolverにメソッドを作る(mock)
   - 実装パス: `src/backend/presentation/resolvers/BodyCompositionResolver.ts`
   - ✨ **リファレンスサンプル**: `src/backend/presentation/resolvers/MealResolver.ts`
   - ⚠️ **絶対遵守**: 既存のResolverファイルを編集する際、**既存の他のメソッド（Queries/Mutations）やimport文を決して削除しないこと。** 新しいメソッドはクラスの末尾に追記すること。
   - 仕様: 引数として上記Inputを受け取り、上記Outputのmockデータ(固定値)を返却する。
4. testの追加実装と実行
   - 実装パス: `src/backend/presentation/resolvers/__tests__/BodyCompositionResolver.spec.ts`
   - 処理内容: 既存のテストファイルを開き、今回のメソッド用のテストケースを `describe` 内に**追記**する。
   - テスト実行コマンド:
     `docker compose run graphqlapi npm run test:single src/backend/presentation/resolvers/__tests__/BodyCompositionResolver.spec.ts`
6. サーバーの再起動と型自動生成
   - コマンド: `docker compose restart graphqlapi`
   - コマンド: `yarn codegen` # docker経由ではないことに注意。フロント用の型 `@/frontend/generated/graphql` を最新化する。

## STEP 1 フロントの実装
1. STEP 0 で生成された `@/frontend/generated/graphql` の最新の型（例: `BodyCompositionQuery` や `ListBodyCompositionMutation`）をインポートして、画面を実装する。
2. 実際にリクエストを行い、STEP 0 で作ったMockデータが画面に表示されることを確認する。
   - 画面仕様: 
     - ページタイトル: 体組成・体重計測履歴
     - デザインベース: app/(protected)/(admin)/nutrients/page.tsx
     - テーマ設定: 
       - カラースケール: emerald (focus:ring-emerald-500, bg-emerald-100, text-emerald-600, bg-emerald-600, hover:bg-emerald-700)
       - アイコン: Activity
     - 表示フィールド: 
       - 計測日時 (datetime)
       - 体重 (number, unit: kg)
       - BMI (number)
       - 体脂肪率 (number, unit: %)
       - 骨格筋率 (number, unit: %)
     - 実装上の注意点:
       1. 既存の `NutrientAdminPage` の構造、Loading表示、テーブル一覧のレイアウトを完全に踏襲すること。
       2. ターゲットパスに配置し、テーブルの各行をクリックした際は詳細画面（`/body-compositions/${item.id}`）へ動的遷移する設計にすること。
       3. 初期ステートの型定義や GraphQL の Query 呼び出し（`GET_BODY_COMPOSITIONS`）は、生成された `@/frontend/generated/graphql` の最新の型（`GetBodyCompositionsQuery`等）に厳密に合わせること。
       4. 今後、画面上部に「CSVインポート」のボタンやフォームを配置する拡張性（レイアウト上のスペース）を考慮して、ヘッダー右側のトグルやボタンの配置を設計すること。
   - 💡 **注意**: 実装ファイルは、上記の「🚨 今回のフロントエンド実装対象パス」にのみ作成すること。

## STEP 2 frontとの繋ぎこみ
1. STEP 0でモックした処理を廃止し、実際にgraphqlのエンドポイントにリクエストするように実装する。
   - 実装パス: `src/frontend/graphql/queries/body_composition.ts`
   - ✨ **リファレンスサンプル**: `src/frontend/graphql/queries/nutrient.ts`
   - 💡 **注意**: 既存ファイルがある場合は、その末尾にGraphQLドキュメント（`query` や `mutation`）を追記すること。

## STEP 3 serviceクラスとメソッドの作成 (mock)
1. serviceクラスに渡すDtoの型を作る
   - 実装パス: `src/backend/application/dtos/ListBodyCompositionDto.ts`
   - ✨ **リファレンスサンプル**: `src/backend/application/dtos/UpdateMealUseCaseDto.ts`
2. serviceクラスが返すDomainEntityの型を作る(既にあれば既存の型を流用)
   - 実装パス: `src/backend/domain/entities/BodyComposition.ts`
   - ✨ **リファレンスサンプル**: `src/backend/domain/entities/Meal.ts` の `Meal`
3. serviceクラスのinterfaceに追加するメソッドを追加定義する
   - 実装パス: `src/backend/domain/interfaces/IBodyCompositionService.ts`
   - ⚠️ **絶対遵守**: 既存のインターフェース定義を崩さず、新しいメソッドのシグネチャを追記すること。
4. serviceクラスに新たなメソッドをmock実装(resolverから呼ばれる想定)
   - 実装パス: `src/backend/application/services/BodyCompositionService.ts`
   - ⚠️ **絶対遵守**: 既存の他のメソッド実装を消さずに、新しいメソッドを固定値返却(Mock)の状態で追記すること。
5. testの追加実装と実行
   - 実装パス: `src/backend/application/services/__tests__/BodyCompositionService.spec.ts`
   - 処理内容: 既存 the テストファイルに、今回のメソッド用のテストケースを追記。
   - コマンド: `docker compose run graphqlapi npm run test:single src/backend/application/services/__tests__/BodyCompositionService.spec.ts`

## STEP 4 resolverの繋ぎこみ(resolver, mapper, service)
1. input ➔ Dto 変換および DomainEntity ➔ Output 変換を担うPresentationMapperにメソッドを追加(既存の実装が流用できる場合は不要)
   - 実装パス: `src/backend/acl/presentation_application/BodyCompositionPresentationMapper.ts`
   - ✨ **リファレンスサンプル**: `src/backend/acl/presentation_application/MealPresentationMapper.ts`
   - 💡 **注意**: 既存のMapperクラス内に、今回必要なマッピングメソッドを追記する。

## STEP 4.8 Resolverに追加したメソッドの本実装の結合
1. resolverの修正
   - 実装パス: `src/backend/presentation/resolvers/BodyCompositionResolver.ts`
   - 処理内容: STEP0で作成したメソッドから固定値返却(Mock)を削除し、Contextから既にDI登録されている `bodyCompositionsService` を取得。PresentationMapperを用いて安全に呼び出すように本実装を行う。
2. testの修正と実行 (ResolverテストをServiceモック方式に修正)

## STEP 5 repositoryクラスのmock実装
1. repositoryInput型の型定義を実装: `src/backend/domain/entities/BodyComposition.ts` (※Meal.tsのInput構造を参照)
   - 既に型が定義されていればそれを流用する。
2. repositoryインターフェースにメソッド追加: `src/backend/domain/interfaces/IBodyCompositionRepository.ts`
   - ⚠️ **絶対遵守**: 既存のインターフェース定義を決して消さずに、新しいメソッドのシグネチャを追記すること。
3. repositoryクラスにメソッドをmock実装: `src/backend/infrastructure/repositories/mock/BodyCompositionRepository.ts`
   - ⚠️ **絶対遵守**: 既存のMock実装を壊さないよう、末尾にメソッドを追記する。

## STEP 6 repositoryクラスの繋ぎこみ(repository, service)
1. STEP 3で追加した`BodyCompositionService` のメソッドに対する本実装
   - 固定値返却(Mock)を削除し、Repositoryを呼び出すように書き換える。
   - 💡 **ビジネスロジックの組み込み**:
     1. ログインユーザー（`user_id`）に紐づく計測データを、計測日時（`measured_at`）の降順（新しい順）で取得すること。
     2. CSVからの大量インポートを想定し、パフォーマンス低下を防ぐためのペジネーション（または最新N件の取得制限）の考慮を入れること。

## STEP 7 repositoryクラスの本実装
1. RepositoryMapperクラスへのメソッド追加（または新規作成）
   - 実装パス: `src/backend/acl/domain_infrastructure/BodyCompositionRepositoryMapper.ts`
   - ✨ **リファレンスサンプル**: `src/backend/acl/domain_infrastructure/MealRepositoryMapper.ts`
   - 💡 **注意**: 既存のRepositoryMapperクラスのメソッドが流用できるようであればそれを使い、足りなければメソッドを追記する。
2. STEP 5でリポジトリクラスに追加したメソッドに対して、本実装を行う
   - PrismaClientを利用し、recordに対してqueryを発行する。
   - **[create, update系のクエリだった場合]**: このクエリ実行後に再度selectして、該当レコードのentityを返すようにすること。
   - 実装パス: `src/backend/infrastructure/repositories/prisma/BodyCompositionRepository.ts`
   - ✨ **リファレンスサンプル**: `src/backend/infrastructure/repositories/prisma/MealRepository.ts`
