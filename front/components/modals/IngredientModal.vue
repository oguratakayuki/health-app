<template name="IngredientModal">
  <div class="modal" @click="close">
    <div class="modal-content" @click.stop>
      <h2 class="modal-title">食材情報</h2>
      <form @submit.prevent="onSubmit">
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
        <button type="submit">保存</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useForm, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';

interface Ingredient {
  id: number;
  name: string;
  remarks: string;
  original_name: string;
}

const {ingredient} = defineProps<{
  ingredient: Ingredient | null
}>()

const emit = defineEmits(['close', 'save']);

const schema = yup.object({
  name: yup.string().required('名前は必須項目です'),
  remarks: yup.string().optional(),
  original_name: yup.string().required('原産地は必須項目です'),
});

const { handleSubmit, values } = useForm({
  validationSchema: schema,
  initialValues: {
    name: ingredient?.name || '',
    remarks: ingredient?.remarks || '',
    original_name: ingredient?.original_name || ''
  }
});

const onSubmit = handleSubmit(values=>{
  emit('save', values);
})

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
  width: 20%; /* モーダルの幅を50%に設定 */
  height: 30%; /* モーダルの高さを50%に設定 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;


}

.modal-title {
  font-size: 24px;
  margin-bottom: 20px;
}



.form-group {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.form-group label {
  margin-right: 10px; /* ラベルの右側に10pxの余白 */
}

</style>

