<template>
  <OrganismsDashboardCreateListingStepWrapper
    :step-number="4"
    :schema="step4Schema"
    :state="state"
    :is-valid="isFormValid"
    api-endpoint="/api/listings/update/steps/four/"
    :get-submission-data="getSubmissionData"
    @completed="onStepCompleted"
    @saved="onStepSaved"
  >
    <template #alert>
      <UAlert type="info" class="mb-6" color="secondary" variant="subtle" icon="i-lucide-info" close>
        <template #title>
          <h3>Step 4: Bedrooms & Bathrooms</h3>
        </template>
        <template #description>
          <p class="body-sm text-muted">
            Add details about bedrooms and bathrooms in your property. Complete information helps viewers find the right property. It will automatically save as you complete each room.
          </p>
        </template>
      </UAlert>
    </template>

    <!-- Bedrooms Section -->
    <OrganismsDashboardBedroomForm
      :bedrooms="state.property.bedroomFeatures"
      @add="addBedroom"
      @edit="bedroomEditor.open"
      @remove="removeBedroom"
    />

    <!-- Bathrooms Section -->
    <OrganismsDashboardBathroomForm
      :bathrooms="state.property.bathroomFeatures"
      @add="addBathroom"
      @edit="bathroomEditor.open"
      @remove="removeBathroom"
    />

    <!-- Bedroom Editor Slideover -->
    <OrganismsDashboardBedroomSlideForm
      v-model:open="bedroomEditor.isOpen.value"
      :bedroom="bedroomEditor.editingItem.value"
      :bedroom-index="bedroomEditor.editingIndex.value ?? 0"
      :floor-options="floorOptions"
      :is-saving="isSaving"
      @done="handleBedroomDone"
      @cancel="bedroomEditor.cancel"
    />

    <!-- Bathroom Editor Slideover -->
    <OrganismsDashboardBathroomSlideForm
      v-model:open="bathroomEditor.isOpen.value"
      :bathroom="bathroomEditor.editingItem.value"
      :bathroom-index="bathroomEditor.editingIndex.value ?? 0"
      :floor-options="floorOptions"
      :is-saving="isSaving"
      @done="handleBathroomDone"
      @cancel="bathroomEditor.cancel"
    />
  </OrganismsDashboardCreateListingStepWrapper>
</template>

<script setup lang="ts">
const { getStepData, saveRoomData, isSaving } = useCreateListingSteps()

// Get totalFloors from Step 2 data
const step2Data = getStepData(2) as { property?: { totalFloors?: number } } | undefined
const totalFloors = computed(() => step2Data?.property?.totalFloors ?? 1)

// Floor options based on totalFloors
const floorOptions = computed((): FloorOption[] => getFloorOptions(totalFloors.value))

// Initialize state from saved data or empty
const savedData = getStepData(4) as Step4FormData | undefined
const hasValidSavedData = savedData && savedData.property && Array.isArray(savedData.property.bedroomFeatures)
const state = reactive<Step4FormData>(
  hasValidSavedData ? savedData : createInitialStep4Values()
)

// Slideover state
const bedroomEditor = useRoomEditor(state.property.bedroomFeatures)
const bathroomEditor = useRoomEditor(state.property.bathroomFeatures)

// Form validation
const isFormValid = computed(() => step4Validation.isStep4Valid(state))

// Bedroom methods
function addBedroom() {
  const newIndex = state.property.bedroomFeatures.length
  state.property.bedroomFeatures.push({
    name: '',
    roomNumber: newIndex + 1,
    description: null,
    floor: 0,
    bed: [],
    features: [],
    size: null,
  })
  bedroomEditor.isAddingNew.value = true
  bedroomEditor.open(newIndex)
}

async function removeBedroom(index: number) {
  state.property.bedroomFeatures.splice(index, 1)
  state.property.bedroomFeatures.forEach((b, i) => {
    b.roomNumber = i + 1
  })
  await saveRoomProgress('Bedroom removed')
}

// Bathroom methods
function addBathroom() {
  const newIndex = state.property.bathroomFeatures.length
  state.property.bathroomFeatures.push({
    name: '',
    roomNumber: newIndex + 1,
    description: null,
    floor: 0,
    features: [],
    size: null,
  })
  bathroomEditor.isAddingNew.value = true
  bathroomEditor.open(newIndex)
}

async function removeBathroom(index: number) {
  state.property.bathroomFeatures.splice(index, 1)
  state.property.bathroomFeatures.forEach((b, i) => {
    b.roomNumber = i + 1
  })
  await saveRoomProgress('Bathroom removed')
}

async function saveRoomProgress(successMessage?: string) {
  await saveRoomData(
    4,
    '/api/listings/update/steps/four/',
    getSubmissionData(),
    successMessage
  )
}

// Handle bedroom done - save and close
async function handleBedroomDone() {
  const isNew = bedroomEditor.isAddingNew.value
  bedroomEditor.close()
  await saveRoomProgress(isNew ? 'Bedroom added' : 'Bedroom updated')
}

// Handle bathroom done - save and close
async function handleBathroomDone() {
  const isNew = bathroomEditor.isAddingNew.value
  bathroomEditor.close()
  await saveRoomProgress(isNew ? 'Bathroom added' : 'Bathroom updated')
}

// Get submission data
function getSubmissionData() {
  return {
    property: {
      totalFloors: totalFloors.value,
      bedroomFeatures: state.property.bedroomFeatures,
      numberBedrooms: state.property.bedroomFeatures.length,
      bathroomFeatures: state.property.bathroomFeatures,
      numberBathrooms: state.property.bathroomFeatures.length,
    }
  }
}

// Step completion handlers
function onStepCompleted() {
  // Step-specific completion logic if needed
}

function onStepSaved() {
  // Step-specific save logic if needed
}
</script>
