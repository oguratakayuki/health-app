class CreateDishes < ActiveRecord::Migration[6.1]
  def change
    create_table :dishes do |t|
      t.string :name, nullable: false, comment: "料理名" 

      t.timestamps
    end
  end
end
