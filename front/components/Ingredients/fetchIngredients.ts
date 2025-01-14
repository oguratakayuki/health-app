import { ref } from "vue";
import Jsona from "jsona";

import { Ingredient } from "~/types/ingredients";
import { IngredientSearch } from "~/types/ingredientSearch";

export async function fetchIngredients(
  page: number,
  searchParams: IngredientSearch | null
) {
  const dataFormatter = new Jsona();
  const isLoading = ref(false);
  const ingredients = ref<Ingredient[]>([]);
  const totalPages = ref(0);
  const baseUrl = "http://localhost:3009/api/v1/ingredients";

  type IngredientSearchParams = {
    ingredient_name?: string;
    tag_ids?: string;
    page: number;
  };

  const params: IngredientSearchParams = {};

  if (searchParams && searchParams.name) {
    params.ingredient_name = searchParams.name;
  }

  if (searchParams && searchParams.tagIds.length > 0) {
    params.tag_ids = searchParams.tagIds.join(",");
  }
  params.page = page;

  isLoading.value = true;
  try {
    const response = await $fetch(baseUrl, { params, ssr: false });
    const data = await dataFormatter.deserialize(response);
    ingredients.value = data.map((row) => {
      // 例) エネルギー（kcal）: 100gあたり291kcal
      const ingredient_nutrients = row.ingredient_nutrients.map(
        (ingredient_nutrient) => {
          const {
            id,
            nutrient,
            content_quantity,
            content_unit,
            content_unit_per,
            content_unit_per_unit,
          } = ingredient_nutrient;
          // return `${ingredient_nutrient.nutrient.name}: ${content_unit_per}${content_unit_per_unit}あたり${content_quantity}${content_unit}`
          return {
            id,
            nutrient,
            content_quantity,
            content_unit,
            content_unit_per,
            content_unit_per_unit,
          };
        }
      );
      return {
        id: row.id,
        name: row.name,
        original_name: row.original_name,
        ingredient_nutrients: ingredient_nutrients,
      };
    });
    totalPages.value = response.meta.total_pages;
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
  return { ingredients: ingredients.value, totalPages: totalPages.value };
}
