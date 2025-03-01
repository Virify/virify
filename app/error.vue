<script setup lang="ts">
const error = useError();
function clearErrors() {
  clearError();
}
</script>

<template>
  <div class="flex flex-col justify-center items-center h-screen bg-gray-100">
    <div class="bg-white shadow-md rounded-lg w-1/3">
      <h1 v-if="error" class="text-3xl font-bold mb-4 text-red-500">Error {{ error.statusCode }}</h1>
      <p v-if="error" class="text-gray-600 mb-4">{{ error.message }}</p>
      <button  @click="clearErrors" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Clear Error</button>
      <NuxtLink to="/" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Go to Home</NuxtLink>
    </div>
  </div>
</template>