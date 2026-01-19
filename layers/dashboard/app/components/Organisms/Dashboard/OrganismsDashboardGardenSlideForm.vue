<template>
  <USlideover
    v-model:open="isOpen"
    :title="garden ? `Edit ${garden.name || `Garden ${gardenIndex + 1}`}` : 'Edit Garden'"
    description="Configure garden details"
    :ui="slideoverUiConfig"
  >
    <template #body>
      <div v-if="garden" class="space-y-6">
        <!-- Name -->
        <UFormField label="Garden Name" :name="`property.outdoorSpace.garden.${gardenIndex}.name`" description="Please add a garden name" required eagerValidation>
          <UInput
            v-model="garden.name"
            placeholder="e.g. Front Garden, Back Garden"
            size="lg"
            color="secondary"
            class="w-full"
          />
        </UFormField>

        <!-- Position & Facing -->
        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Position" :name="`property.outdoorSpace.garden.${gardenIndex}.position`" description="Select the garden position" eagerValidation hint="optional">
            <USelect
              :model-value="(garden.position as GardenPosition | undefined) ?? undefined"
              @update:model-value="(val) => { if (garden) garden.position = val ?? null }"
              :items="gardenPositionOptions"
              placeholder="Select position"
              size="lg"
              color="secondary"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Facing" :name="`property.outdoorSpace.garden.${gardenIndex}.facing`" description="Select the facing direction" eagerValidation hint="optional">
            <USelect
              :model-value="(garden.facing as GardenFacing | undefined) ?? undefined"
              @update:model-value="(val) => { if (garden) garden.facing = val ?? null }"
              :items="gardenFacingOptions"
              placeholder="Select facing"
              size="lg"
              color="secondary"
              class="w-full"
            />
          </UFormField>
        </div>

        <!-- Size -->
        <UFormField label="Garden Size" :name="`property.outdoorSpace.garden.${gardenIndex}.size`" description="Size of the garden" hint="optional">
          <div class="flex gap-2">
            <UInput
              :model-value="sizeDisplay"
              @update:model-value="updateSize"
              type="number"
              :min="0"
              placeholder="e.g. 50"
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
        <UFormField label="Garden Features" :name="`property.outdoorSpace.garden.${gardenIndex}.features`" description="Select any additional features" hint="optional">
          <div class="grid grid-cols-2 gap-3 mt-2">
            <UCheckbox
              v-for="feature in outdoorSpaceFeatureOptions"
              :key="String(feature.value)"
              :id="`garden-${gardenIndex}-feature-${feature.value}`"
              :model-value="garden.features?.includes(feature.value as string)"
              @update:model-value="(val: boolean | 'indeterminate') => handleFeatureToggle(feature.value as string, val === true)"
              :label="feature.label"
              color="secondary"
            />
          </div>
        </UFormField>

        <!-- Description -->
        <UFormField label="Description" :name="`property.outdoorSpace.garden.${gardenIndex}.description`" description="Add any details about this garden" hint="optional">
          <UTextarea
            v-model="garden.description"
            placeholder="Describe this garden..."
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
          :disabled="!garden || !isGardenValid || isSaving"
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
  garden: GardenData | null
  gardenIndex: number
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
  if (!props.garden || props.garden.size === null || props.garden.size === undefined) {
    return null
  }
  return sizeUnit.value === 'sqft' ? sqmToSqft(props.garden.size) : props.garden.size
})

// Update size with unit conversion
function updateSize(val: string | number | null) {
  if (!props.garden) return
  if (val === null || val === '') {
    props.garden.size = null
    return
  }
  const numVal = typeof val === 'string' ? parseFloat(val) : val
  if (isNaN(numVal) || numVal <= 0) {
    props.garden.size = null
  } else {
    props.garden.size = sizeUnit.value === 'sqft' ? sqftToSqm(numVal) : numVal
  }
}

// Validation
const isGardenValid = computed(() => {
  if (!props.garden) return false
  return step6Validation.isGardenComplete(props.garden)
})

// Handle feature toggle
function handleFeatureToggle(feature: string, checked: boolean) {
  if (!props.garden) return
  props.garden.features = toggleRoomFeature(props.garden.features ?? [], feature, checked)
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
