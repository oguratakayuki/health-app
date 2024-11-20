import { Ingredient } from "~/types/ingredients";

export const useIngredient = () => {
  const updateIngredient = async (
    id: number,
    payload: Partial<Ingredient>
  ): Promise<{ message: string; ingredient: Ingredient } | undefined> => {
    try {
      const transformedPayload = {
        ...payload,
        ingredient_nutrients_attributes: payload.ingredient_nutrients?.map(
          (nutrient) => {
            // nutrient プロパティを削除
            const { nutrient: _, ...rest } = nutrient;
            return rest;
          }
        ),
      };
      delete transformedPayload.ingredient_nutrients; // 元のキーを削除

      const response = await $fetch<{
        message: string;
        ingredient: Ingredient;
      }>(`http://localhost:3009/api/v1/ingredients/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          ingredient: transformedPayload, // 修正後のデータを送信
        },
      });
      return response;
    } catch (error) {
      console.error("Failed to update ingredient:", error);
    }
  };

  return { updateIngredient };
};
