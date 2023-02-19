module IngredientsNutrientsImportService
  class Importer

    include ActiveModel::Model
    include ActiveModel::Attributes
      attribute :path, :string

    def execute
      xlsx = Roo::Excelx.new(path)
      #puts xlsx.sheet('main').row(3)
      sheet = xlsx.sheet('main')
      ingredient_entities = (9..2199).map do |row_index|
        name = sheet.cell('D',row)
        name, tags = IngredientNameParser.execute(name)
        IngredientEntity.new(row_index: row_index, name: main, tags: tags)
      end
      ingredient_entities = IngredientsNutrientsEntityGrouping.execute(ingredient_entities)
      ingredient_entities.each {|entity| entity.update_name! }
      # TODO 
      # - 名前以外の要素を取ってくる
      # - entityからActiveModelに変換するmapperを作る
      # - builderクラスなど作る？
    end
  end
end
