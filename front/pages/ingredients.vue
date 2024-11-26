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
              <th>Detail</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="ingredient in ingredients" :key="ingredient.id">
              <td>{{ ingredient.id }}</td>
              <td>{{ ingredient.name || 'No Name Available' }}</td>
              <td>{{ ingredient.remarks || 'No Remarks Available' }}</td>
              <td>{{ ingredient.original_name || 'No Original' }}</td>
              <td><SimpleButton @click="openModal(ingredient, ModalType.Detail)">詳細</SimpleButton></td>
              <td><SimpleButton @click="openModal(ingredient, ModalType.Edit)">編集</SimpleButton></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <FloatingActionButton
      v-if="!isModalOpen"
      @click="openModal(null, ModalType.New)"
      />
    <IngredientEditModal
      v-if="isModalOpen && (activeModal === ModalType.Edit || activeModal === ModalType.New)"
      :ingredient="selectedIngredient"
      @close="closeModal"
      @save="handleSave"
    />
    <ModalsIngredientDetailModal
      v-if="isModalOpen && activeModal === ModalType.Detail"
      :ingredient="selectedIngredient"
      @close="closeModal"
      @save="handleSave"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Pager from '@/components/ui/Pager.vue';
import IngredientEditModal from '@/components/modals/IngredientEditModal.vue';
import SimpleButton from '@/components/ui/SimpleButton.vue';
import FloatingActionButton from '@/components/ui/FloatingActionButton.vue';

import { Ingredient } from '~/types/ingredients';
import Jsona from 'jsona';
import { useIngredient } from '~/composables/useIngredient';
import { fetchIngredients } from '~/components/Ingredients/fetchIngredients';

enum ModalType {
  New = 'new',
  Edit = 'edit',
  Detail = 'detail',
}

const { updateIngredient } = useIngredient();
const isModalOpen = ref(false);
const activeModal = ref<string | null>(null);

const selectedIngredient = ref<Ingredient | null>(null);
const ingredients = ref<Ingredient[]>([]);
const currentPage = ref(1);
const totalPages = ref(0);
const isLoading = ref(false);


const fetchAndPopulateData = async (page: number) => {
  isLoading.value = true;
  const { ingredients: fetchedIngredients, totalPages: fetchedTotalPages } = await fetchIngredients(page);
  ingredients.value = fetchedIngredients;
  console.log(fetchedIngredients)
  totalPages.value = fetchedTotalPages;
  isLoading.value = false;
};

const openModal = (ingredient: Ingredient | null, modalType: ModalType) => {
  if (modalType === ModalType.New) {
    ingredient = {
      name: '',
      remarks: '',
      original_name: '',
      ingredient_nutrients: [] as IngredientNutrient[], // IngredientNutrient型で初期化
    } as Ingredient; // 明示的にIngredient型としてキャスト
  }
  selectedIngredient.value = ingredient;
  isModalOpen.value = true;
  activeModal.value = modalType;
};

const handleSave = async (formData: Ingredient) => {
  const response = await updateIngredient(formData.id, formData);
  if (response) {
    console.log("Ingredient updated:", response);
  } else {
    console.error("Ingredient update failed.");
  }
  closeModal()
  // reload
  fetchAndPopulateData(currentPage.value);
};

const closeModal = () => {
  isModalOpen.value = false;
  activeModal.value = null;
};

const goToPage = (page: number) => {
  currentPage.value = page;
  fetchAndPopulateData(page);
};

fetchAndPopulateData(currentPage.value);
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

