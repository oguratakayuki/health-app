class NutrientsRelation < ApplicationRecord
  belongs_to :child ,class_name: 'Nutrient',foreign_key: 'child_id'
  belongs_to :parent ,class_name: 'Nutrient',foreign_key: 'parent_id'
end
