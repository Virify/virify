<template>
  <div v-for="i in cards" :key="i" class="h-full">
    <UPageCard variant="naked" class="p-4 border border-accented/50 bg-elevated/50 rounded-lg h-full flex flex-col gap-0">
      <!-- Image -->
      <USkeleton class="w-full h-54 rounded-lg mb-4" />

      <!-- Price & Badge -->
      <div class="flex justify-between items-start mb-1">
        <USkeleton class="h-6 w-32" />
        <USkeleton class="h-6 w-16 rounded-md" />
      </div>

      <!-- Address -->
      <USkeleton class="h-4 w-3/4 mb-4" />

      <!-- Features Badges -->
      <div class="flex gap-1 mb-6">
        <USkeleton class="h-6 w-16 rounded-md" />
        <USkeleton class="h-6 w-20 rounded-md" />
        <USkeleton class="h-6 w-16 rounded-md" />
      </div>

      <!-- Note Area -->
      <div class="mb-4">
        <USkeleton class="h-4 w-24" />
      </div>

      <!-- Buttons -->
      <div class="grid grid-cols-2 gap-2 mt-auto">
        <USkeleton class="h-9 rounded-md" />
        <USkeleton class="h-9 rounded-md" />
      </div>

      <!-- Footer Date -->
      <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
        <div class="flex justify-between text-xs">
          <USkeleton class="h-3 w-24" />
        </div>
      </div>
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