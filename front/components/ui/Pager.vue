<template>
  <div class="pager-container">
    <button @click="goToPage(1)" :disabled="currentPage === 1">«</button>
    <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">前へ</button>

    <span v-for="page in visiblePages" :key="page">
      <button
        @click="goToPage(page)"
        :class="{ active: page === currentPage }"
      >
        {{ page }}
      </button>
    </span>

    <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">次へ</button>
    <button @click="goToPage(totalPages)" :disabled="currentPage === totalPages">»</button>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits } from 'vue';

const props = defineProps<{
  currentPage: number;
  totalPages: number;
}>();

const emit = defineEmits(['page-change']);

// 現在のページの前後2ページを表示する
const visiblePages = computed(() => {
  const start = Math.max(1, props.currentPage - 2);
  const end = Math.min(props.totalPages, start + 4);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

// ページ移動時に親にイベントを通知
const goToPage = (page: number) => {
  if (page !== props.currentPage) {
    emit('page-change', page);
  }
};
</script>

<style scoped>
.pager-container {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin: 10px 0;
}

button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  text-decoration: underline;
  color: #333;
  transition: color 0.2s;
}

button.active {
  font-weight: bold;
  color: #000;
}

button:hover {
  color: #007bff;
}

button:disabled {
  color: #ccc;
  cursor: not-allowed;
}
</style>

