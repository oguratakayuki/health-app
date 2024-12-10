<template name="IngredientSearchModal">
  <div class="modal" @click="close">
    <div class="modal-content" @click.stop>
      <h2 class="modal-title">検索</h2>
      <form @submit.prevent="submit">
        <div class="form-group">
          <label for="name">名前</label>
          <p>{{ingredient.name}}</p>
        </div>
      </form>
      <div class="button-group">
        <button class="search-button" @click="search">検索</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ingredient } from '~/types/ingredients';

const emit = defineEmits(['close']);
const {ingredient} = defineProps<{
  ingredient: Ingredient | null
}>()

const search = () => {
  emit('search', 'hoge');
};

const close = () => {
  emit('close');
};
</script>

<style scoped>
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

