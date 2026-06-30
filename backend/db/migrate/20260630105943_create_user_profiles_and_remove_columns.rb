class CreateUserProfilesAndRemoveColumns < ActiveRecord::Migration[6.1]

  def change
    # user_profilesテーブルを作成
    create_table :user_profiles do |t|
      t.references :user, null: false, foreign_key: true, comment: "ユーザーID"
      t.string :gender, comment: "性別"
      t.decimal :height, precision: 4, scale: 1, null: false, comment: "身長(cm)"
      t.date :birthday, null: false, comment: "生年月日"
      t.timestamps
    end
    # 既存のカラムを削除
    remove_column :users, :age
    remove_column :users, :gender
    remove_column :users, :height
    remove_column :users, :birthday
  end

end
