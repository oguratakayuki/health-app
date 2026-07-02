# 🚀 【機能追加設計書】ユーザープロフィール詳細表示 機能

⚠️ **重要：作成対象のファイルやコードが既にある場合はそれを流用してください。可能な限り既存のコードを削除しないでください。**

本ドキュメントは、既存のオニオンアーキテクチャをベースに ユーザープロフィール詳細表示 機能をOutside-Inで追加するための詳細手順書である。
OpenCodeは各STEPを厳密に順を追って実行すること。

## 📋 追加機能の要件定義

- **対象ドメイン / 操作**: `UserProfile` に対する `Show` 処理
- **データソース（スキーマ参照元）**: `prisma/schema.prisma 内の UserProfile モデルを参照すること`
- **フロントエンド表示・処理項目**:
  - 性別: `gender`
  - 身長: `height`
  - 誕生日: `birthday`
  - 年齢: `age` (バックエンドまたはフロントエンドで `birthday` から動的に算出する)
- **必須ビジネスロジック・算出ルール**:
  1. `birthday` から現在時刻を基準とした「年齢（age）」を計算するロジックを実装すること。
  2. 対象のユーザープロフィールが存在しない場合は、NotFoundエラーを返却すること。

## STEP 0 【API/型定義ファースト】バックエンドのResolver Mockと型生成
1. graphql用input用の型定義を作る
   - 実装パス: `src/backend/infrastructure/graphql/inputs/ShowUserProfileInput.ts`
   - ✨ **リファレンスサンプル**: `src/backend/infrastructure/graphql/inputs/UpdateMealInput.ts`
2. graphql用output用の型定義を作る
   - 実装パス: `src/backend/infrastructure/graphql/types/UserProfile.ts`
   - ✨ **リファレンスサンプル**: `src/backend/infrastructure/graphql/types/Meal.ts` の `Meal`

3. resolverとメソッドを作る(mock)
   - 実装パス: `src/backend/presentation/resolvers/UserProfileResolver.ts`
   - ✨ **リファレンスサンプル**: `src/backend/presentation/resolvers/MealResolver.ts`
   - 仕様: 引数として上記Inputを受け取り、上記Outputのmockデータ(固定値)を返却する。

4. testの実装と実行
   - 実装パス: `src/backend/presentation/resolvers/__tests__/UserProfileResolver.spec.ts`
   - テスト実行コマンド:
     `docker compose run graphqlapi npm run test:single src/backend/presentation/resolvers/__tests__/UserProfileResolver.spec.ts`
5. ✨ フロントエンド型定義の自動生成 (重要)
   - 以下のコマンドを実行して、フロント用の型を生成する。
     `yarn codegen`

## STEP 1 フロントの実装
1. STEP 0 で生成された `@/frontend/generated/graphql` の最新の型（例: `UserProfileQuery`）をインポートして、画面を実装する。
2. 実際にリクエストを行い、STEP 0 で作ったMockデータが画面に表示されることを確認する。
   - 画面仕様: 
     - target_path: "app/(protected)/user-profiles/page.tsx"
     - design_base_file: "app/(protected)/(admin)/nutrients/page.tsx"
     - theme: 
       - color_scale: "blue (focus:ring-blue-500, bg-blue-100, text-blue-600, bg-blue-600, hover:bg-blue-700)"
       - icon: "Scale"
     - page_title: "プロフィール"
     - display_fields:
       - 性別 (gender): text / placeholder: 未設定
       - 身長 (height): number / suffix: cm
       - 誕生日 (birthday): date
       - 年齢 (custom_logic): text / suffix: 歳
     - implementation_notes: |
       1. 既存の `NutrientAdminPage` の構造、Loading表示、テーブル一覧のレイアウト、および `useRouter` による動的遷移（`/user-profiles/${item.id}/edit`）の設計を完全に踏襲すること。
       2. 一般ユーザー用のページであるため、パスは `app/(protected)/user-profiles/page.tsx` に配置すること。
       3. 初期ステートの型定義や GraphQL の Mutation 呼び出し（`CREATE_USER_PROFILE` / `DELETE_USER_PROFILE` / `GET_USER_PROFILE`）は、生成された `@/frontend/generated/graphql` の最新の型（`CreateUserProfileMutation`等）に厳密に合わせること。

