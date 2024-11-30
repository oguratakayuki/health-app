# frozen_string_literal: true

class TagCategory < ApplicationRecord
  belongs_to :tag
  belongs_to :category
end
