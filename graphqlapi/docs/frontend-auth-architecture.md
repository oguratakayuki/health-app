# フロントエンドの認証・認可アーキテクチャ設計

## 概要

本ドキュメントでは、Next.js App Router環境における認証・認可アーキテクチャの設計について説明します。React ProviderパターンとLayout-Level Authentication Patternを組み合わせたハイブリッドアーキテクチャを採用しています。

## アーキテクチャ概要

```text
┌─────────────────────────────────────────────────────────────┐
│                        アプリケーション                        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │  一般保護ページ   │    │    管理者ページ   │                │
│  │  (Protected)    │    │    (Admin)      │                │
│  └────────┬────────┘    └────────┬────────┘                │
│           │                      │                         │
│  ┌────────▼────────┐    ┌────────▼────────┐                │
│  │   AuthGuard     │    │ AdminAuthGuard  │                │
│  │  (Client Side)  │    │  (Client Side)  │                │
│  └────────┬────────┘    └────────┬────────┘                │
│           │                      │                         │
│  ┌────────▼────────┐    ┌────────▼────────┐                │
│  │   AuthProvider  │    │AdminAuthProvider│                │
│  │  (React Context)│    │ (React Context) │                │
│  └────────┬────────┘    └────────┬────────┘                │
│           │                      │                         │
│           └──────────┬───────────┘                         │
│                      │                                     │
│              ┌───────▼────────┐                            │
│              │   GraphQL API  │                            │
│              │   (Backend)    │                            │
│              └─────────────────┘                            │
└─────────────────────────────────────────────────────────────┘
```

以下の図は、アプリケーション全体の認証フローを示しています：

- 一般保護ページと管理者ページで異なる認証階層を持つ
- クライアントサイドとサーバーサイドで二重の認証チェックを実施
- GraphQL APIを中心としたデータフロー

---

## ディレクトリ構成

```text
src/frontend/auth/
├── contexts/                 # React Context定義
│   ├── AuthContext.tsx      # 基底認証Context
│   └── AdminAuthContext.tsx # 管理者認証Context
├── providers/               # Provider実装
│   ├── AuthProvider.tsx     # 基底認証Provider
│   └── AdminAuthProvider.tsx # 管理者認証Provider
├── hooks/                   # カスタムフック
│   ├── useAuth.ts          # 基底認証フック
│   └── useAdminAuth.ts     # 管理者認証フック
├── guards/                  # 認証ガード
│   ├── AuthGuard.tsx       # 基底認証ガード
│   └── AdminAuthGuard.tsx  # 管理者認証ガード
├── services/               # 認証ビジネスロジック
│   ├── AuthService.ts      # 認証サービス
│   └── TokenService.ts     # トークン管理
├── types/                  # 型定義
│   ├── auth.types.ts
│   └── session.types.ts
├── constants/              # 定数定義
│   └── auth.constants.ts
└── index.ts               # 公開インターフェース
```

---

## 主要パターン

### 1. React Provider Pattern

- **適用箇所**: `app/(protected)/layout.tsx`
- **目的**: クライアントサイドでのグローバルな認証状態管理
- **実装例**:

```tsx
// app/(protected)/layout.tsx
import { AuthProvider } from '@/frontend/auth/providers/AuthProvider';
import { AuthGuard } from '@/frontend/auth/guards/AuthGuard';

export default function ProtectedLayout({ children }) {
  return (
    <AuthProvider>
      <AuthGuard>
        <div className="flex">
          <Sidebar />
          <main>{children}</main>
        </div>
      </AuthGuard>
    </AuthProvider>
  );
}
```

- **特徴**:
  - 認証状態を全コンポーネントで共有
  - リアクティブな状態更新
  - トークン期限切れの自動検知

### 2. Layout-Level Authentication Pattern

- **適用箇所**: `app/(protected)/(admin)/layout.tsx`
- **目的**: サーバーサイドでの初期認証チェック
- **実装例**:

```tsx
// app/(protected)/(admin)/layout.tsx
import { notFound } from 'next/navigation';
import { getUserSession } from '@/backend/application/services/getUserSession';
import { AdminAuthProvider } from '@/frontend/auth/providers/AdminAuthProvider';
import { AdminAuthGuard } from '@/frontend/auth/guards/AdminAuthGuard';

export default async function AdminLayout({ children }) {
  // Server Componentでの認証チェック
  const user = await getUserSession();

  if (!user || !user.isAdmin) {
    notFound();
  }

  // Client Componentでの動的認証管理
  return (
    <AdminAuthProvider initialUser={user}>
      <AdminAuthGuard>
        <div className="flex">
          <main>{children}</main>
        </div>
      </AdminAuthGuard>
    </AdminAuthProvider>
  );
}
```

