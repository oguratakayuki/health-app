# frozen_string_literal: true

class NutrientsIntakeStandard < ApplicationRecord
  enum unit: {
    g: "g",
    mg: "mg",
    mg_ne: "mgNE",
    ug_rae: "μgRAE",
    ug: "μg",
    kcal: "kcal",
    energy_percent: "energy_percent" # "％エネルギー"
  }
  enum gender: %i[male female]
  belongs_to :nutrient
end
