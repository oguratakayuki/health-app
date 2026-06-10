class AddStartTimeAndEndTimeToMeals < ActiveRecord::Migration[6.1]
  def change
    change_column_default :meals, :start_time, from: nil, to: "12:00:00"
    change_column_default :meals, :end_time, from: nil, to: "13:00:00"

    change_column_null :meals, :start_time, false
    change_column_null :meals, :end_time, false
  end
end
