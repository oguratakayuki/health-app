"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";
import { Scale } from "lucide-react";
import UserProfileForm from "./UserProfileForm";
import { 
  EditUserProfileMutation, 
  EditUserProfileMutationVariables 
} from "@/frontend/generated/graphql";

export interface UserProfileFormValues {
  gender?: string;
  height?: number;
  birthday?: string;
}

const formatDateToYYYYMMDD = (dateValue: any) => {
  if (!dateValue) return "";
  const date = new Date(dateValue);
  if (isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
};

import { 
  GET_USER_PROFILE, 
  EDIT_USER_PROFILE 
} from "@/frontend/graphql/queries/user_profile";

export default function UserProfileEditPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const { data: profileData, loading: loadingProfile } = useQuery<{
    userProfile: { gender?: string; height?: number; birthday?: string, id: number }
  }>(GET_USER_PROFILE);

  const [editUserProfile] = useMutation<
    EditUserProfileMutation,
    EditUserProfileMutationVariables
  >(EDIT_USER_PROFILE);

  const handleCancel = () => {
    router.push(`/user-profiles`);
  };

  const handleSubmit = async (data: UserProfileFormValues) => {
    setIsSaving(true);
    try {
      await editUserProfile({
        variables: {
          input: {
            id: profileData?.userProfile?.id ?? 0,
            gender: data.gender,
            height: data.height,
            birthday: data.birthday,
          },
        },
      });
      alert("保存しました");
      router.push(`/user-profiles`);
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
            birthday: formatDateToYYYYMMDD(profileData?.userProfile?.birthday),
          }}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isSaving}
        />
      </div>
    </div>
  );
}
