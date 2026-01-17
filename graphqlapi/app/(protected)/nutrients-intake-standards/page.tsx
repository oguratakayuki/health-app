"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client";
import { NUTRIENTS_INTAKE_STANDARDS_WITH_FILTERS_QUERY } from "@/frontend/graphql/queries/nutrients_intake_standards";
import { Target, Scale, User, Calendar, Filter } from "lucide-react";

export default function NutrientsIntakeStandardsPage() {
  // フィルター状態
  const [filters, setFilters] = useState({
    gender: "",
    age: "",
  });

  // GraphQLクエリに渡す変数
  const queryVariables = {
    gender: filters.gender || undefined,
    age: filters.age ? parseInt(filters.age) : undefined,
  };

  const { data, loading, error, refetch } = useQuery(
    NUTRIENTS_INTAKE_STANDARDS_WITH_FILTERS_QUERY,
    {
      variables: queryVariables,
      fetchPolicy: "network-only",
    },
  );
  console.log(data);

  // フィルター変更ハンドラー
  const handleFilterChange = (key: string, value: string) => {
    const newFilters = {
      ...filters,
      [key]: value,
    };
    setFilters(newFilters);

    // サーバーサイドでフィルタリングを実行
    const variables: any = {};
    if (newFilters.gender) variables.gender = newFilters.gender;
    if (newFilters.age) variables.age = parseInt(newFilters.age);

    refetch(variables);
  };

  // フィルターをリセット
  const resetFilters = () => {
    setFilters({
      gender: "",
      age: "",
    });
    refetch({ gender: undefined, age: undefined });
  };

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

  // フィルターが適用されているか確認
  const hasActiveFilters = filters.gender !== "" || filters.age !== "";

  return (
    <div className="max-w-7xl mx-auto py-6 px-4">
      {/* ヘッダー */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-green-100 p-2 rounded-lg">
            <Target className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            栄養摂取基準一覧
          </h1>
        </div>
        <p className="text-gray-600 mb-6">
          性別・年齢別の栄養摂取基準データベース（
          {data?.nutrientsIntakeStandardsWithFilters?.length || 0}件表示）
        </p>

        {/* フィルターセクション */}
        <div className="bg-gray-50 rounded-lg p-4 mb-2">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="font-medium text-gray-900">
              サーバーサイド絞り込み
            </h2>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="ml-auto text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                フィルターをリセット
              </button>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            {/* 性別フィルター */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                性別
              </label>
              <select
                value={filters.gender}
                onChange={(e) => handleFilterChange("gender", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white"
              >
                <option value="">すべての性別</option>
                <option value="male">男性</option>
                <option value="female">女性</option>
              </select>
            </div>

            {/* 年齢フィルター */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                年齢（歳）
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={filters.age}
                  onChange={(e) => handleFilterChange("age", e.target.value)}
                  placeholder="例: 30"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                />
                {filters.age && (
                  <button
                    onClick={() => handleFilterChange("age", "")}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                該当年齢を含む基準を表示します
              </p>
            </div>
          </div>

          {/* フィルター適用中表示 */}
          {hasActiveFilters && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-green-800">
                <Filter className="w-4 h-4" />
                <span className="font-medium">フィルター適用中:</span>
                <div className="flex gap-3">
                  {filters.gender && (
                    <span className="bg-white px-2 py-1 rounded text-green-700 border border-green-300">
                      性別: {filters.gender === "male" ? "男性" : "女性"}
                    </span>
                  )}
                  {filters.age && (
                    <span className="bg-white px-2 py-1 rounded text-green-700 border border-green-300">
                      年齢: {filters.age}歳
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
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
              {data?.nutrientsIntakeStandardsWithFilters?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      該当する基準がありません
                    </h3>
                    <p className="text-gray-600">
                      {hasActiveFilters
                        ? "絞り込み条件を変更するか、フィルターをリセットしてください。"
                        : "栄養摂取基準が登録されていません。"}
                    </p>
                    {hasActiveFilters && (
                      <button
                        onClick={resetFilters}
                        className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                      >
                        フィルターをリセット
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                data?.nutrientsIntakeStandardsWithFilters?.map(
                  (standard: any) => {
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
                                standard.gender === "male"
                                  ? "bg-blue-100 text-blue-800 border border-blue-200"
                                  : standard.gender === "female"
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
                  },
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* フッター情報 */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          ※表示件数: {data?.nutrientsIntakeStandardsWithFilters?.length || 0}件
          {hasActiveFilters && " ※サーバーサイドフィルター適用中"}
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
