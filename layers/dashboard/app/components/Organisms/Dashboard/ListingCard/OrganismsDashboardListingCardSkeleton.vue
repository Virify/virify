<template>
  <div v-for="i in cards" :key="i" class="h-full">
    <UPageCard variant="naked" class="p-4 border border-accented/50 bg-elevated/50 rounded-lg h-full flex flex-col">
      <USkeleton class="w-full h-54 rounded-lg mb-4 bg-primary/25" />
      <USkeleton class="h-6 w-3/4 mb-2 bg-primary/25" />
      <USkeleton class="h-4 w-1/2 bg-primary/25" />
    </UPageCard>
  </div>
</template>
<script lang="ts" setup>
  withDefaults(defineProps<{
    cards?: number;
  }>(), {
    cards: 2,
  });
</script>