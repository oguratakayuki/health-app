class CreateNutrientsIntakeStandards < ActiveRecord::Migration[6.1]
  def change
    create_table :nutrients_intake_standards do |t|
      t.integer :nutrients_id
      t.integer :content
      t.integer :unit
      t.integer :age
      t.integer :gender
      t.integer :month

      t.timestamps
    end
  end
end
