<template>
  <USlideover
    v-model:open="isOpen"
    :title="land ? `Edit ${land.name || `Land ${landIndex + 1}`}` : 'Edit Land'"
    description="Configure land parcel details"
    :ui="slideoverUiConfig"
  >
    <template #body>
      <UForm v-if="land" ref="formRef" :state="land" class="space-y-6">
        <!-- Name -->
        <UFormField label="Land Name" name="name" description="Please add a land parcel name" required eagerValidation>
          <UInput
            v-model="land.name"
            placeholder="e.g. Paddock, Woodland"
            size="lg"
            color="secondary"
            class="w-full"
          />
        </UFormField>

        <!-- Size -->
        <UFormField label="Land Size" :name="`property.outdoorSpace.land.${landIndex}.size`" description="Size of the land parcel" hint="optional">
          <div class="flex gap-2">
            <UInput
              :model-value="sizeDisplay"
              @update:model-value="updateSize"
              type="number"
              :min="0"
              placeholder="e.g. 500"
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
        <UFormField label="Land Features" :name="`property.outdoorSpace.land.${landIndex}.features`" description="Select any additional features" hint="optional">
          <div class="grid grid-cols-2 gap-3 mt-2">
            <UCheckbox
              v-for="feature in landFeatureOptions"
              :key="String(feature.value)"
              :id="`land-${landIndex}-feature-${feature.value}`"
              :model-value="land.features?.includes(feature.value as string)"
              @update:model-value="(val: boolean | 'indeterminate') => handleFeatureToggle(feature.value as string, val === true)"
              :label="feature.label"
              color="secondary"
            />
          </div>
        </UFormField>

        <!-- Description -->
        <UFormField label="Description" name="description" description="Add any details about this land parcel" hint="optional">
          <UTextarea
            v-model="land.description"
            placeholder="Describe this land..."
            :rows="3"
            color="secondary"
            class="w-full"
          />
        </UFormField>
      </UForm>
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
          :disabled="!land || !isLandValid || isSaving || isModerating"
          :loading="isSaving || isModerating"
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
  land: LandData | null
  landIndex: number
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
  if (!props.land || props.land.size === null || props.land.size === undefined) {
    return null
  }
  return sizeUnit.value === 'sqft' ? sqmToSqft(props.land.size) : props.land.size
})

// Update size with unit conversion
function updateSize(val: string | number | null) {
  if (!props.land) return
  if (val === null || val === '') {
    props.land.size = null
    return
  }
  const numVal = typeof val === 'string' ? parseFloat(val) : val
  if (isNaN(numVal) || numVal <= 0) {
    props.land.size = null
  } else {
    props.land.size = sizeUnit.value === 'sqft' ? sqftToSqm(numVal) : numVal
  }
}

// Validation
const isLandValid = computed(() => {
  if (!props.land) return false
  return step6Validation.isLandComplete(props.land)
})

// Handle feature toggle
function handleFeatureToggle(feature: string, checked: boolean) {
  if (!props.land) return
  props.land.features = toggleRoomFeature(props.land.features ?? [], feature, checked)
}

const { moderateFields, isModerating } = useModerateFields()
const formRef = useTemplateRef('formRef')

// Handle done
async function handleDone() {
  if (!props.land) return
  const passed = await moderateFields([
    { name: 'name', value: props.land.name },
    { name: 'description', value: props.land.description },
  ], formRef as any)
  if (!passed) return
  isOpen.value = false
  emit('done')
}

// Handle cancel
function handleCancel() {
  isOpen.value = false
  emit('cancel')
}
</script>
