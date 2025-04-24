# frozen_string_literal: true

class IngredientTagSerializer
  include JSONAPI::Serializer
  belongs_to :ingredient
  belongs_to :tag

end
