"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Activity } from "lucide-react";
import { 
  GetBodyCompositionQuery, 
  EditBodyCompositionMutation, 
  EditBodyCompositionMutationVariables 
} from "@/frontend/generated/graphql";

interface BodyCompositionFormValues {
  measuredAt: string;
  weight: number;
  bmi: number;
  bodyFatPercentage: number;
  bodyFatMass: number;
  subcutaneousFatPercentage: number;
  visceralFatLevel: number;
  skeletalMusclePercentage: number;
  skeletalMuscleMass: number;
  ffmi: number;
  boneMass: number;
  basalMetabolism: number;
}

interface BodyCompositionFormProps {
  initialData: GetBodyCompositionQuery["bodyComposition"];
  onSubmit: (data: BodyCompositionFormValues) => Promise<void>;
  isLoading?: boolean;
}

export default function BodyCompositionForm({ 
  initialData, 
  onSubmit, 
  isLoading 
}: BodyCompositionFormProps) {
  const { register, handleSubmit, setValue } = useForm<BodyCompositionFormValues>({
    defaultValues: {
      measuredAt: initialData?.measuredAt ? new Date(initialData.measuredAt).toISOString().slice(0, 16) : "",
      weight: initialData?.weight || 0,
      bmi: initialData?.bmi || 0,
      bodyFatPercentage: initialData?.bodyFatPercentage || 0,
      bodyFatMass: initialData?.bodyFatMass || 0,
      subcutaneousFatPercentage: initialData?.subcutaneousFatPercentage || 0,
      visceralFatLevel: initialData?.visceralFatLevel || 0,
      skeletalMusclePercentage: initialData?.skeletalMusclePercentage || 0,
      skeletalMuscleMass: initialData?.skeletalMuscleMass || 0,
      ffmi: initialData?.ffmi || 0,
      boneMass: initialData?.boneMass || 0,
      basalMetabolism: initialData?.basalMetabolism || 0,
    },
  });

  const onSubmitHandler = async (data: BodyCompositionFormValues) => {
    await onSubmit(data);
  };

  return (
    <form 
      onSubmit={handleSubmit(onSubmitHandler)} 
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 基本情報 */}
        <div className="space-y-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
          <h3 className="text-sm font-bold text-emerald-700 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            基本情報
          </h3>
          <div className="space-y-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600">計測日時</label>
              <input 
                type="datetime-local" 
                {...register("measuredAt")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600">体重 (kg)</label>
              <input 
                type="number" 
                step="0.1"
                {...register("weight", { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600">BMI</label>
              <input 
                type="number" 
                step="0.1"
                {...register("bmi", { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
              />
            </div>
          </div>
        </div>

        {/* 脂肪データ */}
        <div className="space-y-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
          <h3 className="text-sm font-bold text-emerald-700 flex items-center gap-2">
            脂肪データ
          </h3>
          <div className="space-y-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600">体脂肪率 (%)</label>
              <input 
                type="number" 
                step="0.1"
                {...register("bodyFatPercentage", { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600">体脂肪量 (kg)</label>
              <input 
                type="number" 
                step="0.1"
                {...register("bodyFatMass", { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600">皮下脂肪率 (%)</label>
              <input 
                type="number" 
                step="0.1"
                {...register("subcutaneousFatPercentage", { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600">内臓脂肪レベル</label>
              <input 
                type="number" 
                step="1"
                {...register("visceralFatLevel", { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
              />
            </div>
          </div>
        </div>

        {/* 筋肉・骨・代謝 */}
        <div className="space-y-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100 md:col-span-2">
          <h3 className="text-sm font-bold text-emerald-700 flex items-center gap-2">
            筋肉・骨・代謝データ
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600">骨格筋率 (%)</label>
              <input 
                type="number" 
                step="0.1"
                {...register("skeletalMusclePercentage", { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600">骨格筋量 (kg)</label>
              <input 
                type="number" 
                step="0.1"
                {...register("skeletalMuscleMass", { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600">FFMI</label>
              <input 
                type="number" 
                step="0.1"
                {...register("ffmi", { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600">骨量 (kg)</label>
              <input 
                type="number" 
                step="0.1"
                {...register("boneMass", { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600">基礎代謝量 (kcal)</label>
              <input 
                type="number" 
                step="1"
                {...register("basalMetabolism", { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button 
          type="button"
          onClick={() => window.history.back()}
          className="px-6 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition"
        >
          キャンセル
        </button>
        <button 
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 rounded-lg transition flex items-center gap-2"
        >
          {isLoading ? "保存中..." : "変更を保存"}
        </button>
      </div>
    </form>
  );
}
