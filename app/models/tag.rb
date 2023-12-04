class Tag < ApplicationRecord
  has_many :tag_categories
  has_many :categories, through: :tag_categories
end
