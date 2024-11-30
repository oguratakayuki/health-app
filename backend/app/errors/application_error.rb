# frozen_string_literal: true

module ApplicationError
  class InvalidNutrientsAgeRangeError < StandardError
    def initialize(unit)
      msg = %(#{unit}は有効な年齢範囲ではありません)
      super(msg)
    end
  end
end
