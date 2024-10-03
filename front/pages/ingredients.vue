<template>
  <div>
    <h2>Ingredients</h2>
    <table border="1" cellpadding="10">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Remarks</th>
          <th>Original Name</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="ingredient in ingredients.ingredients" :key="ingredient.id">
          <td>{{ ingredient.id }}</td>
          <td>{{ ingredient.name || 'No Name Available' }}</td>
          <td>{{ ingredient.remarks || 'No Remarks Available' }}</td>
          <td>{{ ingredient.original_name || 'No Original' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
const { data: ingredients, pending, error } = await useFetch('http://localhost:3009/api/v1/ingredients?hoge=1');
</script>

