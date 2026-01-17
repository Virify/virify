<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="font-medium text-sm text-muted">Yards</h3>
      <UButton
        variant="outline"
        size="xs"
        icon="i-lucide-plus"
        class="body-sm"
        @click="emit('add')"
      >
        Add Yard
      </UButton>
    </div>

    <!-- Empty state -->
    <div v-if="yards.length === 0" class="rounded-lg border border-dashed border-muted p-6 text-center">
      <UIcon name="i-lucide-fence" class="mx-auto h-10 w-10 text-muted" />
      <p class="mt-2 text-sm text-muted">No yards added yet</p>
    </div>

    <!-- Yard cards (compact list) -->
    <div v-else class="space-y-2">
      <UCard
        v-for="(yard, index) in yards"
        :key="index"
        variant="subtle"
        :ui="{ body: 'p-0' }"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3 min-w-0">
              <UIcon name="i-lucide-fence" class="h-5 w-5 text-muted shrink-0" />
              <div class="min-w-0 flex-1 space-y-0.5">
                <div class="flex items-center gap-2">
                  <span class="font-medium body-sm line-clamp-1">
                    {{ yard.name || `Yard ${index + 1}` }}
                  </span>
                  <UBadge v-if="isYardComplete(yard)" color="primary" variant="subtle" size="md" class="shrink-0">
                    Complete
                  </UBadge>
                </div>
                <p class="text-xs text-muted line-clamp-1">
                  <span v-if="yard.position">
                    {{ formatEnumValue(yard.position) }}
                  </span>
                  <span v-if="yard.facing">
                    <span v-if="yard.position"> · </span>
                    {{ formatEnumValue(yard.facing) }} facing
                  </span>
                  <span v-if="yard.size">
                    <span v-if="yard.position || yard.facing"> · </span>
                    {{ yard.size }}m²
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
  yards: YardData[]
}>()

const emit = defineEmits<{
  add: []
  edit: [index: number]
  remove: [index: number]
}>()

// Helper to check if yard has all required fields
const isYardComplete = (yard: YardData) => {
  return step6Validation.isYardComplete(yard)
}

// Format enum values for display
const formatEnumValue = (value: string) => {
  return value.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ')
}
</script>
