class AddCognitoSubToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :cognito_sub, :string, limit: 255, unique: true
  end
end
