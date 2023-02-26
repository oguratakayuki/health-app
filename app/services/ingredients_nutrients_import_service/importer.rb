module IngredientsNutrientsImportService
  class Importer

    include ActiveModel::Model
    include ActiveModel::Attributes
      attribute :path, :string

    def execute
      xlsx = Roo::Excelx.new(path)
      #puts xlsx.sheet('main').row(3)
      sheet = xlsx.sheet('main')


      #カラムIDがどのnutrientsと紐づいているかの配列
      nutrient_id_by_column_index = []
      units_by_column_index = []
      # header情報から栄養素情報を取得しシートの列IDとDB (nutrients)のidとマッピング
      (6..66).map do |column_index|
        nutrients_name = sheet.cell(6, column_index)
        nutrients_name = ActionView::Base.full_sanitizer.sanitize(nutrients_name)
        nutrient = Nutrient.find_by!(name: nutrients_name)
        puts "#{column_index}, #{nutrient.name}" 
        nutrient_id_by_column_index[column_index] = nutrient.name

        # 食材ごとに持っている栄養素nutrientの単位情報のbuild( xmg/100g)
        nutrients_unit_entity = NutrientsUnitEntity.parse_and_build(sheet.cell(8, column_index))
        units_by_column_index[column_index] = nutrients_unit_entity 
      end

      # debug
      puts  '-----'
      (6..66).map do |column_index|
        data = sheet.cell(9, column_index)
        nutrient_name = nutrient_id_by_column_index[column_index]
        unit = units_by_column_index[column_index]
        puts "#{nutrient_name}, #{data}, #{unit.attributes.inspect}" 
      end
      exit



      # 食材(ingredients)のbuild
      ingredient_entities = (9..2199).map do |row_index|
        name = sheet.cell('D', row_index)
        name, tags = IngredientNameParser.execute(name)
        IngredientEntity.new(row_index: row_index, name: name, tags: tags)
      end
      # 食材(ingredients)を更新
      ingredient_entities = IngredientsNutrientsEntityGrouping.execute(ingredient_entities)

      ingredient_entities.each {|entity| entity.update_name! }
      # TODO
      # 1. ingredient_group_nameを保存
      # 2. 食材ingredientsを保存する（nameとremark)
      ingredient_group_names = ingredient_entities.map(&:group_name).uniq


      # 食材( ingredients)と栄養素(nutrients)をmappingして保存(ingredients_nutrients)
      ingredient_entities.each do |ingredient_entity|
        (6..66).map do |column_index|
          content_quantity = sheet.cell(ingredient_entity.row_index,  column_index)
          nutrients_unit_entity = units_by_column_index[column_index]
          nutrients_unit_entity.content_quantity = content_quantity
          ingredient_entity, nutrients_unit_entity
          ingredients_nutrient = IngredientsNutrientsMapper.new(ingredient_entity: ingredient_entity, nutrients_unit_entity: nutrients_unit_entity).execute
          # TODO
          # 1. 食材の栄養素を保存する
        end
      end

    end
  end
end
