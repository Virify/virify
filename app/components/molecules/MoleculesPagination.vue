<template>
  <!-- Pagination Controls -->
  <div class="pagination">
    <button class="| button button-sm" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">
      Previous
    </button>
    <span class="| body-sm">Page {{ currentPage }}</span>
    <button class="| button button-sm" @click="changePage(currentPage + 1)" :disabled="!hasMore">
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
  hasMore: {
    type: Boolean,
    required: true,
  },
});
const emit = defineEmits(['update:currentPage']);

function changePage(newPage: number) {
  if (newPage < 1 || (!props.hasMore && newPage > props.currentPage)) return;
  emit('update:currentPage', newPage);
}
</script>
