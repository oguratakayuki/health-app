"use client";

import React from "react";
import { useQuery } from "@apollo/client";
import { Scale, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { GET_USER_PROFILE } from "@/frontend/graphql/queries/user_profile";

export default function UserProfilePage() {
  const router = useRouter();
  
  const { data, loading, error } = useQuery(GET_USER_PROFILE);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">読み込み中...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px] text-red-500">
        エラーが発生しました: {error.message}
      </div>
    );
  }

  const profile = data?.userProfile;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* ヘッダー */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-100 p-2 rounded-lg">
          <Scale className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">プロフィール</h1>
      </div>

      {/* プロフィール詳細カード */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-500" />
            基本情報
          </h2>
          <button 
            onClick={() => router.push(`/user-profiles/edit`)}
            className="text-sm bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 px-3 py-1 rounded-md transition"
          >
            編集する
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 性別 */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">性別</span>
            <p className="text-lg text-gray-900">{profile?.gender || "未設定"}</p>
          </div>

          {/* 身長 */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">身長</span>
            <p className="text-lg text-gray-900">{profile?.height ? `${profile.height} cm` : "未設定"}</p>
          </div>

          {/* 誕生日 */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">誕生日</span>
            <p className="text-lg text-gray-900">{profile?.birthday ? new Date(profile.birthday).toLocaleDateString("ja-JP") : "未設定"}</p>
          </div>

          {/* 年齢 */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">年齢</span>
            <p className="text-lg text-gray-900">
              {profile?.birthday ? `${calculateAge(profile.birthday)} 歳` : "未設定"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function calculateAge(birthday: string | Date) {
  const birthDate = new Date(birthday);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}
