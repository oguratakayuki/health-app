class Nutrient < ApplicationRecord
  validates :name, uniqueness: true
  has_many :nutrients_intake_standards, dependent: :destroy
end
