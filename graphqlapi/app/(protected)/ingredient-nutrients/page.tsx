"use client";

import { useQuery, gql } from "@apollo/client";
import { INGREDIENT_NUTRIENTS_QUERY } from "@/frontend/graphql/queries/ingredient_nutrients";
import { Utensils, Scale } from "lucide-react";

export default function IngredientNutrientTable() {
  const { data, loading, error } = useQuery(INGREDIENT_NUTRIENTS_QUERY, {
    variables: { limit: 30 },
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">読み込み中...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-4 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
        エラー: {error.message}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4">
      {/* ヘッダー */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Utensils className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            栄養成分一覧
          </h1>
        </div>
        <p className="text-gray-600">
          食材別の栄養成分データベース（{data?.ingredientNutrients?.length || 0}
          件表示）
        </p>
      </div>

      {/* データテーブル */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  食材名
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  栄養素名
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  含有量
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  単位基準
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.ingredientNutrients?.map((item: any) => {
                const amountText = `${item.contentUnitPer || ""}${
                  item.contentUnitPerUnit || ""
                }あたり ${item.contentQuantity || ""}${item.contentUnit || ""}`;
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* 食材名 */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Utensils className="w-5 h-5 text-blue-500 mr-2" />
                        <span className="font-medium text-gray-900">
                          {item.ingredient?.name || "データなし"}
                        </span>
                      </div>
                    </td>
                    {/* 栄養素名 */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 border border-purple-200">
                        {item.nutrient?.name || "データなし"}
                      </span>
                    </td>
                    {/* 含有量 */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Scale className="w-5 h-5 text-gray-400 mr-2" />
                        <span className="text-gray-900">
                          {item.contentQuantity || "0"} {item.contentUnit || ""}
                        </span>
                      </div>
                    </td>
                    {/* 単位基準 */}
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">
                        {amountText}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* フッター情報 */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          ※表示件数: {data?.ingredientNutrients?.length || 0}件（最大30件）
        </p>
      </div>
    </div>
  );
}
