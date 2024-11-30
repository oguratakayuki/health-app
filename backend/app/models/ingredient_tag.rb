# frozen_string_literal: true

class IngredientTag < ApplicationRecord
  belongs_to :ingredient
  belongs_to :tag
end
