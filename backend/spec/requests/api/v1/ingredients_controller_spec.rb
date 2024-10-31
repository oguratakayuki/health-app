# frozen_string_literal: true
# spec/requests/api/v1/ingredients_controller_spec.rb
require 'rails_helper'

RSpec.describe Api::V1::IngredientsController, type: :request do
  describe "GET /api/v1/ingredients" do
    before do
      # テスト用のデータを20個作成
      create_list(:ingredient, 20)
    end

    it "returns paginated ingredients with total_pages" do
      # ページパラメータを設定
      get "/api/v1/ingredients", params: { page: 1 }

      # JSONレスポンスを解析
      json = JSON.parse(response.body)

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

 
