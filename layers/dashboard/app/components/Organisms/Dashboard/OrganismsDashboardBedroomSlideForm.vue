<template>
  <USlideover
    v-model:open="isOpen"
    :title="bedroom ? `Edit ${bedroom.name || `Bedroom ${bedroomIndex + 1}`}` : 'Edit Bedroom'"
    description="Configure bedroom details"
    :ui="slideoverUiConfig"
  >
    <template #body>
      <div v-if="bedroom" class="space-y-6">
        <!-- Name -->
        <UFormField label="Bedroom Name" :name="`property.bedroomFeatures.${bedroomIndex}.name`" description="Please add a bedroom name" required>
          <UInput
            v-model="bedroom.name"
            placeholder="e.g. Master Bedroom, Guest Room"
            size="lg"
            class="w-full"
          />
        </UFormField>

        <!-- Floor & Bed Size -->
        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Floor" :name="`property.bedroomFeatures.${bedroomIndex}.floor`" description="Select the floor the room is on" required>
            <USelect
              v-model="bedroom.floor"
              :items="floorOptions"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Bed Size" :name="`property.bedroomFeatures.${bedroomIndex}.bed`" description="Select the bed size" required>
            <USelect
              :model-value="selectedBedSize"
              @update:model-value="setBedSize"
              :items="getBedSizeOptions()"
              placeholder="Select size"
              size="lg"
              class="w-full"
            />
          </UFormField>
        </div>

        <!-- Room Size -->
        <UFormField label="Room Size" :name="`property.bedroomFeatures.${bedroomIndex}.size`" description="Size of the bedroom">
          <div class="flex gap-2">
            <UInput
              :model-value="sizeDisplay"
              @update:model-value="updateSize"
              type="number"
              :min="0"
              placeholder="e.g. 15"
              size="lg"
              class="flex-1"
            />
            <USelect
              v-model="sizeUnit"
              :items="sizeUnitItems"
              size="lg"
              class="w-24"
            />
          </div>
        </UFormField>

        <!-- Features -->
        <UFormField label="Bedroom Features" :name="`property.bedroomFeatures.${bedroomIndex}.features`" description="Optional: Select any additional features">
          <div class="grid grid-cols-2 gap-3 mt-2">
            <UCheckbox
              v-for="feature in getBedroomFeatureOptions()"
              :key="String(feature.value)"
              :id="`bedroom-${bedroomIndex}-feature-${feature.value}`"
              :model-value="bedroom.features?.includes(feature.value as string)"
              @update:model-value="(val: boolean | 'indeterminate') => handleFeatureToggle(feature.value as string, val === true)"
              :label="feature.label"
            />
          </div>
        </UFormField>

        <!-- Description -->
        <UFormField label="Description" :name="`property.bedroomFeatures.${bedroomIndex}.description`" description="Add any details about this bedroom">
          <UTextarea
            v-model="bedroom.description"
            placeholder="Describe this bedroom..."
            :rows="3"
            class="w-full"
          />
        </UFormField>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-3 p-4 w-full">
        <UButton
          variant="outline"
          color="neutral"
          size="sm"
          class="body-sm"
          @click="isOpen = false"
        >
          Cancel
        </UButton>
        <UButton
          color="primary"
          variant="solid"
          :disabled="!bedroom || !step4Validation.isBedroomComplete(bedroom) || isSaving"
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
import { BedSizeType } from '~~/layers/database/server/database/prisma/generated/enums'

const props = defineProps<{
  bedroom: BedroomData | null
  bedroomIndex: number
  floorOptions: FloorOption[]
  isSaving?: boolean
}>()

const emit = defineEmits<{
  done: []
}>()

const isOpen = defineModel<boolean>('open', { required: true })

// Size unit tracking (UI only - stored values always in m²)
const sizeUnit = ref<'sqm' | 'sqft'>('sqm')

// Computed bed size for select (validates and narrows type)
const selectedBedSize = computed((): BedSizeType | undefined => {
  const bedValue = props.bedroom?.bed[0]
  if (!bedValue || !Object.values(BedSizeType).includes(bedValue as BedSizeType)) return undefined
  return bedValue as BedSizeType
})

// Computed size display based on unit
const sizeDisplay = computed(() => {
  if (!props.bedroom || props.bedroom.size === null || props.bedroom.size === undefined) {
    return null
  }
  return sizeUnit.value === 'sqft' ? sqmToSqft(props.bedroom.size) : props.bedroom.size
})

// Update size with unit conversion
function updateSize(val: string | number | null) {
  if (!props.bedroom) return
  if (val === null || val === '') {
    props.bedroom.size = null
    return
  }
  const numVal = typeof val === 'string' ? parseFloat(val) : val
  if (isNaN(numVal) || numVal <= 0) {
    props.bedroom.size = null
  } else {
    props.bedroom.size = sizeUnit.value === 'sqft' ? sqftToSqm(numVal) : numVal
  }
}

// Set bed size
function setBedSize(val: string | number | boolean | null) {
  if (!props.bedroom || !val || typeof val === 'boolean') return
  props.bedroom.bed = [String(val)]
}

// Handle feature toggle
function handleFeatureToggle(feature: string, checked: boolean) {
  if (!props.bedroom) return
  props.bedroom.features = toggleRoomFeature(props.bedroom.features, feature, checked)
}

// Handle done
function handleDone() {
  isOpen.value = false
  emit('done')
}
</script>
