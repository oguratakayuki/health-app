<template>
  <div class="modal" v-if="show">
    <div class="modal-content">
      <h2 class="modal-title">入力フォーム</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="input1">入力項目1</label>
          <input type="text" id="input1" v-model="inputValue1">
        </div>
        <div class="form-group">
          <label for="input2">入力項目2</label>
          <input type="text" id="input2" v-model="inputValue2">
        </div>
        <button type="submit">決定</button>
      </form>
      <button @click="close">閉じる</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    required: true,
  },
});

defineEmits(['close', 'submit']);

const inputValue1 = ref('');
const inputValue2 = ref('');

const handleSubmit = () => {
  emit('submit', { value1: inputValue1.value, value2: inputValue2.value });
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
  padding: 20px;
  border-radius: 5px;
  width: 30%; /* モーダルの幅を50%に設定 */
  height: 30%; /* モーダルの高さを50%に設定 */


}

.modal-title {
  font-size: 24px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px; /* 各項目間の余白 */
}

/* ラベルと入力欄の間に余白を追加する場合 */
.form-group label {
  display: block;
  margin-bottom: 5px;
}
</style>

