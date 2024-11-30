# frozen_string_literal: true

class RenameNutrientsIdFromNutrientsIntakeStandard < ActiveRecord::Migration[6.1]
  def change
    change_table :nutrients_intake_standards do |t|
      t.rename :nutrients_id, :nutrient_id
    end
  end
end
