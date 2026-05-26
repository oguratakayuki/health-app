
"use client";

import { useQuery } from "@apollo/client";
import { GET_MEALS } from "@/frontend/graphql/queries/meal";
import Link from "next/link";
import { Plus, UtensilsCrossed, Eye, Edit2 } from "lucide-react";
import { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";

export default function MealListPage() {
  // デフォルトで今月の開始日と終了日を設定
  const [dateFrom, setDateFrom] = useState<Dayjs | null>(dayjs().startOf('month'));
  const [dateTo, setDateTo] = useState<Dayjs | null>(dayjs().endOf('month'));

  // GraphQLに送信するための文字列フォーマット (YYYY-MM-DD)
  const fromStr = dateFrom ? dateFrom.format('YYYY-MM-DD') : '';
  const toStr = dateTo ? dateTo.format('YYYY-MM-DD') : '';

  const { data, loading, error } = useQuery(GET_MEALS, {
    variables: { from: fromStr, to: toStr },
    skip: !fromStr || !toStr, // 日付が揃っていない場合はクエリをスキップ
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-4 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
        Error: {error.message}
      </div>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* ヘッダー */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <UtensilsCrossed className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">献立 一覧</h1>
          </div>
          
          {/* 期間選択 - MUI DatePickerを使用してモダンに */}
          <div className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm border border-gray-200">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 ml-1 mb-1">開始日</span>
              <DatePicker
                value={dateFrom}
                onChange={(newValue) => setDateFrom(newValue)}
                slotProps={{ textField: { size: 'small', variant: 'standard' } }}
              />
            </div>
            <div className="pt-5 text-gray-400">~</div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 ml-1 mb-1">終了日</span>
              <DatePicker
                value={dateTo}
                onChange={(newValue) => setDateTo(newValue)}
                slotProps={{ textField: { size: 'small', variant: 'standard' } }}
              />
            </div>
          </div>
        </div>

        {/* 新規作成ボタン */}
        <div className="mb-6">
          <Link
            href="/meals/create"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-5 rounded-lg transition"
          >
            <Plus className="w-5 h-5" />
            新規作成
          </Link>
        </div>

        {/* 献立一覧 */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="divide-y divide-gray-200">
            {!data?.meals || data.meals.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                指定期間に献立が登録されていません
              </div>
            ) : (
              data.meals.map((meal: any) => (
                <div key={meal.id} className="p-4 hover:bg-gray-50 transition">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900">{meal.name}</h3>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{meal.category}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {meal.mealDate} | 料理: {meal.dishes?.map((d: any) => d.name).join(", ") || "なし"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/meals/${meal.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
                      >
                        <Eye className="w-4 h-4" />
                        詳細
                      </Link>
                      <Link
                        href={`/meals/${meal.id}/edit`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm border border-green-300 text-green-700 rounded-lg hover:bg-green-50 transition"
                      >
                        <Edit2 className="w-4 h-4" />
                        編集
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
}
