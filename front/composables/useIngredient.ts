import { Ingredient, IngredientResponse } from "~/types/ingredients";

export const useIngredient = () => {
  const updateIngredient = async (
    id: number,
    payload: Partial<Ingredient>
  ): Promise<IngredientResponse | undefined> => {
    try {
      const transformedPayload = {
        ...payload,
        ingredient_nutrients_attributes: payload.ingredient_nutrients?.map(
          (nutrient) => {
            const nutrientCopy = { ...nutrient };
            delete nutrientCopy.nutrient;
            return nutrientCopy;
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

  const createIngredient = async (
    payload: Partial<Ingredient>
  ): Promise<IngredientResponse | undefined> => {
    try {
      const transformedPayload = {
        ...payload,
        ingredient_nutrients_attributes: payload.ingredient_nutrients?.map(
          (nutrient) => {
            const nutrientCopy = { ...nutrient };
            delete nutrientCopy.nutrient;
            return nutrientCopy;
          }
        ),
      };
      delete transformedPayload.ingredient_nutrients; // 元のキーを削除

      const response = await $fetch<{
        message: string;
        ingredient: Ingredient;
      }>(`http://localhost:3009/api/v1/ingredients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          ingredient: transformedPayload, // 修正後のデータを送信
        },
      });
      return response;
    } catch (error) {
      console.error("Failed to create ingredient:", error);
    }
  };

  return { updateIngredient, createIngredient };
};
