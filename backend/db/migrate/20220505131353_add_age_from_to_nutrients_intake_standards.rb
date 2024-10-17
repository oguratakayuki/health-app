class AddAgeFromToNutrientsIntakeStandards < ActiveRecord::Migration[6.1]
  def change
    add_column :nutrients_intake_standards, :age_from, :decimal
  end
end
