"use client";

import React from "react";
import { useQuery } from "@apollo/client";
import {
  GET_BODY_COMPOSITIONS,
} from "@/frontend/graphql/queries/body_composition";
import {
  GetBodyCompositionsQuery,
} from "@/frontend/generated/graphql";
import { useRouter } from "next/navigation";
import { Edit2, Activity } from "lucide-react";

export default function BodyCompositionListPage() {
  const router = useRouter();
  const { data, loading } = useQuery<GetBodyCompositionsQuery>(GET_BODY_COMPOSITIONS);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        <span className="ml-3 text-gray-600">読み込み中...</span>
      </div>
    );
  }

  const list = data?.bodyCompositions || [];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-100 p-2 rounded-lg">
            <Activity className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">体組成・体重計測履歴</h1>
        </div>
        
        {/* 将来的なCSVインポートボタン用のスペース */}
        <div className="flex gap-2">
          {/* <button className="...">CSVインポート</button> */}
        </div>
      </div>

      {/* 一覧テーブル */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-emerald-50 border-b border-emerald-100">
              <th className="px-4 py-3 text-xs font-semibold text-emerald-700 uppercase tracking-wider">計測日時</th>
              <th className="px-4 py-3 text-xs font-semibold text-emerald-700 uppercase tracking-wider">体重 (kg)</th>
              <th className="px-4 py-3 text-xs font-semibold text-emerald-700 uppercase tracking-wider">BMI</th>
              <th className="px-4 py-3 text-xs font-semibold text-emerald-700 uppercase tracking-wider">体脂肪率 (%)</th>
              <th className="px-4 py-3 text-xs font-semibold text-emerald-700 uppercase tracking-wider">骨格筋率 (%)</th>
              <th className="px-4 py-3 text-right text-emerald-700">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {list.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  データが登録されていません
                </td>
              </tr>
            ) : (
              list.map((item) => (
                <tr 
                  key={item.id} 
                  className="hover:bg-emerald-50/50 transition cursor-pointer"
                  onClick={() => router.push(`/body-compositions/${item.id}`)}
                >
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {new Date(item.measuredAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.weight}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.bmi}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.bodyFatPercentage}%</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.skeletalMusclePercentage}%</td>
                  <td className="px-4 py-3 text-right">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/body-compositions/${item.id}/edit`);
                      }}
                      className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition"
                      title="編集"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
