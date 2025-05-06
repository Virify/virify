<template>
  <!-- Pagination Controls -->
  <div class="pagination">
    <button class="| button button-sm" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">
      Previous
    </button>
    <span class="| body-sm">Page {{ currentPage }}</span>
    <button class="| button button-sm" @click="changePage(currentPage + 1)" :disabled="!hasMoreListings">
      Next
    </button>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  hasMoreListings: {
    type: Boolean,
    required: true,
  },
});
const emit = defineEmits(['update:currentPage']);

function changePage(newPage: number) {
  if (newPage < 1 || (!props.hasMoreListings && newPage > props.currentPage)) return;
  emit('update:currentPage', newPage);
}
</script>
