"use client";

import { useQuery } from "@apollo/client";
import { NUTRIENTS_INTAKE_STANDARDS_QUERY } from "@/frontend/graphql/queries/nutrients_intake_standards";
import { Target, Scale, User, Calendar } from "lucide-react";

export default function NutrientsIntakeStandardsPage() {
  const { data, loading, error } = useQuery(NUTRIENTS_INTAKE_STANDARDS_QUERY);

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

  // 性別を日本語に変換
  const getGenderText = (gender: string) => {
    switch (gender) {
      case "male":
        return "男性";
      case "female":
        return "女性";
      default:
        return "未設定";
    }
  };

  // 年齢範囲を表示用にフォーマット
  const getAgeRangeText = (ageFrom: number, ageTo: number) => {
    if (!ageFrom && !ageTo) return "全年代";
    if (ageFrom && !ageTo) return `${ageFrom}歳以上`;
    if (!ageFrom && ageTo) return `${ageTo}歳以下`;
    return `${ageFrom}〜${ageTo}歳`;
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4">
      {/* ヘッダー */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-green-100 p-2 rounded-lg">
            <Target className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            栄養摂取基準一覧
          </h1>
        </div>
        <p className="text-gray-600">
          性別・年齢別の栄養摂取基準データベース（
          {data?.nutrientsIntakeStandards?.length || 0}件表示）
        </p>
      </div>

      {/* データテーブル */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-green-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  栄養素名
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  摂取量
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  性別
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  年齢範囲
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  最終更新
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.nutrientsIntakeStandards?.map((standard: any) => {
                const ageRange = getAgeRangeText(
                  standard.ageFrom,
                  standard.ageTo,
                );
                const genderText = getGenderText(standard.gender);

                return (
                  <tr
                    key={standard.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* 栄養素名 */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Target className="w-5 h-5 text-green-500 mr-2" />
                        <div>
                          <span className="font-medium text-gray-900 block">
                            {standard.nutrient?.name || "未設定"}
                          </span>
                          <span className="text-xs text-gray-500">
                            ID: {standard.nutrient?.id || "N/A"}
                          </span>
                        </div>
                      </div>
                    </td>
                    {/* 摂取量 */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Scale className="w-5 h-5 text-gray-400 mr-2" />
                        <div>
                          <span className="text-gray-900 font-medium">
                            {standard.content || "0"}
                          </span>
                          <span className="text-sm text-gray-500 ml-1">
                            {standard.unit}
                          </span>
                        </div>
                      </div>
                    </td>
                    {/* 性別 */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="w-5 h-5 text-blue-400 mr-2" />
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            standard.gender === 1
                              ? "bg-blue-100 text-blue-800 border border-blue-200"
                              : standard.gender === 2
                                ? "bg-pink-100 text-pink-800 border border-pink-200"
                                : "bg-gray-100 text-gray-800 border border-gray-200"
                          }`}
                        >
                          {genderText}
                        </span>
                      </div>
                    </td>
                    {/* 年齢範囲 */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 text-orange-400 mr-2" />
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 border border-orange-200">
                          {ageRange}
                        </span>
                      </div>
                    </td>
                    {/* 最終更新 */}
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">
                        {new Date(standard.updatedAt).toLocaleDateString(
                          "ja-JP",
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 空の状態表示 */}
      {(!data?.nutrientsIntakeStandards ||
        data.nutrientsIntakeStandards.length === 0) && (
        <div className="mt-6 p-8 text-center bg-gray-50 rounded-xl">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            栄養摂取基準が登録されていません
          </h3>
          <p className="text-gray-600">
            栄養摂取基準を登録すると、ここに表示されます。
          </p>
        </div>
      )}

      {/* フッター情報 */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          ※表示件数: {data?.nutrientsIntakeStandards?.length || 0}件
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-100 border border-blue-200"></div>
            <span>男性</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-pink-100 border border-pink-200"></div>
            <span>女性</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-gray-100 border border-gray-200"></div>
            <span>両方/未設定</span>
          </div>
        </div>
      </div>
    </div>
  );
}
