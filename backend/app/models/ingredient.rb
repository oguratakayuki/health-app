class Ingredient < ApplicationRecord
  has_many :ingredient_tags
  has_many :tags, through: :ingredient_tags
  has_many :ingredient_nutrients
  has_many :nutrients, through: :ingredient_nutrients

  validates :name, presence: true
  accepts_nested_attributes_for :ingredient_nutrients, allow_destroy: true
end
