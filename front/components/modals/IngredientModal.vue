<template name="IngredientModal">
  <div class="modal" @click="close">
    <div class="modal-content">
      <h2 class="modal-title">食材情報</h2>
      <form @submit.prevent="save">
        <div class="form-group">
          <label for="name">名前</label>
          <input type="text" id="name" v-model="ingredient.name" />
        </div>
        <div class="form-group">
          <label for="remarks">備考</label>
          <textarea id="remarks" v-model="ingredient.remarks"></textarea>
        </div>
        <div class="form-group">
          <label for="original_name">原産地</label>
          <input type="text" id="original_name" v-model="ingredient.original_name" />
        </div>
        <button type="submit">保存</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">

interface Ingredient {
  id: number;
  name: string;
  remarks: string;
  original_name: string;
}

defineProps<{
  ingredient: Ingredient
}>()

const emit = defineEmits(['close', 'save']);

const save = async (value) => {
  // API呼び出しで保存処理を実行
  try {
    console.log(value);
    // ...
    emit('save', ingredient);
  } catch (error) {
    console.error(error);
  }
};

const close = () => {
  // emit('close');
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
  padding: 20px;
  border-radius: 5px;
  width: 20%; /* モーダルの幅を50%に設定 */
  height: 30%; /* モーダルの高さを50%に設定 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;


}

.modal-title {
  font-size: 24px;
  margin-bottom: 20px;
}



.form-group {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.form-group label {
  margin-right: 10px; /* ラベルの右側に10pxの余白 */
}

</style>

