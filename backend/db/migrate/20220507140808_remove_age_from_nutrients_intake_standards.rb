# frozen_string_literal: true

class RemoveAgeFromNutrientsIntakeStandards < ActiveRecord::Migration[6.1]
  def change
    remove_column :nutrients_intake_standards, :age, :integer
  end
end
