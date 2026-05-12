"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

import {
  Activity,
  AlertCircle,
  Target,
  PieChart,
  Apple,
  Calendar,
} from "lucide-react";

import { DAILY_NUTRITION_QUERY } from "@/frontend/graphql/queries/daily_nutrition";

export default function DailyNutritionPage() {
  // 日付状態
  const [selectedDate, setSelectedDate] = useState("2026-01-17");

  const { data, loading, error } = useQuery(DAILY_NUTRITION_QUERY, {
    variables: {
      date: selectedDate,
    },
  });

  const dailyNutrition = data?.dailyNutrition;

  const radarData = useMemo(() => {
    if (!dailyNutrition?.comparisons) return [];

    return dailyNutrition.comparisons
      .filter((item: any) => item.percentage !== null)
      .map((item: any) => ({
        nutrient: formatNutrientLabel(item.nutrientCode),
        percentage: Math.round(item.percentage),
      }));
  }, [dailyNutrition]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <Activity className="w-10 h-10 text-green-500 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">栄養データを読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center gap-3 text-red-700">
            <AlertCircle className="w-6 h-6" />

            <div>
              <h2 className="font-bold">データ取得エラー</h2>
              <p className="text-sm">{error.message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!dailyNutrition) {
    return (
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <Apple className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600">データが存在しません。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4">
      {/* ヘッダー */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-green-100 p-2 rounded-lg">
            <PieChart className="w-8 h-8 text-green-600" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">1日の栄養分析</h1>

            <p className="text-gray-600">栄養摂取量と推奨量の比較</p>
          </div>
        </div>

        {/* 日付選択UI */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-gray-600" />

            <h2 className="font-medium text-gray-900">分析日</h2>
          </div>

          <div className="max-w-sm">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white"
            />
          </div>

          <p className="text-xs text-gray-500 mt-2">
            指定日の栄養摂取データを分析します
          </p>
        </div>
      </div>

      {/* PFC */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <PfcCard title="タンパク質" value={dailyNutrition.pfc.protein} />

        <PfcCard title="脂質" value={dailyNutrition.pfc.fat} />

        <PfcCard title="炭水化物" value={dailyNutrition.pfc.carbohydrate} />
      </div>

      {/* レーダーチャート */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-6 h-6 text-green-600" />

          <h2 className="text-xl font-bold text-gray-900">
            栄養達成率レーダーチャート
          </h2>
        </div>

        <div className="w-full h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid />

              <PolarAngleAxis dataKey="nutrient" />

              <PolarRadiusAxis angle={90} domain={[0, 150]} />

              <Radar
                name="達成率"
                dataKey="percentage"
                stroke="#16a34a"
                fill="#22c55e"
                fillOpacity={0.5}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 比較一覧 */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">栄養比較一覧</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-green-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  栄養素
                </th>

                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  摂取量
                </th>

                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  目標量
                </th>

                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  達成率
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {dailyNutrition.comparisons.map((item: any) => (
                <tr key={item.nutrientCode} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {formatNutrientLabel(item.nutrientCode)}
                  </td>

                  <td className="px-6 py-4">{item.intake ?? "-"}</td>

                  <td className="px-6 py-4">{item.target}</td>

                  <td className="px-6 py-4">
                    {item.percentage !== null
                      ? `${Math.round(item.percentage)}%`
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PfcCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-gray-500 text-sm mb-2">{title}</h3>

      <div className="text-3xl font-bold text-green-600">
        {value.toFixed(1)}%
      </div>
    </div>
  );
}

function formatNutrientLabel(code: string): string {
  const map: Record<string, string> = {
    energy_kcal: "エネルギー",
    protein_g: "タンパク質",
    fat_g: "脂質",
    carbohydrate_g: "炭水化物",
    fiber_g: "食物繊維",
    vitamin_a_ug: "ビタミンA",
    vitamin_c_mg: "ビタミンC",
    vitamin_d_ug: "ビタミンD",
    calcium_mg: "カルシウム",
    iron_mg: "鉄",
    zinc_mg: "亜鉛",
    potassium_mg: "カリウム",
  };

  return map[code] ?? code;
}
