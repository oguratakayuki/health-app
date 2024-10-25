<template>
  <div class="container">
    <h2>Ingredients</h2>
    <div class="button-container">
      <button @click="previousPage" :disabled="currentPage === 1">前へ</button>
      <button @click="nextPage" :disabled="currentPage === totalPages || totalPages === 0">次へ</button>
    </div>
    <div class="table-container">
      <div v-if="isLoading">Loading...</div>
      <div v-else>
        <table border="1" cellpadding="10">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Remarks</th>
              <th>Original Name</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="ingredient in ingredients" :key="ingredient.id">
              <td>{{ ingredient.id }}</td>
              <td>{{ ingredient.name || 'No Name Available' }}</td>
              <td>{{ ingredient.remarks || 'No Remarks Available' }}</td>
              <td>{{ ingredient.original_name || 'No Original' }}</td>
              <td><Button @click="openModal(ingredient)">編集</Button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <IngredientModal
      v-if="showModal"
      :ingredient="selectedIngredient"
      @close="showModal = false"
      @save="handleSave"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Ingredient } from '~/types/ingredients';
import IngredientModal from '@/components/modals/IngredientModal.vue';

const showModal = ref(false);

// selectedIngredient のデフォルト値を設定
const selectedIngredient = ref<Ingredient | null>(null);
const ingredients = ref<Ingredient[]>([]);
const currentPage = ref(1);
const isLoading = ref(false);
const totalPages = ref(0);

const fetchIngredients = async (page: number) => {
  isLoading.value = true;
  try {
    const response = await $fetch(`http://localhost:3009/api/v1/ingredients?page=${page}&_=${Date.now()}`, { ssr: false });
    ingredients.value = response.ingredients;
    totalPages.value = response.total_pages;
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const openModal = (ingredient: Ingredient) => {
  selectedIngredient.value = ingredient;
  showModal.value = true;
};

const handleSave = (formData: Ingredient) => {
  console.log('保存されたデータ:', formData);
  showModal.value = false;
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchIngredients(currentPage.value);
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    fetchIngredients(currentPage.value);
  }
};

fetchIngredients(currentPage.value);
</script>



<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh; /* 画面の高さを指定 */
}

.button-container {
  margin-bottom: 20px;
}

.table-container {
}


table {
  border-collapse: collapse;
  border-top: none; /* 上の線を消す */
  border-left: none; /* 左の線を消す */
  border-right: none; /* 右の線を消す */
  border-bottom: 1px solid #ccc; /* テーブルの下に線 */
}
td, th {
  border-top: none; /* 上の線を消す */
  border-right: none; /* 右の線を消す */
  border-left: none; /* 左の線を消す */
  border-bottom: 1px solid #ccc; /* 下の線だけ表示 */
  padding: 10px; /* セル内の余白 */
}




</style>
