class CreateMeals < ActiveRecord::Migration[6.1]
  def change
    create_table :meals do |t|
      t.references :user, null: false, foreign_key: true
      t.date :meal_date, null: false
      t.string :category, null: false
      t.time :start_time
      t.time :end_time

      t.timestamps
    end
  end
end
