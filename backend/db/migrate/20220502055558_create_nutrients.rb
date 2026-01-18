# frozen_string_literal: true

class CreateNutrients < ActiveRecord::Migration[6.1]
  def change
    create_table :nutrients, comment: '栄養素マスタ(炭水化物,脂質など)'  do |t|
      t.string :name

      t.timestamps
    end
  end
end
