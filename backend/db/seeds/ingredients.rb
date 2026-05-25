# frozen_string_literal: true

ingredients_data = [
  # --- 既存 ---
  { name: "豚肉", original_name: "豚ロース" },
  { name: "じゃがいも", original_name: "男爵" },
  { name: "にんじん", original_name: "にんじん" },
  { name: "中華麺", original_name: "蒸し麺" },
  { name: "キャベツ", original_name: "キャベツ" },
  { name: "白米", original_name: "精白米（めし）" },
  { name: "植物油", original_name: "サラダ油" },
  { name: "ソース", original_name: "濃厚ソース" },

  # --- 肉類 ---
  { name: "鶏むね肉", original_name: "鶏むね肉皮なし" },
  { name: "鶏もも肉", original_name: "鶏もも肉" },
  { name: "豚バラ肉", original_name: "豚バラ肉" },
  { name: "肉", original_name: "肉類" },
  { name: "牛もも肉", original_name: "牛もも赤身" },
  { name: "牛バラ肉", original_name: "牛バラ肉" },
  { name: "合挽肉", original_name: "合挽肉" },
  { name: "ラム肉", original_name: "ラムチョップ" },

  # --- 魚介類 ---
  { name: "鮭", original_name: "生鮭" },
  { name: "鯖", original_name: "生鯖" },
  { name: "鮪", original_name: "マグロ赤身" },
  { name: "鯵", original_name: "真鯵" },
  { name: "鰯", original_name: "真鰯" },
  { name: "海老", original_name: "むきえび" },
  { name: "蟹", original_name: "ズワイガニ" },
  { name: "牡蠣", original_name: "生牡蠣" },
  { name: "ホタテ", original_name: "ホタテ貝柱" },

  # --- 野菜・きのこ・海藻 ---
  { name: "玉ねぎ", original_name: "玉ねぎ" },
  { name: "大根", original_name: "大根" },
  { name: "白菜", original_name: "白菜" },
  { name: "白滝", original_name: "白滝" },
  { name: "ピーマン", original_name: "ピーマン" },
  { name: "ナス", original_name: "ナス" },
  { name: "キュウリ", original_name: "キュウリ" },
  { name: "トマト", original_name: "トマト" },
  { name: "ほうれん草", original_name: "ほうれん草" },
  { name: "ブロッコリー", original_name: "ブロッコリー" },
  { name: "レタス", original_name: "レタス" },
  { name: "かぼちゃ", original_name: "かぼちゃ" },
  { name: "ズッキーニ", original_name: "ズッキーニ" },
  { name: "アスパラガス", original_name: "アスパラガス" },
  { name: "アボカド", original_name: "アボカド" },
  { name: "にんにく", original_name: "にんにく" },
  { name: "生姜", original_name: "生姜" },
  { name: "しめじ", original_name: "しめじ" },
  { name: "えのき", original_name: "えのき" },
  { name: "舞茸", original_name: "舞茸" },
  { name: "椎茸", original_name: "椎茸" },
  { name: "わかめ", original_name: "乾燥わかめ" },
  { name: "海苔", original_name: "焼き海苔" },

  # --- 穀類・豆類・加工品 ---
  { name: "玄米", original_name: "玄米" },
  { name: "オートミール", original_name: "オートミール" },
  { name: "パン", original_name: "食パン" },
  { name: "パスタ", original_name: "スパゲティ（乾麺）" },
  { name: "うどん", original_name: "うどん（茹で）" },
  { name: "そば", original_name: "そば（茹で）" },
  { name: "小麦粉", original_name: "薄力粉" },
  { name: "豆腐", original_name: "絹ごし豆腐" },
  { name: "納豆", original_name: "納豆" },
  { name: "厚揚げ", original_name: "厚揚げ" },
  { name: "豆乳", original_name: "無調整豆乳" },

  # --- 乳製品・卵 ---
  { name: "卵", original_name: "鶏卵" },
  { name: "牛乳", original_name: "普通牛乳" },
  { name: "ヨーグルト", original_name: "プレーンヨーグルト" },
  { name: "バター", original_name: "無塩バター" },
  { name: "チーズ", original_name: "プロセスチーズ" },
  { name: "生クリーム", original_name: "動物性生クリーム" },

  # --- 果物 ---
  { name: "りんご", original_name: "りんご" },
  { name: "バナナ", original_name: "バナナ" },
  { name: "みかん", original_name: "みかん" },
  { name: "ぶどう", original_name: "ぶどう" },
  { name: "いちご", original_name: "いちご" },
  { name: "キウイ", original_name: "キウイフルーツ" },
  { name: "ブルーベリー", original_name: "ブルーベリー" },
  { name: "パイナップル", original_name: "パイナップル" },
  { name: "メロン", original_name: "メロン" },

  # --- 調味料・油脂 ---
  { name: "オリーブオイル", original_name: "オリーブオイル" },
  { name: "ごま油", original_name: "ごま油" },
  { name: "マヨネーズ", original_name: "マヨネーズ" },
  { name: "ケチャップ", original_name: "ケチャップ" },
  { name: "醤油", original_name: "濃口醤油" },
  { name: "味噌", original_name: "合わせ味噌" },
  { name: "砂糖", original_name: "上白糖" },
  { name: "塩", original_name: "食塩" },
  { name: "酢", original_name: "米酢" },
  { name: "蜂蜜", original_name: "蜂蜜" },
  { name: "みりん", original_name: "本みりん" },

  # --- その他 ---
  { name: "ナッツ", original_name: "ミックスナッツ" },
  { name: "ピーナッツバター", original_name: "ピーナッツバター" },
  { name: "チョコレート", original_name: "ミルクチョコレート" },
  { name: "ゼラチン", original_name: "粉ゼラチン" },
  { name: "コーンスターチ", original_name: "コーンスターチ" },
  { name: "はん天", original_name: "寒天" },
  { name: "きな粉", original_name: "きな粉" },
  { name: "オートミール", original_name: "オートミール" }, # 重複チェック、後で削除
  { name: "さつまいも", original_name: "さつまいも" },
  { name: "かぼちゃ", original_name: "かぼちゃ" }, # 重複
  { name: "れんこん", original_name: "れんこん" },
  { name: "ごぼう", original_name: "ごぼう" },
  { name: "山芋", original_name: "山芋" },
  { name: "里芋", original_name: "里芋" },
  { name: "えりんぎ", original_name: "えりんぎ" },
  { name: "しいたけ", original_name: "しいたけ" }, # 重複
  { name: "ほうれん草", original_name: "ほうれん草" }, # 重複
  { name: "小松菜", original_name: "小松菜" },
  { name: "春菊", original_name: "春菊" },
  { name: "三つ葉", original_name: "三つ葉" },
  { name: "しそ", original_name: "青じそ" },
  { name: "みつば", original_name: "三つ葉" },
  { name: "パクチー", original_name: "パクチー" },
  { name: "パセリ", original_name: "パセリ" },
  { name: "バジル", original_name: "バジル" },
  { name: "ミント", original_name: "ミント" },
  { name: "ローズマリー", original_name: "ローズマリー" },
  { name: "タイム", original_name: "タイム" },
  { name: "オレガノ", original_name: "オレガノ" },
  { name: "クミン", original_name: "クミン" },
  { name: "コリアンダー", original_name: "コリアンダー" },
  { name: "ターメリック", original_name: "ターメリック" },
  { name: "シナモン", original_name: "シナモン" },
  { name: "クローブ", original_name: "クローブ" },
  { name: "ナツメグ", original_name: "ナツメグ" },
  { name: "カルダモン", original_name: "カルダモン" },
  { name: "スターアニス", original_name: "八角" },
  { name: "黒胡椒", original_name: "黒胡椒" },
  { name: "白胡椒", original_name: "白胡椒" },
  { name: "唐辛子", original_name: "唐辛子" }
]

ingredients_data.each do |data|
  Ingredient.find_or_create_by!(name: data[:name]) do |i|
    i.original_name = data[:original_name]
  end
end
