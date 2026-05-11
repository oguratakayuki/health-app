class ChangeColumnsNotNullToNutrientsIntakeStandards < ActiveRecord::Migration[6.1]
  def change
    change_column_null :nutrients_intake_standards, :nutrient_id, false
    change_column_null :nutrients_intake_standards, :content, false
    change_column_null :nutrients_intake_standards, :gender, false
    change_column_null :nutrients_intake_standards, :age_from, false
    change_column_null :nutrients_intake_standards, :age_to, false
  end
end
