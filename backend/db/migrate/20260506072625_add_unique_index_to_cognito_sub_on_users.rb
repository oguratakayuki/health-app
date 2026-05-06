class AddUniqueIndexToCognitoSubOnUsers < ActiveRecord::Migration[6.1]
  def change
    add_index :users, :cognito_sub, unique: true, name: 'index_users_on_cognito_sub'
  end
end
