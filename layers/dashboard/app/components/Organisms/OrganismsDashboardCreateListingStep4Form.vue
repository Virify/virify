<template>
  <OrganismsDashboardCreateListingStepWrapper
    :step-number="4"
    alert-title="Step 4: Bedrooms & Bathrooms"
    alert-description="Add details about bedrooms and bathrooms in your property. Complete information helps viewers find the right property. It will automatically save as you complete each room."
    :schema="step4Schema"
    :state="state"
    :is-valid="isFormValid"
    api-endpoint="/api/draft-listings/update/steps/four/"
    :get-submission-data="getSubmissionData"
    @completed="onStepCompleted"
    @saved="onStepSaved"
  >
    <!-- Bedrooms Section -->
    <OrganismsDashboardBedroomForm
      :bedrooms="state.property.bedroomFeatures"
      @add="addBedroom"
      @edit="openBedroomEditor"
      @remove="removeBedroom"
    />

    <!-- Bathrooms Section -->
    <OrganismsDashboardBathroomForm
      :bathrooms="state.property.bathroomFeatures"
      @add="addBathroom"
      @edit="openBathroomEditor"
      @remove="removeBathroom"
    />

    <!-- Bedroom Editor Slideover -->
    <OrganismsDashboardBedroomSlideForm
      v-model:open="bedroomEditorOpen"
      :bedroom="editingBedroom"
      :bedroom-index="editingBedroomIndex ?? 0"
      :floor-options="floorOptions"
      :is-saving="isSaving"
      @done="handleBedroomDone"
    />

    <!-- Bathroom Editor Slideover -->
    <OrganismsDashboardBathroomSlideForm
      v-model:open="bathroomEditorOpen"
      :bathroom="editingBathroom"
      :bathroom-index="editingBathroomIndex ?? 0"
      :floor-options="floorOptions"
      :is-saving="isSaving"
      @done="handleBathroomDone"
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
const bedroomEditorOpen = ref(false)
const bathroomEditorOpen = ref(false)
const editingBedroomIndex = ref<number | null>(null)
const editingBathroomIndex = ref<number | null>(null)

// Computed refs for currently editing rooms
const editingBedroom = computed((): BedroomData | null => 
  editingBedroomIndex.value !== null 
    ? state.property.bedroomFeatures[editingBedroomIndex.value] ?? null
    : null
)

const editingBathroom = computed((): BathroomData | null => 
  editingBathroomIndex.value !== null 
    ? state.property.bathroomFeatures[editingBathroomIndex.value] ?? null
    : null
)

// Form validation
const isFormValid = computed(() => step4Validation.isStep4Valid(state))

// Bedroom methods
function addBedroom() {
  const newIndex = state.property.bedroomFeatures.length
  state.property.bedroomFeatures.push({
    name: '',
    roomNumber: newIndex + 1,
    description: null,
    floor: 1,
    bed: [],
    features: [],
    size: null,
  })
  openBedroomEditor(newIndex)
}

function removeBedroom(index: number) {
  state.property.bedroomFeatures.splice(index, 1)
  state.property.bedroomFeatures.forEach((b, i) => {
    b.roomNumber = i + 1
  })
}

function openBedroomEditor(index: number) {
  editingBedroomIndex.value = index
  bedroomEditorOpen.value = true
}

function closeBedroomEditor() {
  editingBedroomIndex.value = null
}

// Bathroom methods
function addBathroom() {
  const newIndex = state.property.bathroomFeatures.length
  state.property.bathroomFeatures.push({
    name: '',
    roomNumber: newIndex + 1,
    description: null,
    floor: 1,
    features: [],
    size: null,
  })
  openBathroomEditor(newIndex)
}

function removeBathroom(index: number) {
  state.property.bathroomFeatures.splice(index, 1)
  state.property.bathroomFeatures.forEach((b, i) => {
    b.roomNumber = i + 1
  })
}

function openBathroomEditor(index: number) {
  editingBathroomIndex.value = index
  bathroomEditorOpen.value = true
}

function closeBathroomEditor() {
  editingBathroomIndex.value = null
}

// Save room data silently (no toast)
async function saveRoomProgress() {
  await saveRoomData(
    4,
    '/api/draft-listings/update/steps/four/',
    getSubmissionData()
  )
}

// Handle bedroom done - save and close
async function handleBedroomDone() {
  await saveRoomProgress()
  closeBedroomEditor()
}

// Handle bathroom done - save and close
async function handleBathroomDone() {
  await saveRoomProgress()
  closeBathroomEditor()
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
