class CreateMeals < ActiveRecord::Migration[6.1]
  def change
    create_table :meals, comment: '食事履歴' do |t|
      t.references :user, null: false, foreign_key: true
      t.date :meal_date, null: false, comment: '食事した日付'
      t.string :category, null: false, comment: '食事分類 enum(朝食、昼食、晩飯)'
      t.time :start_time, comment: '食事の開始時刻'
      t.time :end_time, comment: '食事の終了時刻'

      t.timestamps
    end
  end
end
