"use client";

import { useQuery } from "@apollo/client";
import { GET_DISHES } from "@/frontend/graphql/queries/dish";
import Link from "next/link";
import { Plus, Utensils, Eye, Edit2 } from "lucide-react";

export default function DishListPage() {
  const { data, loading, error } = useQuery(GET_DISHES);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* ヘッダー */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-100 p-2 rounded-lg">
          <Utensils className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">料理 一覧</h1>
      </div>

      {/* 新規作成ボタン */}
      <div className="mb-6">
        <Link
          href="/dishes/create"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-lg transition"
        >
          <Plus className="w-5 h-5" />
          新規作成
        </Link>
      </div>

      {/* 料理一覧 */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="divide-y divide-gray-200">
          {data.prismaDishes.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              料理が登録されていません
            </div>
          ) : (
            data.prismaDishes.map((dish: any) => (
              <div key={dish.id} className="p-4 hover:bg-gray-50 transition">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">{dish.name}</h3>
                  <div className="flex gap-2">
                    <Link
                      href={`/dishes/${dish.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
                    >
                      <Eye className="w-4 h-4" />
                      詳細
                    </Link>
                    <Link
                      href={`/dishes/${dish.id}/edit`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-sm border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition"
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
  );
}
