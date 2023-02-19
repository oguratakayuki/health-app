module IngredientsNutrientsImportService
  module IngredientsNutrientsEntityGrouping
    # 名前が重複する要素群に対して共通のgourp_nameを設定する
    def self.execute(entities)
      results = []
      entities = entities.group_by(&:name)
      name_duplicated_entities_groups = grouped_entities.select { |grouped_entity| grouped_entity.size > 1 }
      not_name_duplicated_entities_groups = grouped_entities.select { |grouped_entity| grouped_entity.size == 0 }
      name_duplicated_entities_groups.each do |duplicated_name, entities|
        entities.each do |entity|
          entity.group_name = duplicated_name
          results << entity
        end
      end
      name_duplicated_entities_groups.values.concat(results).flatten
    end
  end
end
 
