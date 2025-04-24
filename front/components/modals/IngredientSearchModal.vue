<template name="IngredientSearchModal">
  <div class="modal" @click="close">
    <div class="modal-content" @click.stop>
      <h2 class="modal-title">検索</h2>

      <!-- タグ検索機能コンポーネントを埋め込む -->
      <input 
        type="text"
        :value="props.ingredientSearch.name"
        @change="updateIngredientSearchName"
        class="input"
        :placeholder="'食材名を入力して下さい'"
      />
      <div>
        <FilterableSelect
          :options="props.tags" 
          :selectedTagIds="props.ingredientSearch.tagIds"
          @update:selected="handleUpdateTagId"
        />
        <p>選択済み: {{ selectedCompanies }}</p>
      </div>
      <div class="button-group">
        <button class="search-button" @click="search">検索</button>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IngredientSearch } from '~/types/ingredientSearch';
import { Tag } from '~/types/tags';

import FilterableSelect from '~/components/ui/FilterableSelect.vue'

const selectedCompanies = ref([])

const updateIngredientSearchName = ($event) => {
  emit('updateIngredientSearchName', $event.target.value)
}

const handleUpdateTagId = (selected) => {
  emit('updateTagIds', selected)
}



const emit = defineEmits(['close', 'search', 'updateIngredientSearchName', 'updateTagIds']);

const props = defineProps<{
  tags: Tag[];
  ingredientSearch: IngredientSearch;
}>()

const search = () => {
  emit('search')
};

const close = () => {
  emit('close');
};
</script>

<style scoped>
.button-group {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
.search-button {
  background-color: #4caf50;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.search-button:hover {
  background-color: #45a049;
}


.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #fff;
  padding: 30px;           /* モーダル内の余白を拡大 */
  border-radius: 10px;      /* 丸みを強調 */
  width: 40%;               /* モーダル幅を少し広げる */
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.modal-title {
  font-size: 24px;
  margin-bottom: 30px;      /* タイトルの下に余白を拡大 */
}

.form-group {
  margin-bottom: 20px;      /* 各フォーム要素間の余白を広げる */
  display: flex;
  flex-direction: column;   /* ラベルとフィールドを縦並びに */
}

.input {
  padding: 10px;            /* フィールド内の余白を広げる */
  border: 1px solid #ccc;   /* フィールドのボーダーを追加 */
  border-radius: 5px;       /* フィールドを丸みのある角に */
  font-size: 16px;
  margin-top: 5px;          /* ラベルとフィールドの間に余白 */
}

.error-message {
  color: red;
  font-size: 12px;
  margin-top: 5px;
}

button {
  margin-top: 10px;          /* フォーム末尾のボタンとの間に余白を追加 */
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #45a049;
}
</style>
