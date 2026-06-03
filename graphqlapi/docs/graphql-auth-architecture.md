# GraphQLにおける認証・認可アーキテクチャ設計

本書は、本アプリケーションにおける GraphQL (Next.js App Router / GraphQL Yoga / TypeGraphQL) を用いた認証（Authentication）および認可（Authorization）の設計と、各コンポーネントの協調動作について解説した仕様・設計共有ドキュメントです。

## 1. 背景と設計思想

Webアプリケーションにおいて、認証・認可のロジックが各ビジネスロジック（リゾルバーやユースケース）に散在することは、コードの重複、可読性の低下、および実装漏れによるセキュリティリスク（特権昇格など）を招きます。

本システムでは、**TypeGraphQLが提供する宣言的な認可（Declarative Authorization）機構**を採用し、以下の設計思想に基づいて実装しています。

1. **責務の分離（Separation of Concerns）**: リクエストからのユーザー識別（認証）、権限の検証（認可）、本来のビジネスロジック（リゾルバー）のフェーズを明確に分離する。
2. **DRY原則（Don't Repeat Yourself）**: 各リゾルバーで毎回「ログインしているか」「管理者か」の条件分岐を書かない。
3. **安全側のデフォルト（Fail-Safe Defaults）**: 明示的に認可デコレータが指定されたリソースのみアクセスを許可し、未認証・権限不足の場合はビジネスロジックに入る前に自動的に遮断する。

---

## 2. 全体アーキテクチャ・処理フロー

クライアントからリクエストが到達してから、認可が判定され、リゾルバーが実行されるまでの処理フローは以下の通りです。

```text
[Client Request]
       │
       ▼ (1) HTTP POST /api/graphql
┌─────────────────────────────────────────────────────────────┐
│ 1. Route Handler (app/api/graphql/route.ts)                 │
│    - トークン検証: verifyIdToken(request)                    │
│    - Context生成: user 情報を GraphQLContext に注入           │
└─────────────────────────────────────────────────────────────┘
       │
       ▼ (2) GraphQL Schema Execution
┌─────────────────────────────────────────────────────────────┐
│ 2. TypeGraphQL Engine                                       │
│    - 対象リゾルバーの @Authorized() デコレータを検知           │
└─────────────────────────────────────────────────────────────┘
       │
       ▼ (3) 認可インターセプト (自動実行)
┌─────────────────────────────────────────────────────────────┐
│ 3. Authorization Guard (authChecker.ts)                    │
│    - context.user の有無チェック（認証チェック）            │
│    - 要求ロール（"admin" / "user"）とユーザー権限のマッチング   │
└─────────────────────────────────────────────────────────────┘
       │
 ┌─────┴──────────────────────┐
 │ [判定結果]                 │
 ├──────────────┬─────────────┤
 │ true (許可)  │ false (拒否)│
 └───┬──────────┴──────┬──────┘
     │                 │
     ▼ (4-A)           ▼ (4-B)
┌──────────────┐ ┌────────────────────────────────────────────┐
│ 4. Resolver  │ │ 5. GraphQL Error Response                  │
│  (本来の処理)│ │    - 処理を遮断し、Access Denied エラー返却 │
└──────────────┘ └────────────────────────────────────────────┘
```

### ③ 各コンポーネントの実装と役割

本アーキテクチャは以下の4つのレイヤー・コンポーネントが TypeGraphQL の仕様に則って協調動作しています。

#### エントリーポイント & 共通コンテキスト注入
* **ファイルパス:** `app/api/graphql/route.ts`
* **役割:** GraphQL Yoga の `context` ファクトリを利用し、リクエストごとに認証処理（`verifyIdToken`）を試みます。抽出されたユーザーオブジェクトは `GraphQLContext` に格納され、以降のレイヤーへ引き渡されます。

```typescript
// 一部抜粋
context: async ({ request }): Promise<GraphQLContext> => {
  let user;
  try {
    user = await verifyIdToken(request);
  } catch (error) {
    console.warn("Authentication failed:", error.message);
    user = undefined; // 認証失敗でも公開クエリのために処理は続行
  }

  return {
    user: user || undefined,
    ...ServiceFactory.getServicesFromContext(),
  };
}
```

#### 認可バリデータ（ガード関数）
* **ファイルパス:** `src/backend/application/auth/authChecker.ts`
* **役割:** TypeGraphQL の `AuthChecker<GraphQLContext>` インタフェースに準拠した共通の認可ロジックです。コンテキスト内のユーザー状態と、デコレータから要求されたロール（`roles`）を比較検証します。

```typescript
export const authChecker: AuthChecker<GraphQLContext> = ({ context }, roles) => {
  // 1. 未認証の場合
  if (!context.user) return false;

  // 2. ロール指定がない場合 (@Authorized())：ログイン済みであればOK
  if (roles.length === 0) return true;

  // 3. 管理者ロールのチェック (@Authorized("admin") または @RequireAdmin())
  if (roles.includes("admin") && !context.user.isAdmin) return false;

  // 4. 一般ユーザーロールのチェック
  if (roles.includes("user") && context.user.isAdmin === false) return true;

  return true;
};
```

#### 宣言的認可デコレータ
* **ファイルパス:** `src/backend/application/auth/decorators.ts`
* **役割:** TypeGraphQL 独自のデコレータをラップし、アプリケーション内で利用しやすい型安全なカスタムデコレータとして再エクスポートしています。

```typescript
// 認証済み（ログイン状態）であることを要求（ロール自由）
export function Authorized(roles: ("admin" | "user")[] = []) {
  return TypeGraphQLAuthorized(...roles);
}

// 管理者権限を明示的に要求
export function RequireAdmin() {
  return TypeGraphQLAuthorized("admin");
}
```

#### リゾルバー（ビジネスロジックのエントリーポイント）
* **ファイルパス:** `src/backend/presentation/resolvers/MealResolver.ts`
* **役割:** 開発者はビジネスロジックの実装に集中し、エンドポイントの保護はデコレータを付与するだけで完結します。

```typescript
@Mutation(() => Meal, { name: "updateMeal" })
@Authorized() // ← この目印により、実行前に裏側で authChecker が自動実行される
async updateMeal(
  @Arg("id") id: string,
  @Arg("input") input: UpdateMealInput,
  @Ctx() ctx: GraphQLContext,
) {
  // この関数が実行されている時点で、すでに「ログイン済み」であることが保証されている
  const dto = MealPresentationMapper.toServiceDto(ctx.user.id, input);
  return this.mealUseCase.execute(dto);
}
```

---

### ④ この設計のメリット

1. **リゾルバーのクリーン化**:
   各リゾルバー内に `if (!ctx.user) throw new Error(...)` のようなボイラープレートコードが一切なく、ユースケースへのマッピングやドメインロジックの呼び出しという「本来の責務」のみが美しく記述されています。
2. **高い拡張性**:
   新しく「マネージャー権限（`manager`）」などのロールを追加する場合も、`decorators.ts` と `authChecker.ts` の一箇所を修正するだけで、システム全体の全リゾルバーに対応可能です。
3. **型安全なコンテキスト**:
   `GraphQLContext` の型定義と TypeGraphQL のジェネリクスが結合しているため、認可を通過した後のリゾルバー内では `ctx.user.id` などのプロパティへ型安全にアクセスできます。
