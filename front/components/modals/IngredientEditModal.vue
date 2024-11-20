<template name="IngredientEditModal">
  <div class="modal" @click="close">
    <div class="modal-content" @click.stop>
      <h2 class="modal-title">食材情報</h2>
      <form @submit.prevent="onSubmit">
        <input type="hidden" v-model="values.id" name="id" />

        <!-- Ingredientの基本情報入力 -->
        <div class="form-group">
          <label for="name">名前</label>
          <Field name="name" type="text" id="name" class="input" />
          <ErrorMessage name="name" class="error-message" />
        </div>
        <div class="form-group">
          <label for="remarks">備考</label>
          <Field as="textarea" name="remarks" id="remarks" class="input" />
          <ErrorMessage name="remarks" class="error-message" />
        </div>
        <div class="form-group">
          <label for="original_name">原産地</label>
          <Field name="original_name" type="text" id="original_name" class="input" />
          <ErrorMessage name="original_name" class="error-message" />
        </div>
        <!-- Ingredient Nutrients入力フィールド -->
        <h3>栄養成分</h3>
        <div class="nutrient-container">
          <div v-for="(ingredient_nutrient, index) in values.ingredient_nutrients" :key="ingredient_nutrient.id || index">
            <div v-if="!ingredient_nutrient?._destroy" class="form-group nutrient-group">
              <label>{{ingredient_nutrient.nutrient.name}}</label>
              <input type="number" v-model="ingredient_nutrient.content_quantity" placeholder="含有量" class="input small-input" />
              <input type="text" v-model="ingredient_nutrient.content_unit" placeholder="単位" class="input small-input" />
              <input type="number" v-model="ingredient_nutrient.content_unit_per" placeholder="含有量/単位" class="input small-input" />
              <input type="text" v-model="ingredient_nutrient.content_unit_per_unit" placeholder="単位/成分" class="input small-input" />
              <button type="button" @click="markForDeletion(index)" class="remove-button">削除</button>
           </div>
          </div>
        </div>
        <SimpleButton>保存</SimpleButton>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { useForm, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import SimpleButton from '@/components/ui/SimpleButton.vue';
import { IngredientNutrient, Ingredient } from  '~/types/ingredients';

onBeforeMount(() => {
  console.log("before mount");
  console.log(ingredient)
});


const { ingredient } = defineProps<{
  ingredient: Ingredient | null
}>()

const emit = defineEmits(['close', 'save']);

// バリデーションスキーマ
const schema = yup.object({
  id: yup.number(),
  name: yup.string().required('名前は必須項目です'),
  remarks: yup.string().optional(),
  original_name: yup.string().required('原産地は必須項目です'),
  ingredient_nutrients: yup.array().of(
    yup.object({
      content_quantity: yup.number().required("含有量は必須項目です"),
      content_unit: yup.string().required("単位は必須項目です"),
      content_unit_per: yup.number().required("含有量/単位は必須項目です"),
      content_unit_per_unit: yup.string().required("単位/成分は必須項目です"),
    })
  ).optional()
});

// フォームの初期化
const { handleSubmit, values } = useForm({
  validationSchema: schema,
  initialValues: {
    id: ingredient?.id || null,
    name: ingredient?.name || '',
    remarks: ingredient?.remarks || '',
    original_name: ingredient?.original_name || '',
    ingredient_nutrients: ingredient?.ingredient_nutrients.map(nutrient => ({
      ...nutrient,
      _destroy: false,
    })) || []
  }
});

// Nutrientを追加する関数
const addNutrient = () => {
  values.ingredient_nutrients.push({
    content_quantity: 0,
    content_unit: '',
    content_unit_per: 0,
    content_unit_per_unit: '',
    _destroy: false,
  });
};

// Nutrientを削除する関数
const markForDeletion = (index: number) => {
  const nutrient = values.ingredient_nutrients[index];
  if (nutrient) {
    nutrient._destroy = true;
  }
};

const onSubmit = handleSubmit(values => {
  emit('save', values);
});

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
  padding: 30px;           /* モーダル内の余白を拡大 */
  border-radius: 10px;      /* 丸みを強調 */
  width: 40%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.modal-title {
  font-size: 24px;
  margin-bottom: 30px;      /* タイトルの下に余白を拡大 */
}

.form-group {
  margin-bottom: 20px;      /* 各フォーム要素間の余白を広げる */
  display: flex;
  flex-direction: column;   /* ラベルとフィールドを縦並びに */
}

.input {
  padding: 10px;            /* フィールド内の余白を広げる */
  border: 1px solid #ccc;   /* フィールドのボーダーを追加 */
  border-radius: 5px;       /* フィールドを丸みのある角に */
  font-size: 16px;
  margin-top: 5px;          /* ラベルとフィールドの間に余白 */
}

.error-message {
  color: red;
  font-size: 12px;
  margin-top: 5px;
}

button {
  margin-top: 10px;          /* フォーム末尾のボタンとの間に余白を追加 */
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #45a049;
}

.nutrient-group {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  margin-bottom: 15px;
  padding: 20px;
}

.small-input {
  width: 40px; /* 各入力フィールドの横幅を固定 */
  padding: 5px;
  font-size: 14px;
}

.remove-button {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 5px 10px;
  font-size: 12px;
  cursor: pointer;
  border-radius: 5px;
  flex-shrink: 0; /* 削除ボタンが他の要素の横幅に影響されないように設定 */
}

.remove-button:hover {
  background-color: #d32f2f;
}
.nutrient-container {
  max-height: 300px;
  overflow-y: auto;
  padding-right: 10px; /* スクロールバー非表示用の余白を確保 */
}
/* スクロールバーを非表示にする */
.nutrient-container::-webkit-scrollbar {
  display: none;
}
.nutrient-container {
  -ms-overflow-style: none; /* IE, Edge 用 */
  scrollbar-width: none;    /* Firefox 用 */
}

</style>

