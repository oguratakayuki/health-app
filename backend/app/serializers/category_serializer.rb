# frozen_string_literal: true

class CategorySerializer
  include JSONAPI::Serializer

  has_many :tag_categories, serializer: TagCategorySerializer 
  has_many :tags, through: :tag_categories, serializer: TagSerializer
  
  attributes :name, :display_name
end
