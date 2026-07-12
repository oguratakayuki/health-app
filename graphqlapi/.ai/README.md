(以下のプロンプトをopencodeに渡す)

以下のYAMLデータを解析し、今回の要件に合致する「いずれか1つのテンプレート」を選択して、私がそのまま実行可能な詳細指示書（Markdown）を完成させてください。

【入力データ】
- データソース: .ai/features/sample_list.yaml

【選択対象テンプレート（いずれか1つ）】
1. ドメイン（機能群）を完全に新規で作成する場合:
   .ai/templates/function_create_domain_template.md
2. 既存のドメイン（既存ファイル）に対してメソッドや画面を追加・拡張する場合:
   .ai/templates/function_extend_domain_template.md

【OpenCodeへの指示・処理ルール】
1. 今回追加するドメイン（UserProfile）が既存のプロジェクトに既に存在するかを判断し、適切な方のテンプレートを1つ選択してください。（※既存拡張の可能性が高い場合はテンプレート2を選択すること）
2. 選択したテンプレート内の `{{変数名}}`（マスタッシュタグ）は、すべてYAMLの該当する実値に置換してください。
3. YAML内のオブジェクト形式のデータ（FRONTEND_UI_SPEC など）は、テキストやツリー構造として綺麗に展開して流し込んでください。
4. 「🚨 今回のフロントエンド実装対象パス（確定出力ルール）」のセクションは、マッピング表のコメントを削除し、変数置換済みの確定パス（例: app/(protected)/user-profiles/[id]/page.tsx）のみを綺麗に残してください。
5. 完成した指示書は、.ai/instructions/ 配下に適切なファイル名（例: user_profile_show_instruction.md）で新規に出力（保存）してください。
