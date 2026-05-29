<template>
  <USlideover
    v-model:open="isOpen"
    :title="bedroom ? `Edit ${bedroom.name || `Bedroom ${bedroomIndex + 1}`}` : 'Edit Bedroom'"
    description="Configure bedroom details"
    :ui="slideoverUiConfig"
  >
    <template #body>
      <UForm v-if="bedroom" ref="formRef" :state="bedroom" class="space-y-6">
        <!-- Name -->
        <UFormField label="Bedroom Name" name="name" description="Please add a bedroom name" required eagerValidation>
          <UInput
            v-model="bedroom.name"
            placeholder="e.g. Master Bedroom, Guest Room"
            size="lg"
            color="secondary"
            class="w-full"
          />
        </UFormField>

        <!-- Floor & Bed Size -->
        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Floor" :name="`property.bedroomFeatures.${bedroomIndex}.floor`" description="Select the floor the room is on" required eagerValidation>
            <USelect
              v-model="bedroom.floor"
              :items="floorOptions"
              size="lg"
              class="w-full"
              color="secondary"
            />
          </UFormField>

          <UFormField label="Bed Size" :name="`property.bedroomFeatures.${bedroomIndex}.bed`" description="Which bed size fits comfortably in this room?" required eagerValidation>
            <USelect
              :model-value="selectedBedSize"
              @update:model-value="setBedSize"
              :items="getBedSizeOptions()"
              placeholder="Select size"
              size="lg"
              color="secondary"
              class="w-full"
            />
          </UFormField>
        </div>

        <!-- Room Size -->
        <UFormField label="Room Size" :name="`property.bedroomFeatures.${bedroomIndex}.size`" description="Size of the bedroom" hint="optional">
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
              class="w-24"
              color="secondary"
            />
          </div>
        </UFormField>

        <!-- Features -->
        <UFormField label="Bedroom Features" :name="`property.bedroomFeatures.${bedroomIndex}.features`" description="Select any additional features" hint="optional">
          <div class="grid grid-cols-2 gap-3 mt-2">
            <UCheckbox
              v-for="feature in getBedroomFeatureOptions()"
              :key="String(feature.value)"
              :id="`bedroom-${bedroomIndex}-feature-${feature.value}`"
              :model-value="bedroom.features?.includes(feature.value as string)"
              @update:model-value="(val: boolean | 'indeterminate') => handleFeatureToggle(feature.value as string, val === true)"
              :label="feature.label"
              color="secondary"
            />
          </div>
        </UFormField>

        <!-- Description -->
        <UFormField label="Description" name="description" description="Add any details about this bedroom" hint="optional">
          <UTextarea
            v-model="bedroom.description"
            placeholder="Describe this bedroom..."
            :rows="3"
            class="w-full"
            color="secondary"
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
          :disabled="!bedroom || !step4Validation.isBedroomComplete(bedroom) || isSaving || isModerating"
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
import { BedSizeType } from '~~/layers/database/server/database/prisma/generated/enums'

const props = defineProps<{
  bedroom: BedroomData | null
  bedroomIndex: number
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

const { moderateFields, isModerating } = useModerateFields()
const formRef = useTemplateRef('formRef')

// Handle done
async function handleDone() {
  if (!props.bedroom) return
  const passed = await moderateFields([
    { name: 'name', value: props.bedroom.name },
    { name: 'description', value: props.bedroom.description },
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
