<template>
  <UPageCard variant="outline" class="text-center text-gray-500 dark:text-gray-400 bg-elevated body-sm">
    {{ message }}
  </UPageCard>
</template>
<script lang="ts" setup>
  const props = defineProps<{
    type: string
    hasFilters?: boolean
  }>()

  const message = computed(() =>
    props.hasFilters
      ? `No ${props.type} found, try changing your filters.`
      : `No ${props.type} found.`
  )
</script>