"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { UserProfileFormValues } from "./page";

interface UserProfileFormProps {
  initialData: Partial<UserProfileFormValues>;
  onSubmit: (data: UserProfileFormValues) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export default function UserProfileForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isLoading 
}: UserProfileFormProps) {
  const { register, handleSubmit, setValue } = useForm<UserProfileFormValues>({
    defaultValues: initialData,
  });

  // 初期データをフォームに反映
  React.useEffect(() => {
    if (initialData) {
      Object.entries(initialData).forEach(([key, value]) => {
        setValue(key as any, value);
      });
    }
  }, [initialData, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-600">性別</label>
          <input
            {...register("gender")}
            type="text"
            placeholder="未設定"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-600">身長 (cm)</label>
          <input
            {...register("height")}
            type="number"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-600">誕生日</label>
          <input
            {...register("birthday")}
            type="date"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition"
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-6 rounded-lg transition flex items-center justify-center"
        >
          {isLoading ? "保存中..." : "保存する"}
        </button>
      </div>
    </form>
  );
}
