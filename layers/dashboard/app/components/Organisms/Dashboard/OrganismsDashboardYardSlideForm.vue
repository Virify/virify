<template>
  <USlideover
    v-model:open="isOpen"
    :title="yard ? `Edit ${yard.name || `Yard ${yardIndex + 1}`}` : 'Edit Yard'"
    description="Configure yard details"
    :ui="slideoverUiConfig"
  >
    <template #body>
      <div v-if="yard" class="space-y-6">
        <!-- Name -->
        <UFormField label="Yard Name" :name="`property.outdoorSpace.yard.${yardIndex}.name`" description="Please add a yard name" required eagerValidation>
          <UInput
            v-model="yard.name"
            placeholder="e.g. Courtyard, Side Yard"
            size="lg"
            class="w-full"
          />
        </UFormField>

        <!-- Position & Facing -->
        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Position" :name="`property.outdoorSpace.yard.${yardIndex}.position`" description="Select the yard position" eagerValidation>
            <USelect
              :model-value="(yard.position as GardenPosition | undefined) ?? undefined"
              @update:model-value="(val) => { if (yard) yard.position = val ?? null }"
              :items="gardenPositionOptions"
              placeholder="Select position"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Facing" :name="`property.outdoorSpace.yard.${yardIndex}.facing`" description="Select the facing direction" eagerValidation>
            <USelect
              :model-value="(yard.facing as GardenFacing | undefined) ?? undefined"
              @update:model-value="(val) => { if (yard) yard.facing = val ?? null }"
              :items="gardenFacingOptions"
              placeholder="Select facing"
              size="lg"
              class="w-full"
            />
          </UFormField>
        </div>

        <!-- Size -->
        <UFormField label="Yard Size" :name="`property.outdoorSpace.yard.${yardIndex}.size`" description="Size of the yard">
          <div class="flex gap-2">
            <UInput
              :model-value="sizeDisplay"
              @update:model-value="updateSize"
              type="number"
              :min="0"
              placeholder="e.g. 30"
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
        <UFormField label="Yard Features" :name="`property.outdoorSpace.yard.${yardIndex}.features`" description="Optional: Select any additional features">
          <div class="grid grid-cols-2 gap-3 mt-2">
            <UCheckbox
              v-for="feature in outdoorSpaceFeatureOptions"
              :key="String(feature.value)"
              :id="`yard-${yardIndex}-feature-${feature.value}`"
              :model-value="yard.features?.includes(feature.value as string)"
              @update:model-value="(val: boolean | 'indeterminate') => handleFeatureToggle(feature.value as string, val === true)"
              :label="feature.label"
            />
          </div>
        </UFormField>

        <!-- Description -->
        <UFormField label="Description" :name="`property.outdoorSpace.yard.${yardIndex}.description`" description="Add any details about this yard">
          <UTextarea
            v-model="yard.description"
            placeholder="Describe this yard..."
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
          :disabled="!yard || !isYardValid || isSaving"
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
import { GardenPosition, GardenFacing } from '~~/layers/database/server/database/prisma/generated/enums'

const props = defineProps<{
  yard: YardData | null
  yardIndex: number
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
  if (!props.yard || props.yard.size === null || props.yard.size === undefined) {
    return null
  }
  return sizeUnit.value === 'sqft' ? sqmToSqft(props.yard.size) : props.yard.size
})

// Update size with unit conversion
function updateSize(val: string | number | null) {
  if (!props.yard) return
  if (val === null || val === '') {
    props.yard.size = null
    return
  }
  const numVal = typeof val === 'string' ? parseFloat(val) : val
  if (isNaN(numVal) || numVal <= 0) {
    props.yard.size = null
  } else {
    props.yard.size = sizeUnit.value === 'sqft' ? sqftToSqm(numVal) : numVal
  }
}

// Validation
const isYardValid = computed(() => {
  if (!props.yard) return false
  return step6Validation.isYardComplete(props.yard)
})

// Handle feature toggle
function handleFeatureToggle(feature: string, checked: boolean) {
  if (!props.yard) return
  props.yard.features = toggleRoomFeature(props.yard.features ?? [], feature, checked)
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
