import { ref } from "vue";
import Jsona from "jsona";

import { Nutrient } from "~/types/ingredients";

export async function fetchNutrients() {
  const isLoading = ref(false);
  const nutrients = ref<Nutrient[]>([]);

  isLoading.value = true;
  try {
    const response = await $fetch("http://localhost:3009/api/v1/nutrients", {
      ssr: false,
    });
    nutrients.value = response.map((row, index) => {
      return {
        id: row.id,
        name: row.name,
      };
    });
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
  return { nutrients: nutrients.value };
}
