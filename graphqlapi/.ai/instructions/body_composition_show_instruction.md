# 🚀 【機能追加設計書（既存拡張）】体組成計測詳細表示 機能

本ドキュメントは、既存のオニオンアーキテクチャをベースに、既存 of ファイルやクラスに対して 体組成計測詳細表示 機能のメソッド・処理を**追加（拡張）**するための詳細手順書である。
OpenCodeは各STEPを厳密に順を追って実行すること。また、**既存のコードや別メソッドを決して削除・上書き破壊しないこと。**

## 📋 追加機能の要件定義

- **対象ドメイン / 操作**: `BodyComposition` に対する `Show` 処理
- **データソース（スキーマ参照元）**: `prisma/schema.prisma 内の BodyComposition モデルを参照すること`
- **フロントエンドCRUD配置規約（全体構造）**:
app/(protected)/body-compositions/
├── [id]
│   ├── edit
│   │   ├── BodyCompositionForm.tsx
│   │   └── page.tsx
│   └── page.tsx                     # 詳細画面 (※今回のターゲット)
├── create
│   └── page.tsx
└── page.tsx

- **🚨 今回のフロントエンド実装対象パス（確定出力ルール）**:
  `app/(protected)/body-compositions/[id]/page.tsx`

- **フロントエンド表示・処理項目**:
  - 基本指標: `measured_at`, `weight`, `bmi`
  - 脂肪データ: `body_fat_percentage`, `body_fat_mass`, `subcutaneous_fat_percentage`, `visceral_fat_level`
  - 筋肉・骨・代謝: `skeletal_muscle_percentage`, `skeletal_muscle_mass`, `ffmi`, `bone_mass`, `basal_metabolism`

- **必須ビジネスロジック・算出ルール**:
  1. 対象の体組成計測レコードが存在しない場合は、NotFoundエラーを返却すること。
  2. 取得するデータは、ログインユーザー（`user_id`）本人のレコードであるかどうかの認可チェックを行うこと。

## STEP 0 【API/型定義ファースト】バックエンドのResolver Mockと型生成
1. graphql用input用の型定義を作る
   - 実装パス: `src/backend/infrastructure/graphql/inputs/ShowBodyCompositionInput.ts`
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
1. STEP 0 で生成された `@/frontend/generated/graphql` の最新の型（例: `BodyCompositionQuery` や `ShowBodyCompositionMutation`）をインポートして、画面を実装する。
2. 実際にリクエストを行い、STEP 0 で作ったMockデータが画面に表示されることを確認する。
   - 画面仕様: 
     - target_crud_structure: (上記定義参照)
     - design_base_file: "app/(protected)/(admin)/nutrients/page.tsx"
     - theme:
       - color_scale: "emerald (focus:ring-emerald-500, bg-emerald-100, text-emerald-600, bg-emerald-600, hover:bg-emerald-700)"
       - icon: "Activity"
     - page_title: "体組成計測詳細"
     - display_fields:
       - 計測日時 (measured_at): datetime
       - 体重 (weight): number (kg)
       - BMI (bmi): number
       - 体脂肪率 (body_fat_percentage): number (%)
       - 体脂肪量 (body_fat_mass): number (kg)
       - 皮下脂肪率 (subcutaneous_fat_percentage): number (%)
       - 内臓脂肪レベル (visceral_fat_level): integer
       - 骨格筋率 (skeletal_muscle_percentage): number (%)
       - 骨格筋量 (skeletal_muscle_mass): number (kg)
       - FFMI（除脂肪量指数） (ffmi): number
       - 骨量 (bone_mass): number (kg)
       - 基礎代謝量 (basal_metabolism): integer (kcal)
     - implementation_notes:
       1. 既存の `NutrientAdminPage` などのレイアウトをベースにしつつ、詳細画面として見やすく整理された2カラムのカードグリッド等のUI構成にすること。
       2. ターゲットパスに配置し、URLパラメータから `id` を取得して GraphQL の `GET_BODY_COMPOSITION` Queryを呼び出すこと。
       3. ヘッダー付近に「一覧に戻る」ボタン、および本データの編集画面（`/body-compositions/${id}/edit`）へ遷移する「編集する」ボタンを配置すること。
       4. 型定義は生成された `@/frontend/generated/graphql` の最新の型（`GetBodyCompositionQuery`等）を厳密に使用すること。
   - 💡 **注意**: 実装ファイルは、上記の「🚨 今回のフロントエンド実装対象パス」にのみ作成すること。

