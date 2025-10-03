# frozen_string_literal: true

Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :ingredients, only: %i[index update create]
      resources :nutrients, only: [:index]
      resources :tags, only: [:index]
    end
  end
end
