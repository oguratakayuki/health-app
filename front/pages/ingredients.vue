<template>
  <div class="container">
    <h2>Ingredients</h2>

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

          
.button-container {
  display: flex;
  gap: 20px; /* ボタン間の間隔を広めに */
  justify-content: center;
  margin: 20px 0;
}

.button-container button {
  background: none;        /* 背景色をなくす */
  border: none;            /* 枠線をなくす */
  padding: 0;
  cursor: pointer;
  font-size: 18px;         /* 適度な文字サイズ */
  color: #333;             /* テキスト色 */
  text-decoration: underline; /* アンダーラインを追加 */
  transition: color 0.2s;  /* ホバー時の色変化を滑らかに */
}

.button-container button:hover {
  color: #007bff;          /* ホバー時の色を青に変更 */
}

.button-container button:disabled {
  color: #ccc;             /* 無効なボタンの色を薄く */
  cursor: not-allowed;
}

/* 現在のページを強調表示 */
.button-container button.active {
  color: #000;
  font-weight: bold;
  text-decoration: underline;
}

</style>
