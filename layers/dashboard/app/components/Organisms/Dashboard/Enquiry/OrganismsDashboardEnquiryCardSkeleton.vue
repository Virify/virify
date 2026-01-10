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
      <div :class="[
        'grid gap-4 w-full',
        view === 'list' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'
      ]">
        <!-- Listing Card Skeleton -->
        <div class="flex gap-3 p-3 h-auto w-full rounded-lg bg-elevated border border-gray-100 dark:border-gray-800">
          <USkeleton class="w-16 h-full aspect-4/3 rounded-md shrink-0" />
          <div class="flex-1 space-y-1">
            <div class="flex items-center justify-between gap-2 mb-1">
              <USkeleton class="h-6 w-20" />
              <USkeleton class="h-6 w-16" />
            </div>
            <USkeleton class="h-4 w-24 mb-1" />
            <USkeleton class="h-4 w-full mb-2" />
            <div class="flex gap-3">
              <USkeleton class="h-3.5 w-8" />
              <USkeleton class="h-3.5 w-8" />
              <USkeleton class="h-3.5 w-8" />
            </div>
          </div>
        </div>

        <!-- Message Skeleton -->
        <div class="flex flex-col gap-3 p-3 rounded-lg bg-elevated border border-gray-100 dark:border-gray-800">
          <div class="flex items-start gap-2 flex-1">
            <USkeleton class="h-4 w-4 mt-0.5 rounded-full" />
            <div class="flex-1 min-w-0">
              <USkeleton class="h-4 w-16 mb-1" />
              <USkeleton class="h-5 w-full mb-1" />
              <USkeleton class="h-5 w-2/3" />
            </div>
          </div>
          <div class="flex items-center justify-between mt-auto">
            <div class="flex items-center gap-2">
              <USkeleton class="h-4 w-4" />
              <USkeleton class="h-4 w-12" />
            </div>
            <USkeleton class="h-7 w-20" />
          </div>
        </div>
      </div>
    </template>
  </UPageCard>
</template>

<script setup lang="ts">
  /**
   * Dashboard Enquiry Card Skeleton
   */
  withDefaults(defineProps<{
      cards?: number;
      view?: 'grid' | 'list';
  }>(), {
    cards: 3,
    view: 'grid'
  })
</script>