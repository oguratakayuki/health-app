module IngredientsNutrientsImportService
  class IngredientEntity

    include ActiveModel::Model
    include ActiveModel::Attributes
    attribute :row_index, :integer
    attribute :group_name, :string
    attribute :name, :string
    attribute :original_name, :string
    attribute :tags
    def update_name!
      if group_name
        self.name = self.name + tags_for_name.join(' ')
      end
    end
    def tags_for_name
      tags.reject {|tag| !tag.match('.*類') }
    end

  end

end

