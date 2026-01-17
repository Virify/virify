<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="font-medium text-sm text-muted">Bathrooms</h3>
      <UButton
        type="button"
        variant="outline"
        size="xs"
        icon="i-lucide-plus"
        class="body-sm"
        @click="emit('add')"
      >
        Add Bathroom
      </UButton>
    </div>

    <!-- Empty state -->
    <div v-if="bathrooms.length === 0" class="rounded-lg border border-dashed border-muted p-6 text-center">
      <UIcon name="i-lucide-bath" class="mx-auto h-10 w-10 text-muted" />
      <p class="mt-2 text-sm text-muted">No bathrooms added yet</p>
    </div>

    <!-- Bathroom cards (compact list) -->
    <div v-else class="space-y-2">
      <UCard
        v-for="(bathroom, index) in bathrooms"
        :key="index"
        variant="subtle"
        :ui="{ body: 'p-0' }"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3 min-w-0">
              <UIcon name="i-lucide-bath" class="h-5 w-5 text-muted shrink-0" />
              <div class="min-w-0 flex-1 space-y-0.5">
                <div class="flex items-center gap-2">
                  <span class="font-medium body-sm line-clamp-1">
                    {{ bathroom.name || `Bathroom ${index + 1}` }}
                  </span>
                  <UBadge v-if="step4Validation.isBathroomComplete(bathroom)" color="primary" variant="subtle" size="md" class="shrink-0">
                    Complete
                  </UBadge>
                </div>
                <p class="text-xs text-muted line-clamp-1">
                  <span v-if="bathroom.features?.length">
                    {{ bathroom.features.length }} feature{{ bathroom.features.length > 1 ? 's' : '' }}
                  </span>
                  <span v-if="bathroom.size">
                    <span v-if="bathroom.features?.length"> · </span>
                    {{ bathroom.size }}m²
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
  bathrooms: BathroomData[]
}>()

const emit = defineEmits<{
  add: []
  edit: [index: number]
  remove: [index: number]
}>()
</script>
