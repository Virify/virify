<template>
  <div 
    class="relative border rounded-lg overflow-hidden bg-elevated lg:cursor-grab lg:active:cursor-grabbing"
    :class="[
      isMain ? 'border-secondary ring-2 ring-secondary/30' : 'border-default',
      'transition-all duration-200'
    ]"
    :data-id="image.cloudflareId"
  >
    <!-- Main Image Badge -->
    <div 
      v-if="isMain" 
      class="absolute top-0 left-0 z-10 bg-secondary text-white text-xs font-medium px-2 py-0.5 rounded-br-lg"
    >
      Main
    </div>
    
    <!-- Drag Handle (hidden on mobile) -->
    <div class="absolute -bottom-3 left-1/2 -translate-x-1/2 z-10 bg-black/40 text-white rounded p-1 drag-handle hidden lg:block">
      <UIcon name="i-lucide-grip-horizontal" size="xl" />
    </div>

    <!-- Image Preview -->
    <div class="relative aspect-5/4">
      <AtomsCloudFlareImage
        :src="image.cloudflareId"
        :alt="image.description || 'Property image'"
        variant="marker"
        :modifiers="{ fit: 'cover' }"
        class="w-full h-full object-cover"
      />
      
      <!-- Delete Button -->
      <UButton
        icon="i-lucide-x"
        variant="solid"
        size="sm"
        class="absolute top-1 right-1 text-white!"
        :loading="isDeleting"
        :disabled="disabled || isDeleting"
        @click="$emit('delete', image.cloudflareId)"
        :ui="{
          base: 'bg-secondary/100'
        }"
      />
    </div>

    <!-- Image Details -->
    <div class="p-2 space-y-2 pb-6">
      <!-- Description -->
      <UFormField 
        label="Description"
        :name="`property.media.${image.cloudflareId}.description`"
        hint="optional"
      >
        <UInput
          v-model="image.description"
          placeholder="Add a description..."
          color="secondary"
          size="xs"
          class="w-full"
        />
      </UFormField>

      <!-- Room Assignment -->
      <UFormField 
        label="Assign to Room"
        :name="`property.media.${image.cloudflareId}.room`"
        hint="optional"
      >
        <USelect
          :model-value="selectedRoom"
          :items="roomOptions"
          placeholder="Select room..."
          color="secondary"
          size="xs"
          class="w-full"
          @update:model-value="$emit('assign-room', image.cloudflareId, String($event))"
        />
      </UFormField>

      <!-- Position Select -->
      <UFormField 
        label="Position"
        :name="`property.media.${image.cloudflareId}.position`"
      >
        <USelect
          :model-value="position"
          :items="positionOptions"
          color="secondary"
          size="xs"
          class="w-full"
          @update:model-value="$emit('change-position', image.cloudflareId, Number($event))"
        />
      </UFormField>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  image: MediaAssignment
  position: number
  totalInGroup: number
  isMain?: boolean
  isDeleting?: boolean
  disabled?: boolean
  roomOptions: RoomOption[]
  selectedRoom: string
}

const props = defineProps<Props>()

defineEmits<{
  delete: [cloudflareId: string]
  'assign-room': [cloudflareId: string, roomValue: string]
  'change-position': [cloudflareId: string, newPosition: number]
}>()

// Generate position options based on total images in group
const positionOptions = computed(() => {
  return Array.from({ length: props.totalInGroup }, (_, i) => ({
    label: String(i + 1),
    value: i + 1
  }))
})
</script>

<style scoped>
.drag-handle {
  cursor: grab;
}

.drag-handle:active {
  cursor: grabbing;
}
</style>
