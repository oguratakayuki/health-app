// app/(protected)/(admin)/ingredients/[id]/edit/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  GET_INGREDIENTS,
  UPDATE_INGREDIENT,
} from "@/frontend/graphql/queries/ingredient";
import { ArrowLeft } from "lucide-react";

export default function IngredientEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data, loading } = useQuery(GET_INGREDIENTS);
  const [updateIngredient] = useMutation(UPDATE_INGREDIENT);

  const [editingName, setEditingName] = useState("");

  // 初期値のセット
  useEffect(() => {
    if (data?.ingredients) {
      const item = data.ingredients.find((item: any) => item.id === id);
      if (item) {
        setEditingName(item.name || "");
      }
    }
  }, [data, id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleUpdate = async () => {
    if (!editingName) return;
    await updateIngredient({
      variables: { id, input: { name: editingName } },
      // 更新後にキャッシュを再取得、または更新
      refetchQueries: [{ query: GET_INGREDIENTS }],
    });
    // 一覧画面に遷移
    router.push("/ingredients");
  };

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <Link
        href="/ingredients"
        className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1 mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> キャンセルして戻る
      </Link>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <h3 className="font-bold text-gray-900 mb-2">材料を編集 (ID: {id})</h3>
        <p className="text-sm text-gray-600 mb-4">
          新しい材料名を入力してください。
        </p>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
            className="w-full px-4 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none bg-white"
            onKeyPress={(e) => e.key === "Enter" && handleUpdate()}
          />
          <div className="flex justify-end gap-2">
            <Link
              href="/ingredients"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg transition"
            >
              キャンセル
            </Link>
            <button
              onClick={handleUpdate}
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-6 rounded-lg transition"
            >
              更新
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
