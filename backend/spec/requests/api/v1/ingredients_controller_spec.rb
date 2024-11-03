# frozen_string_literal: true
require 'rails_helper'

RSpec.describe Api::V1::IngredientsController, type: :request do
  describe "GET /api/v1/ingredients" do
    before do
      create :ingredient_nutrient
    end

    it "returns paginated ingredients with total_pages" do
      # ページパラメータを設定
      get "/api/v1/ingredients", params: { page: 1 }

      # JSONレスポンスを解析
      json = JSON.parse(response.body)
      # expect(response["data"][0]["id"].to_i).to eq(campaign_first.id)
      # json['data'][0]['attributes']['name']
      # json['meta']['total_pages'] == 2
      # json['data'][0]['relationships']['nutrients']['data']
      expect(json['data'][0]['relationships']['nutrients']['data'][0]['type']).to eq "nutrient"

      # ステータスコードの確認
      expect(response).to have_http_status(:ok)

      # ingredientsが配列であり、10件が返されていることを確認
      expect(json["ingredients"]).to be_an(Array)
      expect(json["ingredients"].size).to eq(10)

      # total_pagesが2であることを確認
      expect(json["total_pages"]).to eq(2)
    end

    it "returns the second page of ingredients" do
      # 2ページ目を取得
      get "/api/v1/ingredients", params: { page: 2 }
      
      json = JSON.parse(response.body)

      # ステータスコードの確認
      expect(response).to have_http_status(:ok)

      # 2ページ目も10件が返されることを確認
      expect(json["ingredients"].size).to eq(10)

      # total_pagesが2であることを確認
      expect(json["total_pages"]).to eq(2)
    end
  end
end