- **特徴**:
  - SEO対策（非公開ページを認識させない）
  - 初期表示の高速化
  - サーバーリソースの節約

### 3. ハイブリッド認証パターン

両方のパターンを組み合わせることで、以下のメリットを実現：

| 観点 | Provider Pattern | Layout-Level Pattern | ハイブリッド |
| :--- | :---: | :---: | :---: |
| **初期表示速度** | △ | ○ | **○** |
| **リアクティブ性** | ○ | △ | **○** |
| **SEO対策** | △ | ○ | **○** |
| **トークン期限対応** | ○ | △ | **○** |
| **セキュリティ** | ○ | ○ | **◎** |

---

## 実装の階層構造

```text
app/
├── (auth)/              # 認証不要（ログイン、サインアップ）
│   ├── login/
│   └── signup/
├── (protected)/         # 認証が必要
│   ├── layout.tsx      # AuthProvider + AuthGuard
│   ├── dashboard/
│   ├── meals/
│   ├── user/
│   └── (admin)/        # さらに制限（管理者専用）
│       ├── layout.tsx  # Layout-Level Auth + AdminAuthProvider
│       ├── dishes/
│       ├── ingredients/
│       └── nutrients/
```

---

## データフロー

### ログインフロー

1. ユーザーがログインフォームを送信
2. `/api/auth/login` APIを呼び出し
3. Cognitoで認証 $\rightarrow$ トークン発行
4. クッキーにトークンを設定
5. `AuthProvider` が `ME_QUERY` を実行
6. GraphQL APIがトークンを検証
7. ユーザー情報をContextに設定
8. `isLoggedIn = true` に更新

### 認証チェックフロー

```text
ページアクセス
   │
   ▼
Layout-Level Pattern（Server）
   ├─ 未認証 ───> /login
   └─ 認証済み ─> 続行
                   │
                   ▼
AuthProvider（Client）
   ├─ トークン検証
   ├─ 期限チェック
   └─ ユーザー情報取得
                   │
                   ▼
AuthGuard（Client）
   ├─ 未認証 ───> /login
   ├─ 権限不足 ─> /not-found
   └─ 認証済み ─> ページ表示
```

---

## 主要コンポーネント

### AuthProvider
認証状態の基盤となるProvider。GraphQL経由でユーザー情報を取得し、Contextで共有します。

```tsx
// 使用例
const { user, isLoggedIn, login, logout } = useAuth();
```

### AdminAuthProvider
管理者向けの拡張Provider。Server Componentから初期ユーザー情報を受け取り、権限昇格などの機能を追加します。

```tsx
// 使用例
const { isSuperAdmin, permissions, elevatePrivileges } = useAdminAuth();
```

### AuthGuard
クライアントサイドの認証ガード。未認証ユーザーをログインページにリダイレクトします。

```tsx
// 使用例
<AuthGuard>
  <ProtectedComponent />
</AuthGuard>
```

### AdminAuthGuard
管理者向け認証ガード。管理者権限がないユーザーを404ページにリダイレクトします。

```tsx
// 使用例
<AdminAuthGuard requireSuperAdmin>
  <AdminOnlyComponent />
</AdminAuthGuard>
```

---

## 環境変数

```bash
# .env.local
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_GRAPHQL_URL=/api/graphql
COGNITO_USER_POOL_ID=local_xxx
COGNITO_CLIENT_ID=xxx
```

---

## セキュリティ考慮点

### トークン管理
- HttpOnly Cookieで保存
- 定期的なトークンリフレッシュ
- 期限切れ時の自動ログアウト

### 二重認証チェック
- Server Componentでの初期チェック
- Client Componentでの動的チェック
- APIレベルでの認証

### 権限管理
- ルートレベルでの権限制御
- コンポーネントレベルでの権限制御
- APIレベルでの権限検証

---

## デバッグ方法

### 認証状態の確認
```tsx
// デバッグページを作成して確認
import { useAuth } from '@/frontend/auth/hooks/useAuth';

export default function DebugPage() {
  const { user, isLoggedIn, loading } = useAuth();
  return <pre>{JSON.stringify({ user, isLoggedIn, loading }, null, 2)}</pre>;
}
```

### トークンの確認
```javascript
// ブラウザコンソール
console.log(document.cookie);

// または Application ──> Cookies で確認
```

### GraphQL直接テスト
```javascript
fetch('/api/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: '{ me { id email } }' })
}).then(r => r.json()).then(console.log);
```

---

## トラブルシューティング

### ログイン後も `isLoggedIn` が `false` の場合
- Apollo Clientのキャッシュをクリア
- 開発サーバーを再起動
- ブラウザのクッキーをクリア

```bash
rm -rf .next
npm run dev
```

### 認証ループが発生する場合
- クッキーの有効期限を確認
- リダイレクト先のパスを確認
- `middleware.ts` の設定を確認
```
