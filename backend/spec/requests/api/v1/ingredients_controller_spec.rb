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
    let!(:ingredient) { create(:ingredient, name: "Original Name", remarks: "Original Remarks", original_name: "Original Ingredient Name") }
    let!(:nutrient) { create :nutrient }
    let!(:ingredient_nutrient1) do
      create(:ingredient_nutrient,
             ingredient: ingredient, nutrient: nutrient, content_quantity: 50,
             content_unit: "mg", content_unit_per: 1, content_unit_per_unit: "tablet"
            )
    end
    let!(:ingredient_nutrient2) do
      create(:ingredient_nutrient,
             ingredient: ingredient, nutrient: nutrient, content_quantity: 30,
             content_unit: "g", content_unit_per: 2, content_unit_per_unit: "piece")
    end

    context "正常系" do
      let(:valid_attributes) do
        {
          ingredient: {
            name: "Updated Name",
            remarks: "Updated Remarks",
            original_name: "Updated Original Name",
            ingredient_nutrients_attributes: [
              {
                id: ingredient_nutrient1.id,
                content_quantity: 100,
                content_unit: "mg",
                content_unit_per: 1,
                content_unit_per_unit: "capsule"
              },
              {
                id: ingredient_nutrient2.id,
                content_quantity: 200,
                content_unit: "g",
                content_unit_per: 3,
                content_unit_per_unit: "tablet"
              }
            ]
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

        # 更新されたingredient_nutrientsを確認
        updated_nutrient1 = ingredient.ingredient_nutrients.find(ingredient_nutrient1.id)
        expect(updated_nutrient1.content_quantity).to eq(100)
        expect(updated_nutrient1.content_unit).to eq("mg")
        expect(updated_nutrient1.content_unit_per).to eq(1)
        expect(updated_nutrient1.content_unit_per_unit).to eq("capsule")

        updated_nutrient2 = ingredient.ingredient_nutrients.find(ingredient_nutrient2.id)
        expect(updated_nutrient2.content_quantity).to eq(200)
        expect(updated_nutrient2.content_unit).to eq("g")
        expect(updated_nutrient2.content_unit_per).to eq(3)
        expect(updated_nutrient2.content_unit_per_unit).to eq("tablet")
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
