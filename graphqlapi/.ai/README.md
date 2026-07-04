(以下のプロンプトをopencodeに渡す)

以下のテンプレートファイルにYAMLのデータを流し込み、私がそのまま実行可能な詳細指示書（Markdown）を完成させてください。

- テンプレート: .ai/templates/function_design_template.md
- データソース: .ai/features/sample_show.yaml

【特に注意して処理するポイント】
1. テンプレート内の {{DOMAIN_NAME}} などの変数（マスタッシュタグ）は、すべてYAMLの該当する値に置換してください。
2. 「🚨 今回のフロントエンド実装対象パス（確定出力ルール）」のセクションでは、YAMLの `OPERATION_TYPE: "Show"` と `target_path_mapping` を照合し、変数を実値に置換した確定パス（app/(protected)/user-profiles/[id]/page.tsx）のみを残して出力してください。
3. 完成した指示書は、.ai/instructions/ 配下に適切なファイル名（例: user_profile_show_instruction.md）で新規出力（保存）してください。
