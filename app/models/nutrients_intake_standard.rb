class NutrientsIntakeStandard < ApplicationRecord
  enum unit: [ :g, :mg, :mgNE, :μgRAE, :μg, :kcal, :％エネルギー]
  enum gender: [ :male, :female ]
  belongs_to :nutrient
end
