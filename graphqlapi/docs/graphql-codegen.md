# GraphQL Code Generator を用いた型同期アーキテクチャ

## 1. 目的と概要
本ドキュメントは、バックエンドの GraphQL スキーマとフロントエンドの TypeScript 型定義を自動同期し、型安全（Type-Safe）な開発環境を維持するためのアーキテクチャおよび運用フローについてまとめたものである。

### 背景と課題
フロントエンドが保持する GraphQL クエリ・ミューテーションの引数や構造が、バックエンドの最新の `InputType`（例: `CreateDishInput`, `CreateNutrientInput`）の変更（必須フィールドの追加、ID型の変更など）とズレることで、ランタイムエラーや通信エラーが発生していた。

### 解決策
`graphql-codegen` を導入・再設定し、バックエンドのスキーマ変更を自動的に検知してフロントエンド用の TypeScript 型（型定義および各種 Variables 型）を自動生成する仕組みを構築した。

---

## 2. アーキテクチャと各ファイルの役割
フロントエンドとバックエンドは `codegen.ts` を媒介として、以下のような役割分担で型を同期している。

### 役割一覧表

| ファイル / ディレクトリ | 役割・説明 |
| :--- | :--- |
| `codegen.ts` | GraphQL Code Generator のメタ設定ファイル。スキーマの読み込み先、フロントエンドの探索対象ファイル、出力先を管理する。 |
| `src/backend/.../inputs/`<br>(例: `CreateNutrientInput.ts`) | バックエンド（Type-GraphQL）の入力型定義。ここで `@Field()` の必須/任意や、新規項目（例: `code` フィールド）が定義される。すべての型の絶対的な「正解（ソースオブトゥルース）」となる。 |
| `src/frontend/graphql/queries/`<br>(例: `nutrient.ts`, `dish.ts`) | フロントエンドがAPIへリクエストを送信する際の GraphQL 構文（Operation）定義の置き場。バックエンドの仕様に則って記述する。 |
| `src/frontend/generated/` | `yarn codegen` 実行時に自動生成されるディレクトリ。バックエンドのスキーマとフロントのクエリが結合された最新の型定義ファイル（`graphql.ts`）が出力される。 |

---

## 3. トラブルシューティングと実装方針の決定
環境構築にあたり発生した重要なエラーと、本プロジェクトにおける最終的な解決アプローチの記録である。

### 3.1 クエリ構造および引数のミスマッチ解消
バックエンドの仕様変更に伴い、以下のリファクタリングをクエリファイルおよび画面コンポーネントに対して実施した。

* **Inputオブジェクトによるカプセル化**: 引数を単一の変数（例: `$name`）で直接渡す方式から、バックエンドが要求する `{ input: { name, code } }` 構造に完全同期。
* **ID型の不整合修正**: `id` の型定義が `Int` から `String`（文字列型）へ変更されていたため、フロントエンドの State 管理および GraphQL 引数を `string` へ統一。
* **必須バリデーションの追従**: `CreateNutrientInput` に `code`（識別コード）が必須追加されたことを検知し、フロントエンド側にも入力欄と State を追加して対応。

### 3.2 Apollo Client 3.x と Client-Preset の相性問題 (重要)
`graphql-codegen` の `client-preset`（`graphql()` 関数を用いたクエリ生成）をそのまま Apollo Client の `useQuery` や `useMutation` に渡すと、ランタイム時に `Invariant Violation: An error occured!`（パース失敗）を誘発する問題が発生した。

#### 本プロジェクトにおける設計方針（根本解決）
パースエラーを完全に回避しつつ、codegen の強力な型チェックの恩恵を最大化するため、以下の「ハイブリッド方式」を採用する。

1. **クエリ定義（フロント queries 側）**: クエリ文字列の解析は Apollo Client に確実に任せるため、実績のある `@apollo/client` の `gql` テンプレートリテラルを使用する。
2. **コンポーネント側**: `useQuery` や `useMutation` を呼び出す際、自動生成された `generated/graphql` から対応する型をインポートし、ジェネリクス（`<型, 型>`）として明示的に注入する。

#### 実装例：画面コンポーネント側での型定義の適用
```
import { useMutation } from "@apollo/client";
import { CREATE_NUTRIENT } from "@/frontend/graphql/queries/nutrient";
import {
  CreateNutrientMutation,
  CreateNutrientMutationVariables,
} from "@/frontend/generated/graphql";

// useMutation に型を明示的にハメ込む
const [createNutrient] = useMutation<
  CreateNutrientMutation,
  CreateNutrientMutationVariables
>(CREATE_NUTRIENT);
```
これにより、variables: { input: { name, code } } のタイポがコンパイルレベルで100%検知される</code></pre>

---

## 4. 今後の開発フロー
バックエンドのスキーマ追加・変更、または新画面の実装を行う際は、必ず以下のルーティンを実行すること。

1. **バックエンド側**: 変更や追加（`InputType` や `ObjectType` の定義など）を実装し、ローカルのGraphQLサーバーを起動する。
2. **フロントエンド queries 側**: `src/frontend/graphql/queries/` 内の該当ファイルを必要に応じて更新・新規作成する。
3. **コード生成コマンドの実行**:
   <pre><code class="language-bash">yarn codegen</code></pre>
4. **コンポーネント実装**: 更新された `src/frontend/generated/graphql.ts` から必要な型（`Query`、`Mutation`、`MutationVariables`）を読み込み、フックに適用して実装を進める。

---

## 5. 注意事項・運用ルール

### クエリ・ミューテーションには必ず「名前」をつける
`yarn codegen` を実行した際、クエリに名前がついていない（匿名クエリ）と、`the following anonymous operation is skipped` という警告が出て、そのクエリに対する型（`Variables`型など）が生成されない。

フロントで利用する GraphQL 操作には、必ず一意の作戦名（Operation Name）を付与すること。

❌ **匿名クエリ（型が生成されない）**
<pre><code class="language-typescript">query { prismaNutrients { id name } }</code></pre>

⭕ **名前付きクエリ（正しい運用）**
<pre><code class="language-typescript">query GetNutrients { prismaNutrients { id name } }</code></pre>

### 生成ファイルを直接編集しない
`src/frontend/generated/` ディレクトリ内のファイルは、コマンドによって上書きされる使い捨てのファイルである。絶対に手動で修正を加えないこと。
