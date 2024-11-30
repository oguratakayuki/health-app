import { ref } from "vue";
import Jsona from "jsona";

import { Nutrient } from "~/types/nutrients";

export async function fetchNutrients() {
  const nutrients = ref<Nutrient[]>([]);
  try {
    const response = await $fetch("http://localhost:3009/api/v1/nutrients", {
      ssr: false,
    });
    nutrients.value = response;
  } catch (error) {
    console.error(error);
  }
  return nutrients.value;
}
