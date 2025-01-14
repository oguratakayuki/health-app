<template>
  <div class="tag-container">
    <h3>検索キーワード候補</h3>
    <div class="tag-list">
      <button
        v-for="tag in tags"
        :key="tag.id"
        @click="toggleTag(tag.id)"
        :class="{ selected: localSelectedTagIds.includes(tag.id) }"
      >
        + {{ tag.name }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { defineProps, defineEmits } from 'vue';

interface Tag {
  id: number;
  name: string;
}

// Props と Emit を定義
const { tags, selectedTagIds } = defineProps<{
  tags: Tag[]; // タグのリスト
  selectedTagIds: number[]; // 選択されたタグIDのリスト
}>();

const emit = defineEmits(['update:selectedTagIds']); // 親コンポーネントへの通知イベント

// ローカルデータを作成して操作
const localSelectedTagIds = ref([...selectedTagIds]); // 初期値をコピー

// タグの選択・解除処理
const toggleTag = (tagId: number) => {
  const index = localSelectedTagIds.value.indexOf(tagId);
  if (index === -1) {
    localSelectedTagIds.value.push(tagId);
  } else {
    localSelectedTagIds.value.splice(index, 1);
  }
  emit('update:selectedTagIds', localSelectedTagIds.value); // 親コンポーネントに通知
};
</script>

<style scoped>
.tag-container {
  margin-top: 10px;
  text-align: center;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

button {
  background-color: #ccc;
  border: none;
  color: #fff;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.2s;
}

button.selected {
  background-color: #4caf50;
  color: #fff;
}

button:hover {
  background-color: #b0b0b0;
}
</style>

