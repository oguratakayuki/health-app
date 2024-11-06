# frozen_string_literal: true
require 'rails_helper'

RSpec.describe Api::V1::IngredientsController, type: :request do
  describe "GET /api/v1/ingredients" do
    before do
      create_list :ingredient_nutrient, 20
    end

    it "returns paginated ingredients with total_pages" do
      # ページパラメータを設定
      get "/api/v1/ingredients", params: { page: 1 }

      json = JSON.parse(response.body)
      expect(json['data'][0]['relationships']['nutrients']['data'][0]['type']).to eq "nutrient"
      expect(response).to have_http_status(:ok)
      expect(json["data"]).to be_an(Array)
      expect(json["data"].size).to eq(10)
      expect(json['meta']['total_pages']).to eq(2)
    end

    it "returns the second page of ingredients" do
      # 2ページ目を取得
      get "/api/v1/ingredients", params: { page: 2 }
      
      json = JSON.parse(response.body)
      expect(json['data'][0]['relationships']['nutrients']['data'][0]['type']).to eq "nutrient"
      expect(response).to have_http_status(:ok)
      expect(json["data"]).to be_an(Array)
      expect(json["data"].size).to eq(10)
      expect(json['meta']['total_pages']).to eq(2)
    end
  end

  describe "PATCH /api/v1/ingredients/:id" do
    let!(:ingredient) do
      create(:ingredient, name: "Original Name", remarks: "Original Remarks", original_name: "Original Ingredient Name")
    end
    context "正常系" do
      let(:valid_attributes) do
        {
          ingredient: {
            name: "Updated Name",
            remarks: "Updated Remarks",
            original_name: "Updated Original Name"
          }
        }
      end

      it "対象が更新されること" do
        patch "/api/v1/ingredients/#{ingredient.id}", params: valid_attributes
        json = JSON.parse(response.body)
        expect(response).to have_http_status(:ok)
        expect(json["message"]).to eq("Ingredient updated successfully")
        expect(json["ingredient"]["name"]).to eq("Updated Name")
        expect(json["ingredient"]["remarks"]).to eq("Updated Remarks")
        expect(json["ingredient"]["original_name"]).to eq("Updated Original Name")
      end
    end

    context "異常系" do
      let(:invalid_attributes) do
        {
          ingredient: {
            name: "",
            remarks: "Updated Remarks",
            original_name: "Updated Original Name"
          }
        }
      end

      it "対象が更新されずエラーメッセージが返ること" do
        patch "/api/v1/ingredients/#{ingredient.id}", params: invalid_attributes
        json = JSON.parse(response.body)
        expect(response).to have_http_status(:unprocessable_entity)
        expect(json["error"]).to eq("Failed to update ingredient")
        expect(json["details"]).to include("Name can't be blank")
      end
    end
  end

end
