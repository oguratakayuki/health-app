# frozen_string_literal: true

module Api
  module V1
    class NutrientsController < ApplicationController
      def index
        @nutrients = Nutrient.all

        render json: @nutrients
      end
    end
  end
end
