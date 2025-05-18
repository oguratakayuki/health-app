<template>
  <div class="multi-select" @click.stop>
    <input 
      type="text" 
      v-model="searchText" 
      :placeholder="'タグ名を入力して下さい'"
      @input="filterOptions" 
      @focus="showDropdown = true"
      @blur="hideDropdown"
      @keydown.down.prevent="navigate(1)"
      @keydown.up.prevent="navigate(-1)"
      @keydown.enter.prevent="selectHighlighted"
      placeholder="選択肢を入力"
    />
    
    <ul 
      v-if="showDropdown && filteredOptions.length > 0" 
      class="dropdown"
      ref="dropdown"
    >
      <li 
        v-for="(option, index) in filteredOptions" 
        :key="option.id"
        @mousedown.prevent="addSelected(option)"
        :class="{ highlighted: index === highlightedIndex }"
      >
        {{ option.name }}
      </li>
    </ul>

    <div v-if="selectedTagIds.length > 0" class="selected-options">
      <span 
        v-for="optionId in selectedTagIds" 
        :key="optionId" 
        class="selected-item"
      >
        {{ optionName(optionId) }} 
        <button @click="removeOption(optionId)">×</button>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Tag {
  id: number;
  name: string;
}

const props = defineProps<{
  options: Tag[]; // タグのリスト
  selectedTagIds: {
    type: number[],
    default: () => [] // 選択されたタグIDのリスト
  };
}>();

// props.selectedTagIds の値で初期化
const localSelectedTagIds = ref([...props.selectedTagIds]);

const emit = defineEmits(['update:selected'])

const searchText = ref('')
const selectedOptions = ref([])
const highlightedIndex = ref(-1)
const showDropdown = ref(false)
const dropdown = ref(null)

const filteredOptions = computed(() => {
  const temp = props.options.filter(option => 
    option.name.includes(searchText.value)
  )
  const numberSet = new Set(localSelectedTagIds.value?.map(Number))
  // array1 の要素を数値に変換し、array2 に含まれない要素のみを抽出
  return temp.filter(num => !numberSet.has(Number(num.id)))
})

const optionName = (id) => {
  return props.options.find(option => id === option.id).name
};

const filterOptions = () => {
  highlightedIndex.value = -1
}

const addSelected = (option) => {
  localSelectedTagIds.value.push(option.id)
  const newSelected = [...props.selectedTagIds, option.id]
  searchText.value = ''
  showDropdown.value = false
  emit('update:selected', newSelected)
}

const removeOption = (optionId) => {
  const removed = props.selectedTagIds.filter(selectedId => Number(selectedId) !== Number(optionId))
  emit('update:selected', removed)
}

const navigate = (direction) => {
  if (filteredOptions.value.length === 0) return
  highlightedIndex.value = (highlightedIndex.value + direction + filteredOptions.value.length) % filteredOptions.value.length
}

const selectHighlighted = () => {
  if (highlightedIndex.value !== -1) {
    addSelected(filteredOptions.value[highlightedIndex.value])
  }
}

const hideDropdown = () => {
  setTimeout(() => {
    showDropdown.value = false
  }, 200)
}

// モーダル内に収まるよう調整
const adjustDropdownPosition = () => {
  if (dropdown.value) {
    const rect = dropdown.value.getBoundingClientRect()
    const modalRect = document.querySelector('.modal-container')?.getBoundingClientRect()

    if (modalRect && rect.bottom > modalRect.bottom) {
      dropdown.value.style.top = `-${rect.height}px`
    } else {
      dropdown.value.style.top = '100%'
    }
  }
}

onMounted(() => {
  window.addEventListener('resize', adjustDropdownPosition)
})

onUnmounted(() => {
  window.removeEventListener('resize', adjustDropdownPosition)
})
</script>

<style scoped>
.multi-select {
  position: relative;
  width: 300px;
}
input {
  padding: 10px;            /* フィールド内の余白を広げる */
  border: 1px solid #ccc;   /* フィールドのボーダーを追加 */
  border-radius: 5px;       /* フィールドを丸みのある角に */
  font-size: 16px;
  margin-top: 5px;          /* ラベルとフィールドの間に余白 */
}

.dropdown {
  list-style: none;
  padding: 0;
  margin: 0;
  border: 1px solid #ccc;
  position: fixed; /* モーダル内に収まるように */
  background: white;
  z-index: 9999;
  max-height: 200px;
  overflow-y: auto;
  width: 280px;
}
.dropdown li {
  padding: 8px;
  cursor: pointer;
}
.dropdown li:hover, .highlighted {
  background: #ddd;
}
.selected-options {
  margin-top: 10px;
}
.selected-item {
  display: inline-block;
  padding: 5px;
  margin: 2px;
  background: #007bff;
  color: white;
  cursor: pointer;
  border-radius: 15px;
  justify-content: center;
  transition: background-color 0.2s;
}
.selected-item button {
  background: none;
  border: none;
  color: white;
  margin-left: 5px;
  cursor: pointer;
}
.modal-container {
  position: relative;
  overflow: hidden; /* モーダルの外にはみ出さないように */
}
</style>
