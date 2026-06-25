// app/(protected)/(admin)/ingredients/page.tsx
"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import Link from "next/link";
import {
  GET_INGREDIENTS,
  CREATE_INGREDIENT,
  DELETE_INGREDIENT,
} from "@/frontend/graphql/queries/ingredient";
import { Edit2, Trash2, Plus, Eye } from "lucide-react";

export default function IngredientAdminPage() {
  const { data, loading, refetch } = useQuery(GET_INGREDIENTS);
  const [createIngredient] = useMutation(CREATE_INGREDIENT, {
    onCompleted: () => refetch(),
  });
  const [deleteIngredient] = useMutation(DELETE_INGREDIENT, {
    onCompleted: () => refetch(),
  });

  const [name, setName] = useState("");

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">読み込み中...</span>
      </div>
    );
  }

  const list = data?.ingredients || [];

  // 作成
  const handleCreate = async () => {
    if (!name) return;
    await createIngredient({ variables: { name } });
    setName("");
  };

  // 削除
  const handleDelete = async (id: number) => {
    if (!confirm("削除していいですか？")) return;
    await deleteIngredient({ variables: { id } });
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">材料管理</h1>

      {/* 追加フォーム */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="材料名を入力"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            onKeyPress={(e) => e.key === "Enter" && handleCreate()}
          />
          <button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg flex items-center justify-center gap-2 transition"
          >
            <Plus className="w-5 h-5" />
            追加
          </button>
        </div>
      </div>

      {/* 一覧 */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="divide-y divide-gray-200">
          {list.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              材料が登録されていません
            </div>
          ) : (
            list.map((item: any) => (
              <div key={item.id} className="p-4 hover:bg-gray-50 transition">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">ID: {item.id}</p>
                  </div>
                  <div className="flex gap-2">
                    {/* 詳細・閲覧へのリンク */}
                    <Link
                      href={`/ingredients/${item.id}`}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                      title="閲覧"
                    >
                      <Eye className="w-5 h-5" />
                    </Link>
                    {/* 編集へのリンク */}
                    <Link
                      href={`/ingredients/${item.id}/edit`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="編集"
                    >
                      <Edit2 className="w-5 h-5" />
                    </Link>
                    {/* 削除ボタン */}
                    <button
                      onClick={() => handleDelete(Number(item.id))}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="削除"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
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
