"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_NUTRIENTS,
  CREATE_NUTRIENT,
  UPDATE_NUTRIENT,
  DELETE_NUTRIENT,
} from "@/frontend/graphql/queries/nutrient";
import { Edit2, Trash2, Plus, Pill } from "lucide-react";

export default function NutrientAdminPage() {
  const { data, loading, refetch } = useQuery(GET_NUTRIENTS);
  const [createNutrient] = useMutation(CREATE_NUTRIENT, {
    onCompleted: () => refetch(),
  });
  const [updateNutrient] = useMutation(UPDATE_NUTRIENT, {
    onCompleted: () => refetch(),
  });
  const [deleteNutrient] = useMutation(DELETE_NUTRIENT, {
    onCompleted: () => refetch(),
  });

  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">読み込み中...</span>
      </div>
    );
  }

  const list = data?.prismaNutrients || [];

  const handleCreate = async () => {
    if (!name) return;
    await createNutrient({ variables: { name } });
    setName("");
  };

  const startEdit = (item: any) => {
    setEditingId(Number(item.id));
    setEditingName(item.name || "");
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    await updateNutrient({ variables: { id: editingId, name: editingName } });
    setEditingId(null);
    setEditingName("");
  };

  const handleDelete = async (id: number) => {
    if (!confirm("削除していいですか？")) return;
    await deleteNutrient({ variables: { id } });
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* ヘッダー */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-purple-100 p-2 rounded-lg">
          <Pill className="w-8 h-8 text-purple-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">栄養素管理</h1>
      </div>

      {/* 追加フォーム */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="栄養素名を入力"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
            onKeyPress={(e) => e.key === "Enter" && handleCreate()}
          />
          <button
            onClick={handleCreate}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-lg flex items-center justify-center gap-2 transition"
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
              栄養素が登録されていません
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
                    <button
                      onClick={() => startEdit(item)}
                      className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition"
                      title="編集"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
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

      {/* 編集フォーム */}
      {editingId && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mt-6">
          <h3 className="font-bold text-gray-900 mb-4">栄養素を編集</h3>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              className="flex-1 px-4 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none bg-white"
              onKeyPress={(e) => e.key === "Enter" && handleUpdate()}
            />
            <div className="flex gap-2">
              <button
                onClick={handleUpdate}
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-6 rounded-lg transition"
              >
                更新
              </button>
              <button
                onClick={() => {
                  setEditingId(null);
                  setEditingName("");
                }}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg transition"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
