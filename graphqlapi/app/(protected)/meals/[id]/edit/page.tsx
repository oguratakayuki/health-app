"use client";

import { useQuery, useMutation } from "@apollo/client";
import {
  UPDATE_MEAL,
  GET_MEAL_WITH_DISHES,
} from "@/frontend/graphql/queries/meal";
import { GET_DISHES } from "@/frontend/graphql/queries/dish";
import { useParams, useRouter } from "next/navigation";
import {
  Save,
  X,
  Utensils,
  Plus,
  Trash2,
  Calendar,
  Clock,
  Tag,
} from "lucide-react";
import { useState, useEffect } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";

export default function UpdateMealPage() {
  const params = useParams();
  const router = useRouter();
  const mealId = params.id as string;

  // フォーム状態
  const [mealDate, setMealDate] = useState<Dayjs | null>(null);
  const [category, setCategory] = useState<string>("breakfast");
  const [startTime, setStartTime] = useState<Dayjs | null>(null);
  const [endTime, setEndTime] = useState<Dayjs | null>(null);
  const [selectedDishes, setSelectedDishes] = useState<string[]>([]);

  // データの取得
  const { data: mealData, loading: mealLoading } = useQuery(
    GET_MEAL_WITH_DISHES,
    {
      variables: { id: mealId },
    },
  );
  const { data: dishData, loading: dishesLoading } = useQuery(GET_DISHES);
  const dishes = dishData?.prismaDishes || [];

  const [updateMeal, { loading: updateLoading }] = useMutation(UPDATE_MEAL);

  // 初期データのセット
  useEffect(() => {
    if (mealData?.mealWithDishes) {
      const meal = mealData.mealWithDishes;
      setMealDate(dayjs(meal.mealDate));
      setCategory(meal.category || "breakfast");
      // startTime/endTimeがAPIから返ってくる想定 (現状のGET_MEAL_WITH_DISHESにはないが、型定義にはある)
      // もしAPIが返さない場合は null のまま
      if (meal.dishes) {
        setSelectedDishes(meal.dishes.map((d: any) => d.id.toString()));
      }
    }
  }, [mealData]);

  const handleUpdate = async () => {
    try {
      await updateMeal({
        variables: {
          id: mealId,
          input: {
            mealDate: mealDate ? mealDate.toISOString() : undefined,
            category: category,
            startTime: startTime ? startTime.format("HH:mm") : undefined,
            endTime: endTime ? endTime.format("HH:mm") : undefined,
            // 変更の差分を計算して送信 (簡略化のため、ここでは current dishes を一度全部消して入れ直すか、
            // addDishIds/removeDishIds を使う)
            // ここではシンプルに addDishIds として送信。
            // 本来は currentDishIds と比較して append/remove を分けるべき。
            addDishIds: selectedDishes.map((id) => parseInt(id)),
          },
        },
      });
      alert("献立を更新しました");
      router.push("/meals");
    } catch (e) {
      console.error(e);
      console.error(JSON.stringify(e, null, 2));

      // 2. GraphQLサーバーが返したバリデーションエラーなどを見る
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        e.graphQLErrors.forEach((error: any, i: number) => {
          console.error(`GraphQL Error [${i}]:`, error.message);
          console.error(`Path:`, error.path);
          console.error(`Extensions (詳細):`, error.extensions);
        });
      }
      alert("更新に失敗しました");
    }
  };

  const handleAddDish = () => {
    setSelectedDishes([...selectedDishes, ""]);
  };

  const handleRemoveDish = (index: number) => {
    setSelectedDishes(selectedDishes.filter((_, i) => i !== index));
  };

  const handleDishChange = (index: number, value: string) => {
    const updated = [...selectedDishes];
    updated[index] = value;
    setSelectedDishes(updated);
  };

  if (mealLoading || dishesLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-green-600 p-4">
            <div className="flex items-center gap-2 text-white">
              <Utensils className="w-5 h-5" />
              <h1 className="text-lg font-bold">献立の編集</h1>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* 基本情報セクション */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> 日付
                </label>
                <DatePicker
                  value={mealDate}
                  onChange={(val) => setMealDate(val)}
                  slotProps={{ textField: { size: "small", fullWidth: true } }}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Tag className="w-4 h-4" /> カテゴリ
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
                >
                  <option value="breakfast">朝食</option>
                  <option value="lunch">昼食</option>
                  <option value="dinner">夕食</option>
                  <option value="snack">間食</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> 開始時間
                </label>
                <TimePicker
                  value={startTime}
                  onChange={(val) => setStartTime(val)}
                  slotProps={{ textField: { size: "small", fullWidth: true } }}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> 終了時間
                </label>
                <TimePicker
                  value={endTime}
                  onChange={(val) => setEndTime(val)}
                  slotProps={{ textField: { size: "small", fullWidth: true } }}
                />
              </div>
            </div>

            {/* 料理選択セクション */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Utensils className="w-4 h-4" /> 料理の構成
                </label>
                <button
                  onClick={handleAddDish}
                  className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-600 hover:bg-green-100 px-2 py-1 rounded-md transition font-medium"
                >
                  <Plus className="w-3 h-3" /> 追加
                </button>
              </div>

              <div className="space-y-3">
                {selectedDishes.map((dishId, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-1">
                      <select
                        value={dishId}
                        onChange={(e) =>
                          handleDishChange(index, e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none transition"
                      >
                        <option value="">料理を選択してください</option>
                        {dishes.map((dish: any) => (
                          <option key={dish.id} value={dish.id}>
                            {dish.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={() => handleRemoveDish(index)}
                      className="p-2 text-gray-400 hover:text-red-600 transition"
                      title="削除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {selectedDishes.length === 0 && (
                  <p className="text-center text-xs text-gray-400 py-4 border-2 border-dashed border-gray-100 rounded-lg">
                    料理が選択されていません
                  </p>
                )}
              </div>
            </div>

            {/* ボタンエリア */}
            <div className="flex items-center gap-3 pt-6 border-t border-gray-100">
              <button
                onClick={handleUpdate}
                disabled={updateLoading}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-4 rounded-lg transition disabled:bg-green-300"
              >
                <Save className="w-4 h-4" />
                {updateLoading ? "更新中..." : "更新して保存"}
              </button>
              <button
                onClick={() => router.push("/meals")}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2.5 px-4 rounded-lg transition"
              >
                <X className="w-4 h-4" />
                キャンセル
              </button>
            </div>
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
}
