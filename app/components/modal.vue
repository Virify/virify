<script setup lang="ts">
defineProps<{
  message?: string;
}>();
</script>
<template>
  <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
      <div v-if="message" class="mb-4">
        <p>{{ message }}</p>
      </div>
      <slot></slot>
      <div class="flex justify-end mt-4">
        <button @click="$emit('clear')" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Close</button>
      </div>
    </div>
  </div>
</template>