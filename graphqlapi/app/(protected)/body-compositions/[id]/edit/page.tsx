"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";
import { GET_BODY_COMPOSITION, EDIT_BODY_COMPOSITION } from "@/frontend/graphql/queries/body_composition";
import { 
  GetBodyCompositionQuery, 
  EditBodyCompositionMutation, 
  EditBodyCompositionMutationVariables 
} from "@/frontend/generated/graphql";
import BodyCompositionForm from "./BodyCompositionForm";
import { Activity } from "lucide-react";

export default function BodyCompositionEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data, loading, error } = useQuery<GetBodyCompositionQuery>(GET_BODY_COMPOSITION, {
    variables: { input: { id: id } },
  });

  const [editBodyComposition, { loading: mutationLoading }] = useMutation<
    EditBodyCompositionMutation, 
    EditBodyCompositionMutationVariables
  >(EDIT_BODY_COMPOSITION);

  const handleUpdate = async (values: any) => {
    try {
      await editBodyComposition({
        variables: {
          input: {
            id,
            measuredAt: new Date(values.measuredAt).toISOString(),
            weight: values.weight,
            bmi: values.bmi,
            bodyFatPercentage: values.bodyFatPercentage,
            bodyFatMass: values.bodyFatMass,
            subcutaneousFatPercentage: values.subcutaneousFatPercentage,
            visceralFatLevel: values.visceralFatLevel,
            skeletalMusclePercentage: values.skeletalMusclePercentage,
            skeletalMuscleMass: values.skeletalMuscleMass,
            ffmi: values.ffmi,
            boneMass: values.boneMass,
            basalMetabolism: values.basalMetabolism,
          },
        },
      });
      router.push(`/body-compositions/${id}`);
    } catch (e) {
      alert("更新に失敗しました。");
      console.error(e);
    }
  };

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
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500 text-lg font-medium">体組成データが見つかりませんでした。</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-emerald-100 p-2 rounded-lg">
          <Activity className="w-8 h-8 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">体組成データ編集</h1>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <BodyCompositionForm 
          initialData={data.bodyComposition} 
          onSubmit={handleUpdate} 
          isLoading={mutationLoading} 
        />
      </div>
    </div>
  );
}
