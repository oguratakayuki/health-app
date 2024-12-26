# frozen_string_literal: true

module Api
  module V1
    class IngredientsController < ApplicationController
      def index
        # TODO
        # tag をtag_categoriesを使って分類する
        # -> tag管理画面の実装
        @ingredients = Ingredient.includes(:nutrients, :ingredient_nutrients, :tags)
                                 .where.not(ingredient_nutrients: { content_quantity: 0 })

        @ingredients = @ingredients.where(id: params[:ingredient_ids]) if params[:ingredient_ids]

        @ingredients = @ingredients.where(tags: { id: params[:tag_ids] }) if params[:tag_ids]

        @ingredients = @ingredients.page(params[:page]).per(10)

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
          render json: { message: 'Ingredient updated successfully', ingredient: @ingredient }, status: :ok
        else
          render json: { error: 'Failed to update ingredient', details: @ingredient.errors.full_messages },
                 status: :unprocessable_entity
        end
      end

      # POST /api/v1/ingredients
      def create
        @ingredient = Ingredient.new(ingredient_params)

        if @ingredient.save
          render json: { message: 'Ingredient created successfully', ingredient: @ingredient }, status: :created
        else
          Rails.logger.error("Validation errors: #{@ingredient.errors.full_messages}")
          render json: {
            error: 'Failed to create ingredient',
            details: @ingredient.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      private

      def ingredient_params
        params.require(:ingredient).permit(
          :id, :name, :remarks, :original_name,
          ingredient_nutrients_attributes: %i[
            id ingredient_id nutrient_id content_quantity
            content_unit content_unit_per content_unit_per_unit _destroy
          ]
        )
      end
    end
  end
end
