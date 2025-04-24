<template>
  <div class="tag-container">
    <h3>検索キーワード候補</h3>
    <div class="tag-list">
      <button
        v-for="tag in filteredTags"
        :key="tag.id"
        v-on:click.prevent="removeTag(tag.id)"
        class="selected"
      >
        {{ tag.name }} x
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

// タグの解除処理
const removeTag = (tagId: number) => {
  // localSelectedTagIdsが同期できていないので、動いていない
  // TODO selectedTagIdsに対してtagIdを指定して、これを除いた配列を作ってemit
  console.log(`localSelectedTagIds.value ${localSelectedTagIds.value}`)
  console.log(localSelectedTagIds.value)
  const index = localSelectedTagIds.value.indexOf(tagId);
  localSelectedTagIds.value.splice(index, 1);
  // TODO 動いていない
  emit('update:selectedTagIds', localSelectedTagIds.value); // 親コンポーネントに通知
};

const filteredTags = computed(() => {
  console.log(selectedTagIds)
  return tags.filter(tag => selectedTagIds.includes(tag.id));
});
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

