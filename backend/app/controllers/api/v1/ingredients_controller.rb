class Api::V1::IngredientsController < ApplicationController
  def index
    @ingredients = Ingredient.includes(:nutrients, :ingredient_nutrients)
       .where.not(ingredient_nutrients: {content_quantity: 0})
       .page(params[:page]).per(10)

    render json: IngredientSerializer.new(
      @ingredients,
      {
        include: %i[nutrients ingredient_nutrients],
        meta: { total_pages: @ingredients.total_pages } 
      }
    ).serializable_hash.to_json
  end
end
