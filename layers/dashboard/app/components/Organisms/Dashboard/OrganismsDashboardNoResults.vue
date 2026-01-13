<template>
  <UPageCard variant="outline" class="text-center text-gray-500 dark:text-gray-400 bg-elevated body-sm">
    {{ description }}
  </UPageCard>
</template>
<script lang="ts" setup>
  defineProps<{
    description: string
  }>()
</script>