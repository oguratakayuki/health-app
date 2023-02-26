module IngredientsNutrientsImportService
  module IngredientNameParser
    def self.execute(original_name)
      name = original_name
      tags = []
      # （もも類）　もも　30 %果汁入り飲料（ネクター）
      matched = name.match('^（(.*)）(.*)（(.*)）')
      if matched
        name = matched[3]
        tags.concat(matched[2].split("　").reject(&:empty?))
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
      splitted = name.split('　')
      if splitted.count > 1
        # えんどう　グリンピース（揚げ豆）
        tags.concat(splitted)
      end



      # 全角半角を削除
      #name = name.gsub!(/(^[[:space:]]+)|([[:space:]]+$)/, '')
      name = name.gsub(/　/," ").strip
      matched = name.match('(.*)［(.*)］(.*)')
      binding.pry if name == nil

      names = name.split('　').reject { |c| c.empty? }
      main = names.shift
      tags.concat(names)
      puts "main name = #{main}, tags = #{tags.inspect}, original = #{original_name}"
      [main, tags]
    end
  
  end
end
