# frozen_string_literal: true

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
      return unless group_name

      self.name = name + tags_for_name.join(' ')
    end

    def tags_for_name
      tags.select { |tag| tag.match('.*類') }
    end
  end
end
