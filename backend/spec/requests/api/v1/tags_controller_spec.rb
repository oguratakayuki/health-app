# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::V1::TagsController, type: :request do
  describe 'GET /api/v1/tags' do
    before do
      create_list :tag_category, 19
    end

    it 'returns paginated tags with total_pages' do
      # ページパラメータを設定
      get '/api/v1/tags', params: { page: 1 }

      json = JSON.parse(response.body)
      expect(json['data'][0].keys).to eq ["id", "type", "attributes", "relationships"]
      expect(json['data'][0]['relationships'].keys).to eq ["tag_categories", "categories"]
      expect(response).to have_http_status(:ok)
      expect(json['data']).to be_an(Array)
      expect(json['data'].size).to eq(10)
      expect(json['meta']['total_pages']).to eq(2)
    end

    it 'returns the second page of tags' do
      # 2ページ目を取得
      get '/api/v1/tags', params: { page: 2 }

      json = JSON.parse(response.body)
      expect(response).to have_http_status(:ok)
      expect(json['data']).to be_an(Array)
      expect(json['data'].size).to eq(9)
      expect(json['meta']['total_pages']).to eq(2)
    end
  end

end
