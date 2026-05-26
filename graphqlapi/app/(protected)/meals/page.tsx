
"use client";

import { useQuery, useMutation } from "@apollo/client";
import { GET_MEALS, DELETE_MEAL } from "@/frontend/graphql/queries/meal";
import Link from "next/link";
import { Plus, UtensilsCrossed, Eye, Edit2, Trash2, Calendar } from "lucide-react";
import { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import "dayjs/locale/ja";

dayjs.locale("ja");

export default function MealListPage() {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

  const [dateFrom, setDateFrom] = useState<any>(dayjs().startOf('month'));
  const [dateTo, setDateTo] = useState<any>(dayjs().endOf('month'));

  const fromStr = dateFrom ? dateFrom.format('YYYY-MM-DD') : '';
  const toStr = dateTo ? dateTo.format('YYYY-MM-DD') : '';

  const { data, loading, error, refetch } = useQuery(GET_MEALS, {
    variables: { from: fromStr, to: toStr },
    skip: !fromStr || !toStr,
  });

  const [deleteMeal] = useMutation(DELETE_MEAL);

  const handleDelete = async (id: string) => {
    if (confirm("本当にこの献立を削除しますか？")) {
      try {
        await deleteMeal({ variables: { id } });
        refetch();
      } catch (e) {
        alert("削除に失敗しました");
      }
    }
  };

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
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <UtensilsCrossed className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">献立 一覧</h1>
          </div>
          
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

        <div className="mb-6">
          <Link
            href="/meals/create"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-5 rounded-lg transition"
          >
            <Plus className="w-5 h-5" />
            新規作成
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700">日付</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700">カテゴリ</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700">料理内容</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {!data?.meals || data.meals.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    指定期間に献立が登録されていません
                  </td>
                </tr>
              ) : (
                data.meals.map((meal: any) => (
                  <tr key={meal.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {dayjs(meal.mealDate).format("YYYY年M月D日")}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                        {meal.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {meal.dishes && meal.dishes.length > 0 
                        ? meal.dishes.map((d: any) => d.name).join(", ") 
                        : "なし"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/meals/${meal.id}`}
                          className="p-2 text-gray-500 hover:text-blue-600 transition"
                          title="詳細"
                        >
                          <Eye className="w-5 h-5" />
                        </Link>
                        <Link
                          href={`/meals/${meal.id}/edit`}
                          className="p-2 text-gray-500 hover:text-green-600 transition"
                          title="編集"
                        >
                          <Edit2 className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(meal.id)}
                          className="p-2 text-gray-500 hover:text-red-600 transition"
                          title="削除"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </LocalizationProvider>
  );
}
