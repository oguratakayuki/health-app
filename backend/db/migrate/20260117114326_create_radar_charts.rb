class CreateRadarCharts < ActiveRecord::Migration[6.1]
  def change
    create_table :radar_charts, comment: 'レーダーチャートの定義（器）を管理するテーブル' do |t|
      t.string :name, null: false, comment: 'チャートの表示名（例：ビタミンバランス）'
      t.string :slug, null: false, comment: 'プログラムから参照するための識別子（例：vitamins）'
      t.integer :display_order, default: 0, comment: 'アプリ内での表示順'

      t.timestamps
    end
    add_index :radar_charts, :slug, unique: true
  end
end
