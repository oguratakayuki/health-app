<template>
  <div class="container">
    <h2>Ingredients[食材]</h2>

    <Pager
      :currentPage="currentPage"
      :totalPages="totalPages"
      @page-change="goToPage"
    />

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
              <td><SimpleButton @click="openModal(ingredient)">編集</SimpleButton></td>
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
import Pager from '@/components/ui/Pager.vue';
import IngredientModal from '@/components/modals/IngredientModal.vue';
import SimpleButton from '@/components/ui/SimpleButton.vue';
import { Ingredient } from '~/types/ingredients';

const showModal = ref(false);
const selectedIngredient = ref<Ingredient | null>(null);
const ingredients = ref<Ingredient[]>([]);
const currentPage = ref(1);
const totalPages = ref(0);
const isLoading = ref(false);

const fetchIngredients = async (page: number) => {
  isLoading.value = true;
  try {
    const response = await $fetch(`http://localhost:3009/api/v1/ingredients?page=${page}`, { ssr: false });
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

const goToPage = (page: number) => {
  currentPage.value = page;
  fetchIngredients(page);
};

fetchIngredients(currentPage.value);
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: top;
  align-items: left;
  height: 100vh; /* 画面の高さを指定 */
  padding-left: 50px;
}

.button-container {
  margin-bottom: 20px;
}

.table-container {
  width: 100%; /* 親要素の幅に揃える */
  overflow-x: auto; /* テーブルが幅を超えた場合にスクロールできるように */
  margin-top: 20px;
}

table {
  width: 1600px; /* 全体の幅を2倍に拡大 */
  /* margin: 0 auto; /* テーブルを中央寄せ */
  border-collapse: collapse;
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom: 1px solid #ccc;
  table-layout: fixed; /* 列幅を固定 */
}

/* 各列の幅を調整 */
th:first-child,
td:first-child {
  width: 80px; /* 最初の列は1/3の幅 */
}

th:last-child,
td:last-child {
  width: 80px; /* 最後の列も1/3の幅 */
}

th, td {
  border-bottom: 1px solid #ccc;
  padding: 10px;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis; /* はみ出た部分を省略 */
  white-space: nowrap; /* テキストの折り返しを防ぐ */
}

th {
  font-weight: bold;
}

.button-container {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin: 20px 0;
}

.button-container button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-size: 18px;
  color: #333;
  text-decoration: underline;
  transition: color 0.2s;
}

.button-container button:hover {
  color: #007bff;
}

.button-container button:disabled {
  color: #ccc;
  cursor: not-allowed;
}

.button-container button.active {
  color: #000;
  font-weight: bold;
  text-decoration: underline;
}
</style>

