import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  // 1. バックエンドのスキーマ情報の場所（起動中のURL、または schema.graphql のパス）
  schema: "http://localhost:3000/api/graphql",

  // 2. フロントエンド側のクエリ（gql`...`）が書いてあるファイル
  documents: "src/frontend/graphql/**/*.ts",
  // 💡 エラーがあっても一旦ファイルを生成する設定
  allowPartialOutputs: true,

  generates: {
    // 3. 型定義ファイルの出力先ディレクトリ
    "src/frontend/generated/": {
      preset: "client",
      plugins: [],
    },
  },
};

export default config;
