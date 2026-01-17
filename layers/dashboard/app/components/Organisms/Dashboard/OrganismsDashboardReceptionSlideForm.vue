<template>
  <USlideover
    v-model:open="isOpen"
    :title="reception ? `Edit ${reception.name || `Reception ${receptionIndex + 1}`}` : 'Edit Reception'"
    description="Configure reception room details"
    :ui="slideoverUiConfig"
  >
    <template #body>
      <div v-if="reception" class="space-y-6">
        <!-- Name -->
        <UFormField label="Reception Name" :name="`property.reception.${receptionIndex}.name`" description="Please add a reception name" required eagerValidation>
          <UInput
            v-model="reception.name"
            placeholder="e.g. Living Room, Lounge"
            size="lg"
            class="w-full"
          />
        </UFormField>

        <!-- Floor & Type -->
        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Floor" :name="`property.reception.${receptionIndex}.floor`" description="Select the floor the room is on" required eagerValidation>
            <USelect
              v-model="reception.floor"
              :items="floorOptions"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Reception Type" :name="`property.reception.${receptionIndex}.type`" description="Type of reception" required eagerValidation>
            <USelect
              v-model="reception.type"
              :items="getReceptionTypeOptions()"
              placeholder="Select type"
              size="lg"
              class="w-full"
            />
          </UFormField>
        </div>

        <!-- Room Size -->
        <UFormField label="Room Size" :name="`property.reception.${receptionIndex}.size`" description="Size of the reception">
          <div class="flex gap-2">
            <UInput
              :model-value="sizeDisplay"
              @update:model-value="updateSize"
              type="number"
              :min="0"
              placeholder="e.g. 25"
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
        <UFormField label="Reception Features" :name="`property.reception.${receptionIndex}.features`" description="Optional: Select any additional features">
          <div class="grid grid-cols-2 gap-3 mt-2">
            <UCheckbox
              v-for="feature in getReceptionFeatureOptions()"
              :key="String(feature.value)"
              :id="`reception-${receptionIndex}-feature-${feature.value}`"
              :model-value="reception.features?.includes(feature.value as string)"
              @update:model-value="(val: boolean | 'indeterminate') => handleFeatureToggle(feature.value as string, val === true)"
              :label="feature.label"
            />
          </div>
        </UFormField>

        <!-- Description -->
        <UFormField label="Description" :name="`property.reception.${receptionIndex}.description`" description="Add any details about this reception">
          <UTextarea
            v-model="reception.description"
            placeholder="Describe this reception..."
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
          :disabled="!reception || !isReceptionComplete(reception) || isSaving"
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
  reception: ReceptionData | null
  receptionIndex: number
  floorOptions: FloorOption[]
  isSaving?: boolean
}>()

const emit = defineEmits<{
  done: []
}>()

const isOpen = defineModel<boolean>('open', { required: true })

// Size unit tracking (UI only - stored values always in m²)
const sizeUnit = ref<'sqm' | 'sqft'>('sqm')

// Computed size display based on unit
const sizeDisplay = computed(() => {
  if (!props.reception || props.reception.size === null || props.reception.size === undefined) {
    return null
  }
  return sizeUnit.value === 'sqft' ? sqmToSqft(props.reception.size) : props.reception.size
})

// Update size with unit conversion
function updateSize(val: string | number | null) {
  if (!props.reception) return
  if (val === null || val === '') {
    props.reception.size = null
    return
  }
  const numVal = typeof val === 'string' ? parseFloat(val) : val
  if (isNaN(numVal) || numVal <= 0) {
    props.reception.size = null
  } else {
    props.reception.size = sizeUnit.value === 'sqft' ? sqftToSqm(numVal) : numVal
  }
}

// Handle feature toggle
function handleFeatureToggle(feature: string, checked: boolean) {
  if (!props.reception) return
  props.reception.features = toggleRoomFeature(props.reception.features, feature, checked)
}

// Reception complete validation
function isReceptionComplete(reception: ReceptionData): boolean {
  return Boolean(reception.name && reception.type && reception.floor !== null && reception.floor !== undefined)
}

// Handle done
function handleDone() {
  isOpen.value = false
  emit('done')
}
</script>
