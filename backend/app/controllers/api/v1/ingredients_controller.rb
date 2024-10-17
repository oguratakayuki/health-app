class Api::V1::IngredientsController < ApplicationController
  def index
    @ingredients = Ingredient.page(params[:page]).per(10)
    render json: {
      ingredients: @ingredients,
      total_pages: @ingredients.total_pages
    }
  end
end
