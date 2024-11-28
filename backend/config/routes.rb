Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :ingredients, only: [:index, :update, :create]
      resources :nutrients, only: [:index]
    end
  end
  # devise_for :users
  # namespace :api do
  #   mount_devise_token_auth_for 'User', at: 'auth'
  # end
end
