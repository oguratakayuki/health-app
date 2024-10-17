Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resource :ingredients, only: [:index] do
        root to: "ingredients#index"
      end
    end
  end
  # devise_for :users
  # namespace :api do
  #   mount_devise_token_auth_for 'User', at: 'auth'
  # end
end
