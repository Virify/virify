<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="font-medium text-sm text-muted">Bedrooms</h3>
      <UButton
        variant="outline"
        size="xs"
        icon="i-lucide-plus"
        class="body-sm"
        @click="emit('add')"
      >
        Add Bedroom
      </UButton>
    </div>

    <!-- Empty state -->
    <div v-if="bedrooms.length === 0" class="rounded-lg border border-dashed border-muted p-6 text-center">
      <UIcon name="i-lucide-bed-double" class="mx-auto h-10 w-10 text-muted" />
      <p class="mt-2 text-sm text-muted">No bedrooms added yet</p>
    </div>

    <!-- Bedroom cards (compact list) -->
    <div v-else class="space-y-2">
      <UCard
        v-for="(bedroom, index) in bedrooms"
        :key="index"
        variant="subtle"
        :ui="{ body: 'p-0' }"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3 min-w-0">
              <UIcon name="i-lucide-bed-double" class="h-5 w-5 text-muted shrink-0" />
              <div class="min-w-0 flex-1 space-y-0.5">
                <div class="flex items-center gap-2">
                  <span class="font-medium body-sm line-clamp-1">
                    {{ bedroom.name || `Bedroom ${index + 1}` }}
                  </span>
                  <UBadge v-if="step4Validation.isBedroomComplete(bedroom)" color="primary" variant="subtle" size="md" class="shrink-0">
                    Complete
                  </UBadge>
                </div>
                <p class="text-xs text-muted line-clamp-1">
                  <template v-if="bedroom.bed[0]">{{ formatBedSize(bedroom.bed[0]) }} bed</template>
                  <span v-if="bedroom.features?.length">
                    <span v-if="bedroom.bed[0]"> · </span>
                    {{ bedroom.features.length }} feature{{ bedroom.features.length > 1 ? 's' : '' }}
                  </span>
                  <span v-if="bedroom.size"> · {{ bedroom.size }}m²</span>
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
  bedrooms: BedroomData[]
}>()

const emit = defineEmits<{
  add: []
  edit: [index: number]
  remove: [index: number]
}>()
</script>
