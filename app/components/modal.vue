<script setup lang="ts">
import { ref, onMounted } from 'vue';

defineProps<{ message: string }>();
const emit = defineEmits(['clear']);
const okButton = ref<HTMLButtonElement | null>(null);

function clearNotification() {
  emit('clear');
}

onMounted(() => {
  if (okButton.value) {
    okButton.value.focus();
  }
});
</script>

<template>
  <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out">
    <div class="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md mx-auto transform transition-transform duration-300 ease-in-out scale-100">
      <p class="font-bold text-lg text-center mb-4">{{ message }}</p>
      <div class="flex justify-center">
        <button ref="okButton" @click="clearNotification" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 transition-colors duration-300 ease-in-out">
          OK
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add any additional styles here */
.bg-black {
  backdrop-filter: blur(5px);
}
</style>