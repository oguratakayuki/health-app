<template>
  <button class="fab" @click.stop="openSearchModal">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="currentColor"
    >
      <circle cx="10" cy="10" r="7" stroke="white" stroke-width="2" fill="none" />
      <line x1="14" y1="14" x2="20" y2="20" stroke="white" stroke-width="2" />
    </svg>
  </button>
</template>

<script setup>
const openSearchModal = () => {
  // モーダルを開く処理（例えばPiniaやVuex、Nuxtのcomposablesで状態を管理）
  console.log("Search modal opened");
};
</script>

<style scoped>
.fab {
  position: fixed;
  bottom: 20px;
  right: 100px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #d8b4fe;
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: none;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  z-index: 5;
}

.fab:hover {
  transform: scale(1.1); /* ホバー時に少し大きく */
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15); /* 影を強調 */
}

svg {
  width: 24px;
  height: 24px;
}
</style>

