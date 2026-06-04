class AddHeightAndBirthdayToUsers < ActiveRecord::Migration[6.1]
  def change
    # height は小数点第1桁（例: 175.5）まで管理できるように decimal 型を採用
    add_column :users, :height, :decimal, precision: 4, scale: 1, null: true, comment: '身長 (cm)'

    # birthday は日付のみを管理するため date 型を採用
    add_column :users, :birthday, :date, null: true, comment: '誕生日'
  end
end
