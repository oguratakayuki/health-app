class Meal < ApplicationRecord
  belongs_to :user
  has_many :meal_ingredients, dependent: :destroy
  has_many :ingredients, through: :meal_ingredients

  validates :meal_date, presence: true
  validates :category, presence: true
  validates :user_id, presence: true

  enum category: { breakfast: '朝食', lunch: '昼食', dinner: '夕食', snack: '間食' }
end
