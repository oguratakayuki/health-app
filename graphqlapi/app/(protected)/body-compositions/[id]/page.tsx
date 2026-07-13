"use client";

import React from "react";
import { useQuery } from "@apollo/client";
import { useRouter, useParams } from "next/navigation";
import { Activity, ArrowLeft, Edit3 } from "lucide-react";
import { GET_BODY_COMPOSITION } from "@/frontend/graphql/queries/body_composition";
import { GetBodyCompositionQuery } from "@/frontend/generated/graphql";

export default function BodyCompositionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data, loading, error } = useQuery<GetBodyCompositionQuery>(GET_BODY_COMPOSITION, {
    variables: {
      input: {
        id: parseInt(id),
      },
    },
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        <span className="ml-3 text-gray-600">読み込み中...</span>
      </div>
    );
  }

  if (error || !data?.bodyComposition) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen gap-4">
        <p className="text-gray-600">データを取得できませんでした</p>
        <button 
          onClick={() => router.push("/body-compositions")}
          className="text-emerald-600 hover:underline"
        >
          一覧に戻る
        </button>
      </div>
    );
  }

  const comp = data.bodyComposition;

  const FieldItem = ({ label, value, suffix = "" }: { label: string; value: any; suffix?: string }) => (
    <div className="flex justify-between items-center p-3 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}{suffix}</span>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.push("/body-compositions")}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition"
            title="一覧に戻る"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="bg-emerald-100 p-2 rounded-lg">
            <Activity className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">体組成計測詳細</h1>
        </div>
        <button 
          onClick={() => router.push(`/body-compositions/${id}/edit`)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition"
        >
          <Edit3 className="w-5 h-5" />
          編集する
        </button>
      </div>

      {/* メインコンテンツ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 基本指標カード */}
        <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-100">
          <div className="bg-emerald-50 px-4 py-3 border-b border-emerald-100">
            <h2 className="text-sm font-bold text-emerald-800">基本指標</h2>
          </div>
          <div className="p-1">
            <FieldItem label="計測日時" value={new Date(comp.measuredAt).toLocaleString()} />
            <FieldItem label="体重" value={comp.weight} suffix=" kg" />
            <FieldItem label="BMI" value={comp.bmi} />
          </div>
        </div>

        {/* 脂肪データカード */}
        <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-100">
          <div className="bg-emerald-50 px-4 py-3 border-b border-emerald-100">
            <h2 className="text-sm font-bold text-emerald-800">脂肪データ</h2>
          </div>
          <div className="p-1">
            <FieldItem label="体脂肪率" value={comp.bodyFatPercentage} suffix=" %" />
            <FieldItem label="体脂肪量" value={comp.bodyFatMass} suffix=" kg" />
            <FieldItem label="皮下脂肪率" value={comp.subcutaneousFatPercentage} suffix=" %" />
            <FieldItem label="内臓脂肪レベル" value={comp.visceralFatLevel} />
          </div>
        </div>

        {/* 筋肉・骨・代謝カード */}
        <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-100 md:col-span-2">
          <div className="bg-emerald-50 px-4 py-3 border-b border-emerald-100">
            <h2 className="text-sm font-bold text-emerald-800">筋肉・骨・代謝</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 p-1">
            <div className="divide-y divide-gray-100">
              <FieldItem label="骨格筋率" value={comp.skeletalMusclePercentage} suffix=" %" />
              <FieldItem label="骨格筋量" value={comp.skeletalMuscleMass} suffix=" kg" />
            </div>
            <div className="divide-y divide-gray-100">
              <FieldItem label="FFMI（除脂肪量指数）" value={comp.ffmi} />
              <FieldItem label="骨量" value={comp.boneMass} suffix=" kg" />
              <FieldItem label="基礎代謝量" value={comp.basalMetabolism} suffix=" kcal" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
