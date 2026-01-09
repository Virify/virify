<template>
  <UPageCard
    v-for="i in cards" 
    :key="i"
    variant="outline"
    :ui="{
      root: 'cursor-pointer gap-2!',
      header: 'body-sm w-full flex justify-between items-center mb-2',
      body: 'w-full',
      container: 'p-4!',
    }"
  >
    <template #header>
      <div class="flex items-center gap-2">
        <USkeleton class="h-8 w-8 rounded-full" />
        <USkeleton class="h-4 w-24" />
      </div>
      <USkeleton class="h-4 w-16" />
    </template>
    <template #body>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <!-- Listing Card Skeleton -->
        <div class="flex gap-3 p-3 h-auto w-full rounded-lg bg-elevated border border-gray-100 dark:border-gray-800">
          <USkeleton class="w-16 h-full aspect-4/3 rounded-md shrink-0" />
          <div class="flex-1 space-y-2">
            <div class="flex justify-between">
              <USkeleton class="h-5 w-20" />
              <USkeleton class="h-5 w-16 rounded-full" />
            </div>
            <USkeleton class="h-3 w-24" />
            <USkeleton class="h-3 w-full" />
            <div class="flex gap-2">
              <USkeleton class="h-3 w-8" />
              <USkeleton class="h-3 w-8" />
              <USkeleton class="h-3 w-8" />
            </div>
          </div>
        </div>

        <!-- Message Skeleton -->
        <div class="flex flex-col gap-3 p-3 rounded-lg bg-elevated border border-gray-100 dark:border-gray-800">
          <div class="flex items-start gap-2 flex-1">
            <USkeleton class="h-4 w-4 rounded-full" />
            <div class="flex-1 space-y-2">
              <USkeleton class="h-3 w-24" />
              <USkeleton class="h-3 w-full" />
              <USkeleton class="h-3 w-2/3" />
            </div>
          </div>
          <div class="flex items-center justify-between mt-auto">
            <USkeleton class="h-4 w-20" />
            <USkeleton class="h-6 w-16" />
          </div>
        </div>
      </div>
    </template>
  </UPageCard>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  cards?: number
}>(), {
  cards: 3
})
</script>