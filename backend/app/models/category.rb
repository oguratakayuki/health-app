class Category < ApplicationRecord
  has_many :tag_categories
  has_many :tags, through: tag_categories
end