## STEP 2 frontとの繋ぎこみ
1. STEP 0でモックした処理を廃止し、実際にgraphqlのエンドポイントにリクエストするように実装する。
   - 実装パス: `src/frontend/graphql/queries/user_profile.ts`
   - ✨ **リファレンスサンプル**: `src/frontend/graphql/queries/nutrient.ts`

## STEP 3 serviceクラスとメソッドの作成 (mock)
1. serviceクラスに渡すDtoの型を作る
   - 実装パス: `src/backend/application/dtos/ShowUserProfileDto.ts`
   - ✨ **リファレンスサンプル**: `src/backend/application/dtos/UpdateMealUseCaseDto.ts`
2. serviceクラスが返すDomainEntityの型を作る
   - 実装パス: `src/backend/domain/entities/UserProfile.ts`
   - ✨ **リファレンスサンプル**: `src/backend/domain/entities/Meal.ts` の `Meal`
3. serviceクラスのinterfaceを定義する
   - 実装パス: `src/backend/domain/interfaces/IUserProfileService.ts`
   - ✨ **リファレンスサンプル**: `src/backend/domain/interfaces/IMealService.ts`
4. serviceクラスのmock実装
   - 実装パス: `src/backend/application/services/UserProfileService.ts`
   - ✨ **リファレンスサンプル**: `src/backend/application/services/MealService.ts`
5. testの実装と実行
   - 実装パス: `src/backend/application/services/__tests__/UserProfileService.spec.ts`
   - コマンド: `docker compose run graphqlapi npm run test:single src/backend/application/services/__tests__/UserProfileService.spec.ts`

## STEP 4 resolverの繋ぎこみ(resolver, mapper, service)
1. input ➔ Dto 変換および DomainEntity ➔ Output 変換を担うPresentationMapperを作る
   - 実装パス: `src/backend/acl/presentation_application/UserProfilePresentationMapper.ts`
   - ✨ **リファレンスサンプル**: `src/backend/acl/presentation_application/MealPresentationMapper.ts`
2. resolverの修正
   - 固定値返却を削除し、上記Mapperと `IUserProfileService` を呼び出すように変更。
3. testの修正と実行 (ResolverテストをServiceモック方式に修正)

## STEP 5 repositoryクラスのmock実装
1. repositoryInput型の型定義を実装: `src/backend/domain/entities/UserProfile.ts` (※Meal.tsのInput構造を参照)
2. repositoryインターフェースの実装: `src/backend/domain/interfaces/IUserProfileRepository.ts`
   - ✨ **リファレンスサンプル**: `src/backend/domain/interfaces/IMealRepository.ts`
3. repositoryクラスのmock実装: `src/backend/infrastructure/repositories/mock/UserProfileRepository.ts`

## STEP 6 repositoryクラスの繋ぎこみ(repository, service)
1. `UserProfileService` の本実装
   - 固定値返却を削除し、Repositoryを呼び出す。
   - 💡 **ビジネスロジックの組み込み**:
     1. `birthday` から現在時刻を基準とした「年齢（age）」を計算するロジックを実装すること。
     2. 対象のユーザープロフィールが存在しない場合は、NotFoundエラーを返却すること。

## STEP 7 repositoryクラスの本実装
1. RepositoryMapperクラス作成とメソッドの実装
   - 実装パス: `src/backend/acl/domain_infrastructure/UserProfileRepositoryMapper.ts`
   - ✨ **リファレンスサンプル**: `src/backend/acl/domain_infrastructure/MealRepositoryMapper.ts`
2. Prismaを利用した本リポジトリの実装
   - 実装パス: `src/backend/infrastructure/repositories/prisma/UserProfileRepository.ts`
   - ✨ **リファレンスサンプル**: `src/backend/infrastructure/repositories/prisma/MealRepository.ts`
