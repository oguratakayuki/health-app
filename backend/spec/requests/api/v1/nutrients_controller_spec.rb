require 'rails_helper'

RSpec.describe "Api::V1::NutrientsController", type: :request do
  describe "GET /api/v1/nutrients" do
    let!(:nutrients) { create_list(:nutrient, 3) } # テストデータを3件作成

    it "returns a successful response" do
      get "/api/v1/nutrients"

      expect(response).to have_http_status(:success) # HTTPステータス200を確認
    end

    it "returns all nutrients as JSON" do
      get "/api/v1/nutrients"

      json_response = JSON.parse(response.body)

      # レスポンスが期待したデータ件数を持つか確認
      expect(json_response.size).to eq(nutrients.size)

      # データ内容が一致しているか確認
      nutrients.each_with_index do |nutrient, index|
        expect(json_response[index]["id"]).to eq(nutrient.id)
        expect(json_response[index]["name"]).to eq(nutrient.name)
      end
    end
  end
end

