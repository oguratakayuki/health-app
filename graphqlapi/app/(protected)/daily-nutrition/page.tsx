"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useQuery } from "@apollo/client";

import { Calendar, Activity, AlertCircle, PieChart } from "lucide-react";

import { MONTHLY_NUTRITION_QUERY } from "@/frontend/graphql/queries/monthly_nutrition";

import MiniRadarChart from "../_components/daily-nutrition/MiniRadarChart";

export default function DailyNutritionMonthlyPage() {
  const router = useRouter();

  const [month, setMonth] = useState("2026-01");

  const from = `${month}-01`;

  const to = `${month}-31`;

  const { data, loading, error } = useQuery(MONTHLY_NUTRITION_QUERY, {
    variables: {
      from,
      to,
    },
  });

  const days = data?.monthlyNutrition?.days ?? [];

  const dayMap = useMemo(() => {
    const map = new Map();

    for (const day of days) {
      map.set(day.date, day);
    }

    return map;
  }, [days]);

  const dates = Array.from({ length: 31 }, (_, i) => {
    const day = String(i + 1).padStart(2, "0");

    return `${month}-${day}`;
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <Activity className="w-10 h-10 text-green-500 mx-auto mb-4 animate-pulse" />

          <p className="text-gray-600">月次データを読み込み中...</p>
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

  return (
    <div className="max-w-7xl mx-auto py-6 px-4">
      {/* header */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-green-100 p-2 rounded-lg">
            <PieChart className="w-8 h-8 text-green-600" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">月間栄養一覧</h1>

            <p className="text-gray-600">日別栄養バランス一覧</p>
          </div>
        </div>

        {/* month selector */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-gray-600" />

            <h2 className="font-medium text-gray-900">対象月</h2>
          </div>

          <div className="max-w-xs">
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white"
            />
          </div>
        </div>
      </div>

      {/* calendar */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {dates.map((date) => {
          const day = dayMap.get(date);

          return (
            <button
              key={date}
              onClick={() => router.push(`/daily-nutrition/${date}`)}
              className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition text-left"
            >
              <div className="font-bold text-gray-900 mb-2">{date}</div>

              {day ? (
                <>
                  <MiniRadarChart comparisons={day.comparisons} />

                  <div className="mt-3 text-sm text-gray-600">
                    kcal:{" "}
                    {Math.round(
                      day.totals.find(
                        (x: any) => x.nutrientCode === "energy_kcal",
                      )?.value ?? 0,
                    )}
                  </div>
                </>
              ) : (
                <div className="text-sm text-gray-400 py-8 text-center">
                  データなし
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
