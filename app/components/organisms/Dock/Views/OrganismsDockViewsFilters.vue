<template>
  <div class="| flow">
    <h2 class="| title-md">AI filters</h2>

    <div v-if="isPending">Loading...</div>

    <MoleculesAiSearchFormFilters v-else :initial-query @submit-search="searchSubmit" @reset-search="searchReset" />
  </div>
</template>

<script setup lang="ts">
const initialQuery = ref('')

function searchSubmit(newValue: unknown) {
  console.log('submit-search', newValue);

  togglePending(2000, true)
};

function searchReset() {
  console.log('reset-search')

  togglePending()
}

/**
 *  Allow closing
 */
const emits = defineEmits(['close'])

/**
 *  Mock pending states
 */
const isPending = ref(false)

const togglePending = (timeout = 0, closeAfter = false) => {
  if (import.meta.server) return

  if (isPending.value) return

  isPending.value = true

  setTimeout(() => {
    isPending.value = false

    if (closeAfter) emits('close')
  }, timeout)
}
</script>
