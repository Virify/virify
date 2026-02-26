<template>
  <USlideover
    v-model:open="isOpen"
    :title="otherRoom ? `Edit ${otherRoom.name || `Room ${otherRoomIndex + 1}`}` : 'Edit Room'"
    description="Configure room details"
    :ui="slideoverUiConfig"
  >
    <template #body>
      <div v-if="otherRoom" class="space-y-6">
        <!-- Name -->
        <UFormField label="Room Name" :name="`property.otherRoom.${otherRoomIndex}.name`" description="Please add a room name" required eagerValidation>
          <UInput
            v-model="otherRoom.name"
            placeholder="e.g. Home Office, Gym"
            size="lg"
            color="secondary"
            class="w-full"
          />
        </UFormField>

        <!-- Floor & Type -->
        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Floor" :name="`property.otherRoom.${otherRoomIndex}.floor`" description="Select the floor the room is on" required eagerValidation>
            <USelect
              v-model="otherRoom.floor"
              :items="floorOptions"
              size="lg"
              color="secondary"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Room Type" :name="`property.otherRoom.${otherRoomIndex}.type`" description="Type of room" required eagerValidation>
            <USelect
              v-model="otherRoom.type"
              :items="getOtherRoomTypeOptions()"
              placeholder="Select type"
              size="lg"
              color="secondary"
              class="w-full"
            />
          </UFormField>
        </div>

        <!-- Room Size -->
        <UFormField label="Room Size" :name="`property.otherRoom.${otherRoomIndex}.size`" description="Size of the room" hint="optional">
          <div class="flex gap-2">
            <UInput
              :model-value="sizeDisplay"
              @update:model-value="updateSize"
              type="number"
              :min="0"
              placeholder="e.g. 15"
              size="lg"
              color="secondary"
              class="flex-1"
            />
            <USelect
              v-model="sizeUnit"
              :items="sizeUnitItems"
              size="lg"
              color="secondary"
              class="w-24"
            />
          </div>
        </UFormField>

        <!-- Features -->
        <UFormField label="Room Features" :name="`property.otherRoom.${otherRoomIndex}.features`" description="Select any additional features" hint="optional">
          <div class="grid grid-cols-2 gap-3 mt-2">
            <UCheckbox
              v-for="feature in getOtherRoomFeatureOptions()"
              :key="String(feature.value)"
              :id="`otherroom-${otherRoomIndex}-feature-${feature.value}`"
              :model-value="otherRoom.features?.includes(feature.value as string)"
              @update:model-value="(val: boolean | 'indeterminate') => handleFeatureToggle(feature.value as string, val === true)"
              :label="feature.label"
              color="secondary"
            />
          </div>
        </UFormField>

        <!-- Description -->
        <UFormField label="Description" :name="`property.otherRoom.${otherRoomIndex}.description`" description="Add any details about this room" hint="optional">
          <UTextarea
            v-model="otherRoom.description"
            placeholder="Describe this room..."
            :rows="3"
            color="secondary"
            class="w-full"
          />
        </UFormField>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-3 p-4 w-full">
        <UButton
          variant="outline"
          color="secondary"
          size="sm"
          class="body-sm"
          @click="handleCancel"
        >
          Cancel
        </UButton>
        <UButton
          color="secondary"
          variant="solid"
          :disabled="!otherRoom || !isOtherRoomComplete(otherRoom) || isSaving"
          :loading="isSaving"
          class="body-sm text-white!"
          @click="handleDone"
        >
          Save
        </UButton>
      </div>
    </template>
  </USlideover>
</template>

<script setup lang="ts">
const props = defineProps<{
  otherRoom: OtherRoomData | null
  otherRoomIndex: number
  floorOptions: FloorOption[]
  isSaving?: boolean
}>()

const emit = defineEmits<{
  done: []
  cancel: []
}>()

const isOpen = defineModel<boolean>('open', { required: true })

// Size unit tracking (UI only - stored values always in m²)
const sizeUnit = ref<'sqm' | 'sqft'>('sqm')

// Computed size display based on unit
const sizeDisplay = computed(() => {
  if (!props.otherRoom || props.otherRoom.size === null || props.otherRoom.size === undefined) {
    return null
  }
  return sizeUnit.value === 'sqft' ? sqmToSqft(props.otherRoom.size) : props.otherRoom.size
})

// Update size with unit conversion
function updateSize(val: string | number | null) {
  if (!props.otherRoom) return
  if (val === null || val === '') {
    props.otherRoom.size = null
    return
  }
  const numVal = typeof val === 'string' ? parseFloat(val) : val
  if (isNaN(numVal) || numVal <= 0) {
    props.otherRoom.size = null
  } else {
    props.otherRoom.size = sizeUnit.value === 'sqft' ? sqftToSqm(numVal) : numVal
  }
}

// Handle feature toggle
function handleFeatureToggle(feature: string, checked: boolean) {
  if (!props.otherRoom) return
  props.otherRoom.features = toggleRoomFeature(props.otherRoom.features, feature, checked)
}

// Other room complete validation
function isOtherRoomComplete(room: OtherRoomData): boolean {
  return Boolean(room.name && room.type && room.floor !== null && room.floor !== undefined)
}

// Handle done
function handleDone() {
  isOpen.value = false
  emit('done')
}

// Handle cancel
function handleCancel() {
  isOpen.value = false
  emit('cancel')
}
</script>
