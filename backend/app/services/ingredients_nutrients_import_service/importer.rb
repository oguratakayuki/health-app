# frozen_string_literal: true

module IngredientsNutrientsImportService
  class Importer
    include ActiveModel::Model
    include ActiveModel::Attributes
    attribute :path, :string

    def execute
      xlsx = Roo::Excelx.new(path)
      sheet = xlsx.sheet('main')

      # カラムIDがどのnutrientsと紐づいているかの配列
      nutrient_id_by_column_index = []
      # カラムIDがどの栄養素の単位(kcal/100 gなど)で定義されているか単位情報を保持
      units_by_column_index = []

      # header情報から栄養素情報を取得しシートの列IDとDB (nutrients)のidとマッピング
      # どの列がどの栄養素と紐づいているか
      (6..66).map do |column_index|
        nutrients_name = sheet.cell(6, column_index)
        nutrients_name = ActionView::Base.full_sanitizer.sanitize(nutrients_name)
        nutrient = Nutrient.find_by!(name: nutrients_name)
        puts "#{column_index}, #{nutrient.name}"
        nutrient_id_by_column_index[column_index] = nutrient
        # 食材ごとに持っている栄養素nutrientの単位情報のbuild( xmg/100g)
        nutrients_unit_entity = NutrientsUnitEntity.parse_and_build(sheet.cell(8, column_index))
        units_by_column_index[column_index] = nutrients_unit_entity
      end

      # debug
      # (6..66).map do |column_index|
      #   data = sheet.cell(9, column_index)
      #   nutrient_name = nutrient_id_by_column_index[column_index]
      #   unit = units_by_column_index[column_index]
      #   puts "#{nutrient_name}, #{data}, #{unit.attributes.inspect}"
      # end

      # 食材(ingredients)のbuild
      ingredient_entities = (9..2199).map do |row_index|
        puts("row_index #{row_index}")
        original_name = sheet.cell('D', row_index)
        name, tags = IngredientNameParser.execute(original_name)
        # puts "#{name}, #{tags.inspect}"
        IngredientEntity.new(row_index: row_index, name: name, tags: tags, original_name: original_name)
      end
      # 食材(ingredients)を更新
      ingredient_entities = IngredientsNutrientsEntityGrouping.execute(ingredient_entities)
      ingredient_entities.each(&:update_name!)

      ingredient_group_names = ingredient_entities.map(&:group_name).uniq

      ActiveRecord::Base.transaction do
        # 食材( ingredients)と栄養素(nutrients)をmappingして保存(ingredient_nutrients)
        ingredient_entities.each.with_index do |ingredient_entity, i|
          (6..66).each do |column_index|
            puts(" #{i}, #{column_index}")
            # 何行目(どの食材),何列目(どの栄養素)
            content_quantity = sheet.cell(ingredient_entity.row_index, column_index)
            nutrients_unit_entity = units_by_column_index[column_index]
            nutrients_unit_entity.content_quantity = content_quantity
            # ingredient_entity, nutrients_unit_entity
            ingredient_nutrient = IngredientsNutrientsMapper.new(
              ingredient_entity: ingredient_entity,
              nutrients_unit_entity: nutrients_unit_entity,
              nutrient: nutrient_id_by_column_index[column_index]
            ).execute
            ingredient_nutrient.save
          end
        end
        # TODO
        # 1. ingredient_group_namesを保存(categoryが"group"のtagとして保存)
        #   -> tag = Tag.create(name: 'さんま')
        #   -> category = Category.create(name: 'group')
        #   -> tag_category.create(tag_id: tag.id, category.id)
        #   -> ingredient.tags << tag
        #
        # 2. 食材ingredientsを保存する（nameとremark)
      end
    end
  end
end
