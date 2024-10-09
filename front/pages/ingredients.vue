<template>
  <div class="container">
    <h2>Ingredients</h2>
    <div class="button-container">
      <button @click="previousPage" :disabled="currentPage === 1">前へ</button>
      <button @click="nextPage" :disabled="currentPage === totalPages || totalPages === 0">次へ</button>
    </div>
    <div  class="table-container">
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
              <td><button @click="handleEdit(ingredient)">編集</button></td>
              <td>
                <button @click="openModal(ingredient)">編集</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <IngredientModal v-if="showModal" :ingredient="selectedIngredient" @close="showModal = false" />
  </div>
</template>

<script setup lang="ts">
import { Ingredient } from '~/types/ingredients';
import IngredientModal from '@/components/modals/IngredientModal.vue';
const showModal = ref(false);

const selectedIngredient = ref(null);
const ingredients = ref([]);
const currentPage = ref(1);
const isLoading = ref(false);
const totalPages = ref(0);

const fetchIngredients = async (page) => {
  isLoading.value = true;
  try {
    const response = await $fetch(`http://localhost:3009/api/v1/ingredients?page=${page}&_=${Date.now()}`, { ssr: false });
    ingredients.value = response.ingredients;
    totalPages.value = response.total_pages;
  } catch (error) {
    // エラー処理
    console.error(error);
  } finally {
    console.log('finaly');
    console.log(ingredients)
    isLoading.value = false;
  }
};
const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchIngredients(currentPage.value);
  }
};

const nextPage = () => {
  // TODO: サーバー側の全ページ数を取得して、最大ページ数を超えないようにする
  currentPage.value++;
  fetchIngredients(currentPage.value);
};



const openModal = (ingredient: Ingredient) => {
  selectedIngredient.value = ingredient;
  console.log(selectedIngredient);
  showModal.value = true;
};


const handleSave = (formData: Ingredient) => {
  // API呼び出しで保存処理を実行
  // ...
  showModal.value = false;
};

// 新規登録ボタンをクリック時の処理
const handleCreate = () => {
  ingredient.value = { id: 0, name: '', remarks: '', original_name: '' };
  showModal.value = true;
};

// 更新ボタンをクリック時の処理 (特定の食材のデータでモーダルを開く)
const handleUpdate = (ingredient: Ingredient) => {
  console.log("update");
  console.log(ingredient);
  showModal.value = true;
};



fetchIngredients(currentPage.value);
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100v   
h; /* 画面の高さを指定 */
}

.button-container {
  margin-bottom: 20px;
}

.table-container {
}
</style>
