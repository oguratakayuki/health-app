module IngredientNameParser
  def self.execute(original_name)
    name = original_name
    tags = []
    matched = name.match('＜(.*)＞(.*)')
    if matched
      tags << matched[1]
      name = matched[2]
    end
    matched = name.match('（(.*)）(.*)')
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
    name = name.gsub!(/(^[[:space:]]+)|([[:space:]]+$)/, '')
    names = name.split('　').reject { |c| c.empty? }
    main = names.shift
    tags.concat(names)
    puts "main name = #{main}, tags = #{tags.inspect}, original = #{original_name}"
    [main, tags]
  end

end
