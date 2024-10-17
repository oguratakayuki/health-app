class AddAgeToToNutrientsIntakeStandards < ActiveRecord::Migration[6.1]
  def change
    add_column :nutrients_intake_standards, :age_to, :decimal
  end
end
