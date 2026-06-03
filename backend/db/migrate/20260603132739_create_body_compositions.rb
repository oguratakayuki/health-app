class CreateBodyCompositions < ActiveRecord::Migration[6.1]
  def change
    create_table :body_compositions, comment: 'ユーザーの体重・体組成の計測履歴データ' do |t|
      t.references :user, null: false, foreign_key: true, comment: 'ユーザーID'

      # 体重と体組成データ（小数点を含むデータはdecimal型を採用）
      t.decimal :weight, precision: 4, scale: 1, null: false, comment: '体重 (kg)'
      t.decimal :bmi, precision: 3, scale: 1, null: false, comment: 'BMI（体格指数）'
      t.decimal :body_fat_percentage, precision: 3, scale: 1, null: false, comment: '体脂肪率 (%)'
      t.decimal :body_fat_mass, precision: 3, scale: 1, null: false, comment: '体脂肪量 (kg)'
      t.decimal :skeletal_muscle_percentage, precision: 3, scale: 1, null: false, comment: '骨格筋率 (%)'
      t.decimal :skeletal_muscle_mass, precision: 3, scale: 1, null: false, comment: '骨格筋量 (kg)'
      t.decimal :subcutaneous_fat_percentage, precision: 3, scale: 1, null: false, comment: '皮下脂肪率 (%)'
      t.decimal :ffmi, precision: 3, scale: 1, null: false, comment: 'FFMI（除脂肪量指数）'
      t.decimal :bone_mass, precision: 3, scale: 2, null: false, comment: '骨量 (kg)'

      # 整数値で管理するデータ（integer型を採用）
      t.integer :visceral_fat_level, null: false, comment: '内臓脂肪レベル'
      t.integer :basal_metabolism, null: false, comment: '基礎代謝量 (kcal)'

      # 計測日時（過去に遡って入力できるよう明示的なカラムを作成）
      t.datetime :measured_at, null: false, comment: '計測日時'

      t.timestamps

      t.index [:user_id, :measured_at], name: 'index_body_compositions_on_user_id_and_measured_at'
    end
  end
end
