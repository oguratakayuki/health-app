"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_NUTRIENT,
  UPDATE_NUTRIENT,
} from "@/frontend/graphql/queries/nutrient";
import {
  GetNutrientQuery,
  GetNutrientQueryVariables,
  UpdateNutrientMutation,
  UpdateNutrientMutationVariables,
} from "@/frontend/generated/graphql";

import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Pill } from "lucide-react";

export default function EditNutrientPage() {
  const router = useRouter();
  const params = useParams();
  const id = String(params.id);

  // 💡 入力項目のステート管理
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [parentId, setParentId] = useState("");

  /** ───────────────────────────────
   * 栄養素データの取得
   * ─────────────────────────────── */
  const { data, loading, error } = useQuery<
    GetNutrientQuery,
    GetNutrientQueryVariables
  >(GET_NUTRIENT, { variables: { id } });

  /** ───────────────────────────────
   * 栄養素データの更新
   * ─────────────────────────────── */
  const [updateNutrient, { loading: updating }] = useMutation<
    UpdateNutrientMutation,
    UpdateNutrientMutationVariables
  >(UPDATE_NUTRIENT, {
    onCompleted: () => router.push("/nutrients"),
  });

  // データがロードされたら初期値をフォームにセット
  useEffect(() => {
    if (data?.nutrient) {
      setName(data.nutrient.name || "");
      setCode(data.nutrient.code || "");
      setParentId(data.nutrient.parentId || "");
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;

    await updateNutrient({
      variables: {
        id,
        input: {
          name,
          code,
          // 空文字の場合は null として送信、値がある場合はそのままセット
          parentId: parentId.trim() === "" ? null : parentId,
        },
      },
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-3 text-gray-600">読み込み中...</span>
      </div>
    );
  }

  if (error || !data?.nutrient) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <p className="text-red-600 font-medium">
          栄養素データが見つかりませんでした。
        </p>
        <button
          onClick={() => router.push("/nutrients")}
          className="mt-4 text-purple-600 hover:underline flex items-center justify-center gap-1 mx-auto"
        >
          <ArrowLeft className="w-4 h-4" /> 一覧に戻る
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* ヘッダーリンク */}
      <button
        onClick={() => router.push("/nutrients")}
        className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-4 transition"
      >
        <ArrowLeft className="w-4 h-4" /> 栄養素一覧に戻る
      </button>

      {/* メインカード */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
          <div className="bg-purple-100 p-2 rounded-lg">
            <Pill className="w-6 h-6 text-purple-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">栄養素を編集</h1>
        </div>

        {/* フォーム */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 栄養素名 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">
              栄養素名
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="例：ビタミンC"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition bg-gray-50/50"
            />
          </div>

          {/* 識別コード */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">
              識別コード（必須・一意）
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              placeholder="例：VIT_C"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition bg-gray-50/50"
            />
          </div>

          {/* 親栄養素ID */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">
              親栄養素 ID（任意）
            </label>
            <input
              type="text"
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              placeholder="上位カテゴリがある場合はIDを入力"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition bg-gray-50/50"
            />
          </div>

          {/* ボタンエリア */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={updating || !name.trim() || !code.trim()}
              className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white font-medium py-2.5 px-6 rounded-lg flex items-center justify-center gap-2 transition"
            >
              <Save className="w-5 h-5" />
              {updating ? "更新中..." : "変更を保存"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/nutrients")}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
            >
              キャンセル
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
