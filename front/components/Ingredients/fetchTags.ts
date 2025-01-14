import { ref } from "vue";
import Jsona from "jsona";

import { Tag } from "~/types/tags";

export async function fetchTags(page: number) {
  const dataFormatter = new Jsona();
  const isLoading = ref(false);
  const tags = ref<Tag[]>([]);
  const totalPages = ref(0);

  isLoading.value = true;
  try {
    const response = await $fetch(
      `http://localhost:3009/api/v1/tags?page=${page}`,
      { ssr: false }
    );
    const data = await dataFormatter.deserialize(response);
    tags.value = data;
    // TODO まだtag_categoriesがデータとして存在しない
    // tags.value = data.map((row, index) => {
    //   // 例) エネルギー（kcal）: 100gあたり291kcal
    //   console.log(row);
    //   const tag_categories = row.tag_categories.map((tag_category, index2) => {
    //     const { id, category } = tag_category;
    //     return {
    //       id,
    //       name,
    //       category,
    //     };
    //   });
    //   return {
    //     id: row.id,
    //     name: row.name,
    //     tag_categories: tag_categories,
    //   };
    // });

    totalPages.value = response.meta.total_pages;
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
  return { tags: tags.value, totalPages: totalPages.value };
}
