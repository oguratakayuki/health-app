
"use client";

import { useQuery, useMutation } from "@apollo/client";
import { UPDATE_MEAL } from "@/frontend/graphql/queries/meal";
import { GET_DISHES } from "@/frontend/graphql/queries/dish";
import { useParams, useRouter } from "next/navigation";
import { Save, X, Utensils } from "lucide-react";
import { useState } from "react";

export default function UpdateMealPage() {
  const params = useParams();
  const router = useRouter();
  const mealId = params.id as string;

  // セレクトボックス用のデータ取得
  const { data: dishData, loading: dishesLoading } = useQuery(GET_DISHES);
  const dishes = dishData?.prismaDishes || [];

  // 更新用状態管理
  const [selectedDishId, setSelectedDishId] = useState<string>("");

  const [updateMeal, { loading: updateLoading }] = useMutation(UPDATE_MEAL);

  const handleUpdate = async () => {
    if (!selectedDishId) {
      alert("料理を選択してください");
      return;
    }

    try {
      await updateMeal({
        variables: {
          id: mealId,
          input: {
            addDishIds: [parseInt(selectedDishId)],
            // 必要に応じて他の更新項目を追加
          },
        },
      });
      alert("献立を更新しました");
      router.push("/meals");
    } catch (e) {
      console.error(e);
      alert("更新に失敗しました");
    }
  };

  const handleCancel = () => {
    router.push("/meals");
  };

  if (dishesLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-green-600 p-4">
          <div className="flex items-center gap-2 text-white">
            <Utensils className="w-5 h-5" />
            <h1 className="text-lg font-bold">献立の更新</h1>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* 献立ID表示 (読み取り専用) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              献立ID
            </label>
            <input
              type="text"
              value={mealId}
              readOnly
              className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-500 text-sm cursor-not-allowed"
            />
          </div>

          {/* 料理選択セレクトボックス */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              追加する料理
            </label>
            <select
              value={selectedDishId}
              onChange={(e) => setSelectedDishId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
            >
              <option value="">料理を選択してください</option>
              {dishes.map((dish: any) => (
                <option key={dish.id} value={dish.id}>
                  {dish.name}
                </option>
              ))}
            </select>
          </div>

          {/* ボタン群 */}
          <div className="flex items-center gap-3 pt-4">
            <button
              onClick={handleUpdate}
              disabled={updateLoading}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition disabled:bg-green-300"
            >
              <Save className="w-4 h-4" />
              {updateLoading ? "更新中..." : "更新"}
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2 px-4 rounded-lg transition"
            >
              <X className="w-4 h-4" />
              キャンセル
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
