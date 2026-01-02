# frozen_string_literal: true

class Nutrient < ApplicationRecord
  validates :name, uniqueness: true
  has_many :nutrients_intake_standards, dependent: :destroy
  has_many :parent_relation, class_name: 'NutrientsRelation', foreign_key: 'child_id', primary_key: 'id'
  has_many :child_relation, class_name: 'NutrientsRelation', foreign_key: 'parent_id', primary_key: 'id'
  has_many :childs, through: :child_relation
  has_many :parent, through: :parent_relation

  before_validation :remove_all_spaces

  private

  def remove_all_spaces
    # name が存在する場合のみ、すべての空白を消去
    self.name = name.gsub(/\s+/, "") if name.present?
  end

end
