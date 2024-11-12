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
  # PATCH /api/v1/ingredients/:id
  def update
    @ingredient = Ingredient.find(params[:id])

    if @ingredient.update(ingredient_params)
      render json: { message: "Ingredient updated successfully", ingredient: @ingredient }, status: :ok
    else
      render json: { error: "Failed to update ingredient", details: @ingredient.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def ingredient_params
    params.require(:ingredient).permit(:id, :name, :remarks, :original_name)
  end

end
