// app/(protected)/(admin)/ingredients/[id]/page.tsx
"use client";

import React from "react";
import { useQuery } from "@apollo/client";
import { useParams } from "next/navigation";
import Link from "next/link";
// 単一取得クエリを想定（無ければ GET_INGREDIENTS から find する形に修正してください）
import { GET_INGREDIENTS } from "@/frontend/graphql/queries/ingredient";
import { ArrowLeft, Edit2 } from "lucide-react";

export default function IngredientDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  // ここでは全件から取得していますが、GET_INGREDIENT(単一)があればそちらが望ましいです
  const { data, loading } = useQuery(GET_INGREDIENTS);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const ingredient = data?.ingredients?.find(
    (item: any) => Number(item.id) === id,
  );

  if (!ingredient) {
    return (
      <div className="p-8 text-center text-gray-500">
        データが見つかりませんでした。
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <Link
        href="/ingredients"
        className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1 mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> 一覧に戻る
      </Link>

      <div className="bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">材料詳細</h1>
        <div className="border-t border-gray-100 pt-4 space-y-4">
          <div>
            <span className="text-xs text-gray-500 block">ID</span>
            <span className="text-lg font-mono text-gray-800">
              {ingredient.id}
            </span>
          </div>
          <div>
            <span className="text-xs text-gray-500 block">材料名</span>
            <span className="text-xl font-medium text-gray-900">
              {ingredient.name}
            </span>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Link
            href={`/ingredients/${id}/edit`}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg flex items-center gap-2 transition"
          >
            <Edit2 className="w-4 h-4" />
            編集する
          </Link>
        </div>
      </div>
    </div>
  );
}
