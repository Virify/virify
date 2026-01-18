<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="font-medium title-xs mb-0!">
        Other Rooms
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
        Add Room
      </UButton>
    </div>

    <!-- Empty state -->
    <div v-if="otherRooms.length === 0" class="rounded-lg border border-dashed border-elevated p-6 text-center">
      <UIcon name="i-lucide-door-open" class="mx-auto h-10 w-10 text-secondary/80" />
      <p class="mt-2 text-sm text-muted italic">No other rooms added yet</p>
    </div>

    <!-- Other room cards (compact list) -->
    <div v-else class="space-y-2">
      <UCard
        v-for="(room, index) in otherRooms"
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
            <div class="flex items-start gap-3 min-w-0">
              <UIcon name="i-lucide-door-open" class="h-5 w-5 text-muted shrink-0 mt-1" />
              <div class="min-w-0 flex-1 space-y-0.5">
                <div class="flex items-center gap-1">
                  <span class="font-medium body-sm line-clamp-1">
                    {{ room.name || `Room ${index + 1}` }}
                  </span>
                  <UBadge v-if="isOtherRoomComplete(room)" color="secondary" variant="subtle" size="md" class="shrink-0">
                    Complete
                  </UBadge>
                </div>
                <p class="text-xs text-muted line-clamp-1 mt-2!">
                  <span v-if="room.type">{{ formatEnumLabel(room.type) }}</span>
                  <span v-if="room.features?.length">
                    <span v-if="room.type"> · </span>
                    {{ room.features.length }} feature{{ room.features.length > 1 ? 's' : '' }}
                  </span>
                  <span v-if="room.size">
                    <span v-if="room.type || room.features?.length"> · </span>
                    {{ room.size }}m²
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
  otherRooms: OtherRoomData[]
}>()

const emit = defineEmits<{
  add: []
  edit: [index: number]
  remove: [index: number]
}>()

function isOtherRoomComplete(room: OtherRoomData): boolean {
  return Boolean(room.name && room.type && room.floor !== null && room.floor !== undefined)
}
</script>
