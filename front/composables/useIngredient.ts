// composables/useIngredient.ts

import { Ref } from "vue";

interface Ingredient {
  id: number;
  name: string;
  remarks: string;
  original_name: string;
}

export const useIngredient = () => {
  const updateIngredient = async (
    id: number,
    payload: Partial<Ingredient>
  ): Promise<{ message: string; ingredient: Ingredient } | undefined> => {
    try {
      const response = await $fetch<{
        message: string;
        ingredient: Ingredient;
      }>(`http://localhost:3009/api/v1/ingredients/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          ingredient: payload,
        },
      });
      return response;
    } catch (error) {
      console.error("Failed to update ingredient:", error);
    }
  };

  return { updateIngredient };
};
