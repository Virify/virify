<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="font-medium title-xs mb-0!">
        Additional Land
        <span class="body-xs text-(--foreground-200)/60 font-normal">optional</span>
      </h3>
      <UButton
        variant="subtle"
        size="xs"
        icon="i-lucide-plus"
        class="body-sm"
        color="secondary"
        @click="emit('add')"
      >
        Add Land
      </UButton>
    </div>

    <!-- Empty state -->
    <div v-if="landParcels.length === 0" class="rounded-lg border border-dashed border-elevated p-6 text-center">
      <UIcon name="i-lucide-trees" class="mx-auto h-10 w-10 text-secondary/80" />
      <p class="mt-2 text-sm text-muted italic">No additional land added yet</p>
    </div>

    <!-- Land cards (compact list) -->
    <div v-else class="space-y-2">
      <UCard
        v-for="(land, index) in landParcels"
        :key="index"
        variant="subtle"
        :ui="{
          root: 'border border-secondary/30 ring-0!',
          body: 'p-0'
        }"
        class="border-secondary!"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3 min-w-0">
              <UIcon name="i-lucide-trees" class="h-5 w-5 text-muted shrink-0" />
              <div class="min-w-0 flex-1 space-y-0.5">
                <div class="flex items-center gap-2">
                  <span class="font-medium body-sm line-clamp-1">
                    {{ land.name || `Land ${index + 1}` }}
                  </span>
                  <UBadge v-if="isLandComplete(land)" color="secondary" variant="subtle" size="md" class="shrink-0">
                    Complete
                  </UBadge>
                </div>
                <p class="text-xs text-muted line-clamp-1">
                  <span v-if="land.features?.length">
                    {{ land.features.length }} feature{{ land.features.length > 1 ? 's' : '' }}
                  </span>
                  <span v-if="land.size">
                    <span v-if="land.features?.length"> · </span>
                    {{ land.size }}m²
                  </span>
                </p>
              </div>
            </div>
            <div class="flex gap-1">
              <UButton
                type="button"
                variant="ghost"
                color="neutral"
                size="xs"
                icon="i-lucide-pencil"
                @click="emit('edit', index)"
              />
              <UButton
                type="button"
                variant="ghost"
                color="neutral"
                size="xs"
                icon="i-lucide-trash-2"
                @click="emit('remove', index)"
              />
            </div>
          </div>
        </template>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  landParcels: LandData[]
}>()

const emit = defineEmits<{
  add: []
  edit: [index: number]
  remove: [index: number]
}>()

// Helper to check if land has all required fields
const isLandComplete = (land: LandData) => {
  return step6Validation.isLandComplete(land)
}
</script>
