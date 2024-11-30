# frozen_string_literal: true

module IngredientsNutrientsImportService
  module IngredientNameParser
    def self.execute(original_name)
      name = original_name
      tags = []
      # （もも類）　もも　30 %果汁入り飲料（ネクター）
      matched = name.match('^（(.*)）(.*)（(.*)）')
      if matched
        name = matched[3]
        tags.concat(matched[2].split('　').reject(&:empty?))
      end

      matched = name.match('＜(.*)＞　*(.*)')
      if matched
        tags << matched[1]
        name = matched[2]
      end
      matched = name.match('^（(.*)）(.*)')
      if matched
        tags << matched[1]
        name = matched[2]
      end
      matched = name.match('(.*)［(.*)］(.*)')
      if matched
        name = matched[1] + matched[3]
        tags << matched[2]
      end

      # 全角半角を削除
      # name = name.gsub!(/(^[[:space:]]+)|([[:space:]]+$)/, '')
      # name = 'からし　粒入りマスタード'
      name = name.gsub(/　/, ' ').strip
      # matched = name.match('(.*)［(.*)］(.*)')

      # 末尾をnameに、それ以外をtagsに
      names = name.split('　').reject(&:empty?)
      names = name.split(' ').reject(&:empty?)
      # binding.pry
      if names.count > 1
        # えんどう　グリンピース（揚げ豆）
        main, temp_tags = divide_name_and_tags(names)
        # TODO
        # original_nameを保持する
        # group_nameはtagの一種として定義する
        tags.concat(temp_tags)
      else
        main = names.pop
        tags.concat(names)
      end

      puts "main name = #{main}, tags = #{tags.inspect}, original = #{original_name}"
      [main, tags]
    end

    def self.is_tag?(text)
      return true if text.match('.*タイプ')
      return true if text.match('.*済み')
      return true if text.match('.*用')
      return true if text.match('.*なし')
      return true if text.match('.*のみ')
      return true if text.match('.*入り')
      return true if text.match('.*風')
      return true if text.match('.*脂肪')
      return true if text.match('.*製品')
      return true if text.match('.*つき')
      return true if text.match('.*型')
      return true if %w[生 乾 冷凍 粉 食塩添加 食塩無添加 小粒 黒 白 ゆで 皮なし 肉 ゆで 焼き 練り].include?(text)

      false
    end

    def self.divide_name_and_tags(names)
      tags = []
      main = nil
      names.reverse.each do |name|
        if main
          tags << name
          next
        end
        # binding.pry
        if is_tag?(name)
          tags << name
        else
          main = name
        end
      end
      [main, tags]
    end
  end
end
