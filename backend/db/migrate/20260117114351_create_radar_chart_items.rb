class CreateRadarChartItems < ActiveRecord::Migration[6.1]
  def change
    create_table :radar_chart_items, comment: 'どのチャートにどの栄養素を表示するかを管理する中間テーブル' do |t|
      t.references :radar_chart, null: false, foreign_key: true, comment: '関連するチャートID'
      t.references :nutrient, null: false, foreign_key: true, comment: '表示する栄養素ID'
      t.integer :position, default: 0, comment: 'チャート内での表示順（時計回り）'

      t.timestamps
    end
  end
end
