# frozen_string_literal: true

class RemoveMonthFromNutrientsIntakeStandard < ActiveRecord::Migration[6.1]
  def change
    remove_column :nutrients_intake_standards, :month, :integer
  end
end
