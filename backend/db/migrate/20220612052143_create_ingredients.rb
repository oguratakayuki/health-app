# frozen_string_literal: true

class CreateIngredients < ActiveRecord::Migration[6.1]
  def change
    create_table :ingredients, comment: '食材マスター(ジャガイモなど)' do |t|
      t.string :name
      t.text   :remarks, comment: '備考'

      t.timestamps
    end
  end
end
