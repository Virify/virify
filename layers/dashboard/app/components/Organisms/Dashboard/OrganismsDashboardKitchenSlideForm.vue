<template>
  <USlideover
    v-model:open="isOpen"
    :title="kitchen ? `Edit ${kitchen.name || `Kitchen ${kitchenIndex + 1}`}` : 'Edit Kitchen'"
    description="Configure kitchen details"
    :ui="slideoverUiConfig"
  >
    <template #body>
      <div v-if="kitchen" class="space-y-6">
        <!-- Name -->
        <UFormField label="Kitchen Name" :name="`property.kitchenFeatures.${kitchenIndex}.name`" description="Please add a kitchen name" required eagerValidation>
          <UInput
            v-model="kitchen.name"
            placeholder="e.g. Main Kitchen, Breakfast Kitchen"
            size="lg"
            color="secondary"
            class="w-full"
          />
        </UFormField>

        <!-- Floor -->
        <UFormField label="Floor" :name="`property.kitchenFeatures.${kitchenIndex}.floor`" description="Select the floor the kitchen is on" required eagerValidation>
          <USelect
            v-model="kitchen.floor"
            :items="floorOptions"
            size="lg"
            color="secondary"
            class="w-full"
          />
        </UFormField>

        <!-- Room Size -->
        <UFormField label="Room Size" :name="`property.kitchenFeatures.${kitchenIndex}.size`" description="Size of the kitchen" hint="optional">
          <div class="flex gap-2">
            <UInput
              :model-value="sizeDisplay"
              @update:model-value="updateSize"
              type="number"
              :min="0"
              placeholder="e.g. 20"
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
        <UFormField label="Kitchen Features" :name="`property.kitchenFeatures.${kitchenIndex}.features`" description="Select any additional features" hint="optional">
          <div class="grid grid-cols-2 gap-3 mt-2">
            <UCheckbox
              v-for="feature in getKitchenFeatureOptions()"
              :key="String(feature.value)"
              :id="`kitchen-${kitchenIndex}-feature-${feature.value}`"
              :model-value="kitchen.features?.includes(feature.value as string)"
              @update:model-value="(val: boolean | 'indeterminate') => handleFeatureToggle(feature.value as string, val === true)"
              :label="feature.label"
              color="secondary"
            />
          </div>
        </UFormField>

        <!-- Description -->
        <UFormField label="Description" :name="`property.kitchenFeatures.${kitchenIndex}.description`" description="Add any details about this kitchen" hint="optional">
          <UTextarea
            v-model="kitchen.description"
            placeholder="Describe this kitchen..."
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
          :disabled="!kitchen || !isKitchenComplete(kitchen) || isSaving"
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
  kitchen: KitchenData | null
  kitchenIndex: number
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
  if (!props.kitchen || props.kitchen.size === null || props.kitchen.size === undefined) {
    return null
  }
  return sizeUnit.value === 'sqft' ? sqmToSqft(props.kitchen.size) : props.kitchen.size
})

// Update size with unit conversion
function updateSize(val: string | number | null) {
  if (!props.kitchen) return
  if (val === null || val === '') {
    props.kitchen.size = null
    return
  }
  const numVal = typeof val === 'string' ? parseFloat(val) : val
  if (isNaN(numVal) || numVal <= 0) {
    props.kitchen.size = null
  } else {
    props.kitchen.size = sizeUnit.value === 'sqft' ? sqftToSqm(numVal) : numVal
  }
}

// Handle feature toggle
function handleFeatureToggle(feature: string, checked: boolean) {
  if (!props.kitchen) return
  props.kitchen.features = toggleRoomFeature(props.kitchen.features, feature, checked)
}

// Kitchen complete validation
function isKitchenComplete(kitchen: KitchenData): boolean {
  return Boolean(kitchen.name && kitchen.floor !== null && kitchen.floor !== undefined)
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
