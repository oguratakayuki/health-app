# frozen_string_literal: true

class TagCategorySerializer
  include JSONAPI::Serializer
  belongs_to :tag, serializer: TagSerializer
  belongs_to :category, serializer: CategorySerializer
end
