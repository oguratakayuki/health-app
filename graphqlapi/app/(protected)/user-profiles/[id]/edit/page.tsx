"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";
import { Scale } from "lucide-react";
import UserProfileForm from "./UserProfileForm";
import { 
  EditUserProfileMutation, 
  EditUserProfileMutationVariables 
} from "@/frontend/generated/graphql";

// 型定義をここに配置（実際には別ファイルに切り出すべきだが、まずは動作確認優先）
export interface UserProfileFormValues {
  gender?: string;
  height?: number;
  birthday?: string;
}

interface EditUserProfilePageProps {
  params: { id: string };
}

import { 
  GET_USER_PROFILE, 
  EDIT_USER_PROFILE 
} from "@/frontend/graphql/queries/user_profile";

export default function UserProfileEditPage({ params }: EditUserProfilePageProps) {
  const router = useRouter();
  const { id } = params;
  const [isSaving, setIsSaving] = useState(false);

  // 1. 現データの取得 (詳細画面からの遷移を想定し、ここでは簡易的に実装)
  const { data: profileData, loading: loadingProfile } = useQuery<{
    userProfile: { gender?: string; height?: number; birthday?: string }
  }>(GET_USER_PROFILE, {
    variables: { id },
  });

  // 2. 更新処理のミューテーション
  const [editUserProfile] = useMutation<
    EditUserProfileMutation,
    EditUserProfileMutationVariables
  >(EDIT_USER_PROFILE);

  const handleCancel = () => {
    router.push(`/user-profiles/${id}`);
  };

  const handleSubmit = async (data: UserProfileFormValues) => {
    setIsSaving(true);
    try {
      await editUserProfile({
        variables: {
          input: {
            id: parseInt(id),
            gender: data.gender,
            height: data.height,
            birthday: data.birthday,
          },
        },
      });
      alert("保存しました");
      router.push(`/user-profiles/${id}`);
    } catch (error) {
      console.error(error);
      alert("保存に失敗しました");
    } finally {
      setIsSaving(false);
    }
  };

  if (loadingProfile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-blue-100 p-2 rounded-lg">
          <Scale className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">プロフィール編集</h1>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <UserProfileForm 
          initialData={{
            gender: profileData?.userProfile?.gender,
            height: profileData?.userProfile?.height,
            birthday: profileData?.userProfile?.birthday?.toString(),
          }}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isSaving}
        />
      </div>
    </div>
  );
}
