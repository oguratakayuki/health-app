<template>
  <ModalTest v-if="showModal" @close="showModal = false" show={{showModal}}>
    <p>モーダルの内容</p>
  </ModalTest>
  <button @click="showModal = true">モーダルを開く</button>
</template>

<script setup>
import ModalTest from '@/components/modals/ModalTest.vue';
const showModal = ref(false);
</script>
