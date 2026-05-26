
"use client";

import { useQuery } from "@apollo/client";
import { GET_MEAL_WITH_DISHES } from "@/frontend/graphql/queries/meal";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Utensils, Calendar, Tag } from "lucide-react";
import Link from "next/link";
import dayjs from "dayjs";
import "dayjs/locale/ja";

dayjs.locale("ja");

export default function MealDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data, loading, error } = useQuery(GET_MEAL_WITH_DISHES, {
    variables: { id },
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
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

  const meal = data?.mealWithDishes;

  if (!meal) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-500 mb-4">献立が見つかりませんでした</p>
          <Link href="/meals" className="text-green-600 hover:underline">
            一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* ナビゲーション */}
      <div className="mb-6">
        <Link 
          href="/meals" 
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 transition"
          onClick={() => router.back()}
        >
          <ChevronLeft className="w-4 h-4" />
          献立一覧に戻る
        </Link>
      </div>

      {/* メインコンテンツ */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* ヘッダーセクション */}
        <div className="bg-green-50 p-6 border-b border-green-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-600 p-2 rounded-lg">
              <Utensils className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {meal.name || "無題の献立"}
            </h1>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{dayjs(meal.mealDate).format("YYYY年M月D日")}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Tag className="w-4 h-4" />
              <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                {meal.category}
              </span>
            </div>
          </div>
        </div>

        {/* 料理リストセクション */}
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            料理内容
          </h2>
          
          {meal.dishes && meal.dishes.length > 0 ? (
            <ul className="space-y-3">
              {meal.dishes.map((dish: any) => (
                <li 
                  key={dish.id} 
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50 hover:bg-gray-100 transition"
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">{dish.name}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm italic">
              登録されている料理はありません。
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
