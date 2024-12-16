# frozen_string_literal: true

class TagSerializer
  include JSONAPI::Serializer
  has_many :tag_categories, serializer: TagCategorySerializer
  has_many :categories, through: :tag_categories, serializer: CategorySerializer

  attributes :name
end
