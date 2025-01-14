<template name="IngredientSearchModal">
  <div class="modal" @click="close">
    <div class="modal-content" @click.stop>
      <h2 class="modal-title">検索</h2>
      <!-- タグ検索機能コンポーネントを埋め込む -->
      <input type="text" v-model="localIngredientSearch.name" class="input" />
      <TagSearch 
        :tags="tags"
        :selectedTagIds="localIngredientSearch.tagIds"
        @update:selectedTagIds="updateTagIds"
      />
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
import TagSearch from '~/components/ui/TagSearch.vue';

const emit = defineEmits(['close', 'search']);
const { tags, ingredientSearch } = defineProps<{
  tags: Tag[];
  ingredientSearch: IngredientSearch;
}>()

const localIngredientSearch = ref({
  name: ingredientSearch.name,
  tagIds: [...ingredientSearch.tagIds],
});

const updateTagIds = (newTagIds: number[]) => {
  console.log('newTagIds')
  console.log(newTagIds)
  localIngredientSearch.value.tagIds = newTagIds;
};

const search = () => {
  console.log('search !!!!')
  emit('search', localIngredientSearch.value);
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
