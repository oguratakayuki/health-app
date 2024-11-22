<template>
  <button class="fab" @click.stop="handleClick">
    +
  </button>
</template>

<style scoped>
.fab {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #d8b4fe;
  color: #ffffff;
  font-size: 24px;
  font-weight: bold;
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
</style>

