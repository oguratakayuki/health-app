# frozen_string_literal: true

module Api
  module V1
    class TagsController < ApplicationController
      def index
        @tags = Tag.page(params[:page]).per(10)

        render json: TagSerializer.new(
          @tags,
          {
            include: %i[tag_categories categories],
            meta: { total_pages: @tags.total_pages }
          }
        ).serializable_hash.to_json

      end

      # PATCH /api/v1/tags/:id
      def update
      end

      # POST /api/v1/tags
      def create
      end

      private

      def tag_params
      end
    end
  end
end
