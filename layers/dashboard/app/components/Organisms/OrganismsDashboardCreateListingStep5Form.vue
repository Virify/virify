<template>
  <OrganismsDashboardCreateListingStepWrapper
    :step-number="5"
    alert-title="Step 5: Kitchens, Receptions & Other Rooms"
    alert-description="Add all the living spaces for your property. Complete information helps viewers find the right property. It will automatically save as you complete each room."
    :schema="step5Schema"
    :state="state"
    :is-valid="isFormValid"
    api-endpoint="/api/draft-listings/update/steps/five/"
    :get-submission-data="getSubmissionData"
    @completed="onStepCompleted"
    @saved="onStepSaved"
  >
    <!-- Kitchens Section -->
    <OrganismsDashboardKitchenForm
      :kitchens="state.property.kitchenFeatures"
      @add="addKitchen"
      @edit="openKitchenEditor"
      @remove="removeKitchen"
    />

    <!-- Receptions Section -->
    <OrganismsDashboardReceptionForm
      :receptions="state.property.reception"
      @add="addReception"
      @edit="openReceptionEditor"
      @remove="removeReception"
    />

    <!-- Other Rooms Section -->
    <OrganismsDashboardOtherRoomForm
      :other-rooms="state.property.otherRoom"
      @add="addOtherRoom"
      @edit="openOtherRoomEditor"
      @remove="removeOtherRoom"
    />

    <!-- Kitchen Editor Slideover -->
    <OrganismsDashboardKitchenSlideForm
      v-model:open="kitchenEditorOpen"
      :kitchen="editingKitchen"
      :kitchen-index="editingKitchenIndex ?? 0"
      :floor-options="floorOptions"
      :is-saving="isSaving"
      @done="handleKitchenDone"
    />

    <!-- Reception Editor Slideover -->
    <OrganismsDashboardReceptionSlideForm
      v-model:open="receptionEditorOpen"
      :reception="editingReception"
      :reception-index="editingReceptionIndex ?? 0"
      :floor-options="floorOptions"
      :is-saving="isSaving"
      @done="handleReceptionDone"
    />

    <!-- Other Room Editor Slideover -->
    <OrganismsDashboardOtherRoomSlideForm
      v-model:open="otherRoomEditorOpen"
      :other-room="editingOtherRoom"
      :other-room-index="editingOtherRoomIndex ?? 0"
      :floor-options="floorOptions"
      :is-saving="isSaving"
      @done="handleOtherRoomDone"
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
const savedData = getStepData(5) as Step5FormData | undefined
const hasValidSavedData = savedData && savedData.property && Array.isArray(savedData.property.kitchenFeatures)
const state = reactive<Step5FormData>(
  hasValidSavedData ? savedData : createInitialStep5Values()
)

// Slideover state
const kitchenEditorOpen = ref(false)
const receptionEditorOpen = ref(false)
const otherRoomEditorOpen = ref(false)
const editingKitchenIndex = ref<number | null>(null)
const editingReceptionIndex = ref<number | null>(null)
const editingOtherRoomIndex = ref<number | null>(null)

// Computed refs for currently editing rooms
const editingKitchen = computed((): KitchenData | null => 
  editingKitchenIndex.value !== null 
    ? state.property.kitchenFeatures[editingKitchenIndex.value] ?? null
    : null
)

const editingReception = computed((): ReceptionData | null => 
  editingReceptionIndex.value !== null 
    ? state.property.reception[editingReceptionIndex.value] ?? null
    : null
)

const editingOtherRoom = computed((): OtherRoomData | null => 
  editingOtherRoomIndex.value !== null 
    ? state.property.otherRoom[editingOtherRoomIndex.value] ?? null
    : null
)

// Form validation
const isFormValid = computed(() => isStep5Valid(state))

// Kitchen methods
function addKitchen() {
  const newIndex = state.property.kitchenFeatures.length
  state.property.kitchenFeatures.push({
    name: '',
    roomNumber: newIndex + 1,
    description: null,
    floor: 1,
    features: [],
    size: null,
  })
  openKitchenEditor(newIndex)
}

function removeKitchen(index: number) {
  state.property.kitchenFeatures.splice(index, 1)
  state.property.kitchenFeatures.forEach((k, i) => {
    k.roomNumber = i + 1
  })
}

function openKitchenEditor(index: number) {
  editingKitchenIndex.value = index
  kitchenEditorOpen.value = true
}

function closeKitchenEditor() {
  editingKitchenIndex.value = null
}

// Reception methods
function addReception() {
  const newIndex = state.property.reception.length
  state.property.reception.push({
    name: '',
    roomNumber: newIndex + 1,
    description: null,
    floor: 1,
    type: '' as any,
    features: [],
    size: null,
  })
  openReceptionEditor(newIndex)
}

function removeReception(index: number) {
  state.property.reception.splice(index, 1)
  state.property.reception.forEach((r, i) => {
    r.roomNumber = i + 1
  })
}

function openReceptionEditor(index: number) {
  editingReceptionIndex.value = index
  receptionEditorOpen.value = true
}

function closeReceptionEditor() {
  editingReceptionIndex.value = null
}

// Other Room methods
function addOtherRoom() {
  const newIndex = state.property.otherRoom.length
  state.property.otherRoom.push({
    name: '',
    roomNumber: newIndex + 1,
    description: null,
    floor: 1,
    type: '' as any,
    features: [],
    size: null,
  })
  openOtherRoomEditor(newIndex)
}

function removeOtherRoom(index: number) {
  state.property.otherRoom.splice(index, 1)
  state.property.otherRoom.forEach((o, i) => {
    o.roomNumber = i + 1
  })
}

function openOtherRoomEditor(index: number) {
  editingOtherRoomIndex.value = index
  otherRoomEditorOpen.value = true
}

function closeOtherRoomEditor() {
  editingOtherRoomIndex.value = null
}

// Save room data silently (no toast)
async function saveRoomProgress() {
  await saveRoomData(
    5,
    '/api/draft-listings/update/steps/five/',
    getSubmissionData()
  )
}

// Handle kitchen done - save and close
async function handleKitchenDone() {
  await saveRoomProgress()
  closeKitchenEditor()
}

// Handle reception done - save and close
async function handleReceptionDone() {
  await saveRoomProgress()
  closeReceptionEditor()
}

// Handle other room done - save and close
async function handleOtherRoomDone() {
  await saveRoomProgress()
  closeOtherRoomEditor()
}

// Get submission data
function getSubmissionData() {
  return {
    property: {
      totalFloors: totalFloors.value,
      kitchenFeatures: state.property.kitchenFeatures,
      numberKitchens: state.property.kitchenFeatures.length,
      reception: state.property.reception,
      numberReceptions: state.property.reception.length,
      otherRoom: state.property.otherRoom,
      numberOtherRooms: state.property.otherRoom.length,
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
