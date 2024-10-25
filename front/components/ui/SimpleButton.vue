<template>
  <button class="simple-button" type="submit">
    <slot />
  </button>
</template>

<style scoped>
.simple-button {
  color: #333;             /* テキスト色 */
  background-color: transparent !important;
  border: none !important;
  border-right: 2px solid black !important;
  border-bottom: 2px solid black !important;
  padding: 10px 20px !important;
  font-size: 16px !important;
  font-weight: 600 !important;
  cursor: pointer;
  transition: all 0.2s ease-in-out !important;
}
/* ホバー時に少し縮む効果を追加 */
.simple-button:hover {
  transform: scale(0.95);         /* 少し縮小 */
}

</style>

