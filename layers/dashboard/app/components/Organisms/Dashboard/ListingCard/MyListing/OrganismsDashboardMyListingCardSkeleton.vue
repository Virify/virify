<template>
  <div v-for="n in cards" :key="n">
    <UPageCard
      variant="naked"
      reverse
      class="p-4 border border-accented/50 bg-elevated/30 rounded-lg h-full flex flex-col animate-pulse"
      :ui="{
        header: 'mb-0 w-full',
        title: 'my-1',
        description: 'text-(--foreground-100) w-full flex-1 flex flex-col justify-between',
        footer: 'mt-1 pt-0 w-full',
        body: 'w-full flex flex-col flex-1',
      }"
    >
      <!-- Image Skeleton -->
      <div class="w-full h-54 bg-muted/30 rounded-lg aspect-4/3" />

      <template #header>
        <div class="flex flex-row justify-between items-start">
          <!-- Price Skeleton -->
          <div class="h-6 w-24 bg-muted/30 rounded" />
          
          <!-- Badges Skeleton -->
          <div class="flex gap-1.5">
            <div class="h-6 w-16 bg-muted/30 rounded-full" />
            <div class="h-6 w-16 bg-muted/30 rounded-full" />
          </div>
        </div>
      </template>

      <template #title>
        <!-- Address Skeleton -->
        <div class="h-5 w-full bg-muted/30 rounded" />
      </template>

      <template #description>
        <!-- Features Skeleton -->
        <div class="flex flex-row flex-wrap gap-1 mb-3">
          <div class="h-7 w-16 bg-muted/30 rounded-full" />
          <div class="h-7 w-20 bg-muted/30 rounded-full" />
          <div class="h-7 w-18 bg-muted/30 rounded-full" />
        </div>

        <!-- Analytics Skeleton -->
        <div class="flex items-center gap-3 mb-3">
          <div class="h-5 w-12 bg-muted/30 rounded" />
          <div class="h-5 w-12 bg-muted/30 rounded" />
          <div class="h-5 w-12 bg-muted/30 rounded" />
        </div>

        <!-- Toggle Skeleton -->
        <div class="flex items-center gap-2 mb-3">
          <div class="h-6 w-11 bg-muted/30 rounded-full" />
          <div class="h-4 w-20 bg-muted/30 rounded" />
        </div>

        <!-- Buttons Skeleton -->
        <div class="grid grid-cols-3 gap-2 mt-auto">
          <div class="h-9 bg-muted/30 rounded" />
          <div class="h-9 bg-muted/30 rounded" />
          <div class="h-9 bg-muted/30 rounded" />
        </div>
      </template>
    </UPageCard>
  </div>
</template>

<script setup lang="ts">
interface Props {
  cards?: number;
  view?: 'grid' | 'list';
}

withDefaults(defineProps<Props>(), {
  cards: 3,
  view: 'grid'
});
</script>
