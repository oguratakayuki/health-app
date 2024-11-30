# frozen_string_literal: true

Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :ingredients, only: %i[index update create]
      resources :nutrients, only: [:index]
    end
  end
  # devise_for :users
  # namespace :api do
  #   mount_devise_token_auth_for 'User', at: 'auth'
  # end
end
