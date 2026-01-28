class ChangeUnitTypeOnNutrientsIntakeStandards < ActiveRecord::Migration[6.1]
  def change
    remove_column :nutrients_intake_standards, :unit, :integer
    add_column :nutrients_intake_standards, :unit, :string, null: false
  end
end
