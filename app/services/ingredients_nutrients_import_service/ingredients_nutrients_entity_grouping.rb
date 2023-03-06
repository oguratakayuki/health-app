module IngredientsNutrientsImportService
  module IngredientsNutrientsEntityGrouping
    # 名前が重複する要素群に対して共通のgourp_nameを設定する
    def self.execute(entities)
      results = []
      grouped_entities = entities.group_by(&:name)
      name_duplicated_entities_groups = {}
      not_name_duplicated_entities_groups = {}
      grouped_entities.each do |name, grouped_entities|
        if grouped_entities.size > 1
          name_duplicated_entities_groups[name] =  grouped_entities
        else
          not_name_duplicated_entities_groups[name] = grouped_entities
        end
      end
      name_duplicated_entities_groups.each do |duplicated_name, entities|
        entities.each do |entity|
          entity.group_name = duplicated_name
          results << entity
        end
      end
      not_name_duplicated_entities_groups.values.flatten.concat(results).flatten
    end
  end
end
 
