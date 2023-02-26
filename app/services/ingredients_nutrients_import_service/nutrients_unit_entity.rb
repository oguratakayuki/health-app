module IngredientsNutrientsImportService
  class NutrientsUnitEntity

    include ActiveModel::Model
    include ActiveModel::Attributes
    attribute :content_quantity, :float #100gあたり30mg -> 30
    attribute :content_unit, :string #100gあたり30mg -> mg
    attribute :content_unit_per, :float #100gあたり30mg  ->  100
    attribute :content_unit_per_unit, :string # 100gあたり30mg  ->   g

    def self.parse_and_build(data)
      content_unit, content_unit_per_unit = data.split('/')
      content_unit_per, content_unit_per_unit = content_unit_per_unit.split(' ')
      entity = self.new
      entity.content_unit = content_unit
      entity.content_unit_per = content_unit_per
      entity.content_unit_per_unit = content_unit_per_unit
      entity
      #1.0, mg/100 g
    end
  end
end
#ingredients_id どの食品
#nutrient_id どの栄養
