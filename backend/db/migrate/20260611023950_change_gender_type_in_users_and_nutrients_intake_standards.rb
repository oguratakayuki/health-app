class ChangeGenderTypeInUsersAndNutrientsIntakeStandards < ActiveRecord::Migration[6.1]
  def up
    # users テーブルの変更
    # PostgreSQLの場合は `using: 'gender::varchar'` が必要です（MySQL等の場合は省略可）
    change_column :users, :gender, :string, using: 'gender::varchar'

    # nutrients_intake_standards テーブルの変更
    change_column :nutrients_intake_standards, :gender, :string, using: 'gender::varchar'
  end

  def down
    # ロールバック（元に戻す）時の処理：string から integer に戻す
    change_column :users, :gender, :integer, using: 'gender::integer'
    change_column :nutrients_intake_standards, :gender, :integer, using: 'gender::integer'
  end
end
