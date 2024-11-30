# frozen_string_literal: true

class NutrientsIntakeStandard < ApplicationRecord
  enum unit: %i[g mg mgNE μgRAE μg kcal ％エネルギー]
  enum gender: %i[male female]
  belongs_to :nutrient
end