## STEP 2 frontとの繋ぎこみ
1. STEP 0でモックした処理を廃止し、実際にgraphqlのエンドポイントにリクエストするように実装する。
   - 実装パス: `src/frontend/graphql/queries/body_composition.ts`
   - ✨ **リファレンスサンプル**: `src/frontend/graphql/queries/nutrient.ts`
   - 💡 **注意**: 既存ファイルがある場合は、その末尾にGraphQLドキュメント（`query` や `mutation`）を追記すること。

## STEP 3 serviceクラスとメソッドの作成 (mock)
1. serviceクラスに渡すDtoの型を作る
   - 実装パス: `src/backend/application/dtos/ShowBodyCompositionDto.ts`
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
   - 処理内容: 既存のテストファイルに、今回のメソッド用のテストケースを追記。
   - コマンド: `docker compose run graphqlapi npm run test:single src/backend/application/services/__tests__/BodyCompositionService.spec.ts`

## STEP 4 resolverの繋ぎこみ(resolver, mapper, service)
1. input ➔ Dto 変換および DomainEntity ➔ Output 変換を担うPresentationMapperにメソッドを追加(既存の実装が流用できる場合は不要)
   - 実装パス: `src/backend/acl/presentation_application/BodyCompositionPresentationMapper.ts`
   - ✨ **リファレンスサンプル**: `src/backend/acl/presentation_application/MealPresentationMapper.ts`
   - 💡 **注意**: 既存のMapperクラス内に、今回必要なマッピングメソッドを追記する。

## STEP 4.8 Resolverに追加したメソッドの本実装の結合
1. resolverの修正
   - 実装パス: `src/backend/presentation/resolvers/BodyCompositionResolver.ts`
   - 処理内容: STEP0で作成したメソッドから固定値返却(Mock)を削除し、Contextから既にDI登録されている `bodyCompositionService` を取得。PresentationMapperを用いて安全に呼び出すように本実装を行う。
2. testの修正と実行 (ResolverテストをServiceモック方式に修正)

## STEP 5 repositoryクラスのmock実装
1. repositoryInput型の型定義を実装: `src/backend/domain/entities/BodyComposition.ts` (※Meal.ts의 Input構造を参照)
   - 既に型が定義されていればそれを流用する。
2. repositoryインターフェースにメソッド追加: `src/backend/domain/interfaces/IBodyCompositionRepository.ts`
   - ⚠️ **絶対遵守**: 既存のインターフェース定義を決して消さずに、新しいメソッドのシグネチャを追記すること。
3. repositoryクラスにメソッドをmock実装: `src/backend/infrastructure/repositories/mock/BodyCompositionRepository.ts`
   - ⚠️ **絶対遵守**: 既存のMock実装を壊さないよう, 末尾にメソッドを追記する。

## STEP 6 repositoryクラスの繋ぎこみ(repository, service)
1. STEP 3で追加した`BodyCompositionService` のメソッドに対する本実装
   - 固定値返却(Mock)を削除し、Repositoryを呼び出すように書き換える。
   - 💡 **ビジネスロジックの組み込み**:
     1. 対象の体組成計測レコードが存在しない場合は、NotFoundエラーを返却すること。
     2. 取得するデータは、ログインユーザー（`user_id`）本人のレコードであるかどうかの認可チェックを行うこと。

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
