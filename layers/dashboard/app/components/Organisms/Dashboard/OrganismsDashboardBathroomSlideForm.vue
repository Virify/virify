<template>
  <USlideover
    v-model:open="isOpen"
    :title="bathroom ? `Edit ${bathroom.name || `Bathroom ${bathroomIndex + 1}`}` : 'Edit Bathroom'"
    description="Configure bathroom details"
    :ui="slideoverUiConfig"
  >
    <template #body>
      <div v-if="bathroom" class="space-y-6">
        <!-- Name -->
        <UFormField label="Bathroom Name" :name="`property.bathroomFeatures.${bathroomIndex}.name`" description="Please add a bathroom name" required eagerValidation>
          <UInput
            v-model="bathroom.name"
            placeholder="e.g. Master En Suite, Family Bathroom"
            size="lg"
            class="w-full"
          />
        </UFormField>

        <!-- Floor & Room Size -->
        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Floor" :name="`property.bathroomFeatures.${bathroomIndex}.floor`" description="Select the floor the room is on" required eagerValidation>
            <USelect
              v-model="bathroom.floor"
              :items="floorOptions"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Room Size" :name="`property.bathroomFeatures.${bathroomIndex}.size`" description="Size of the bathroom">
            <div class="flex gap-2">
              <UInput
                :model-value="sizeDisplay"
                @update:model-value="updateSize"
                type="number"
                :min="0"
                placeholder="e.g. 6"
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
        </div>

        <!-- Features -->
        <UFormField label="Bathroom Features" :name="`property.bathroomFeatures.${bathroomIndex}.features`" description="Select features in this bathroom">
          <div class="grid grid-cols-2 gap-3 mt-2">
            <UCheckbox
              v-for="feature in getBathroomFeatureOptions()"
              :key="String(feature.value)"
              :id="`bathroom-${bathroomIndex}-feature-${feature.value}`"
              :model-value="bathroom.features?.includes(feature.value as string)"
              @update:model-value="(val: boolean | 'indeterminate') => handleFeatureToggle(feature.value as string, val === true)"
              :label="feature.label"
            />
          </div>
        </UFormField>

        <!-- Description -->
        <UFormField label="Description" :name="`property.bathroomFeatures.${bathroomIndex}.description`" description="Add any details about this bathroom">
          <UTextarea
            v-model="bathroom.description"
            placeholder="Describe this bathroom..."
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
          @click="handleCancel"
        >
          Cancel
        </UButton>
        <UButton
          color="primary"
          variant="solid"
          :disabled="!bathroom || !step4Validation.isBathroomComplete(bathroom) || isSaving"
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
  bathroom: BathroomData | null
  bathroomIndex: number
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
  if (!props.bathroom || props.bathroom.size === null || props.bathroom.size === undefined) {
    return null
  }
  return sizeUnit.value === 'sqft' ? sqmToSqft(props.bathroom.size) : props.bathroom.size
})

// Update size with unit conversion
function updateSize(val: string | number | null) {
  if (!props.bathroom) return
  if (val === null || val === '') {
    props.bathroom.size = null
    return
  }
  const numVal = typeof val === 'string' ? parseFloat(val) : val
  if (isNaN(numVal) || numVal <= 0) {
    props.bathroom.size = null
  } else {
    props.bathroom.size = sizeUnit.value === 'sqft' ? sqftToSqm(numVal) : numVal
  }
}

// Handle feature toggle
function handleFeatureToggle(feature: string, checked: boolean) {
  if (!props.bathroom) return
  props.bathroom.features = toggleRoomFeature(props.bathroom.features, feature, checked)
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
