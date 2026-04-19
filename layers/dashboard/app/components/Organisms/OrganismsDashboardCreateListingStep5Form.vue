<template>
  <OrganismsDashboardCreateListingStepWrapper
    :step-number="5"
    :schema="step5Schema"
    :state="state"
    :is-valid="isFormValid"
    api-endpoint="/api/listings/update/steps/five/"
    :get-submission-data="getSubmissionData"
    @completed="onStepCompleted"
    @saved="onStepSaved"
  >
    <template #alert>
      <UAlert type="info" class="mb-6" color="secondary" variant="subtle" icon="i-lucide-info" close>
        <template #title>
          <h3>Step 5: Kitchens, Receptions & Other Rooms</h3>
        </template>
        <template #description>
          <p class="body-sm text-muted">
            Add all the living spaces for your property. Complete information helps viewers find the right property. It will automatically save as you complete each room.
          </p>
        </template>
      </UAlert>
    </template>

    <!-- Kitchens Section -->
    <OrganismsDashboardKitchenForm
      :kitchens="state.property.kitchenFeatures"
      @add="addKitchen"
      @edit="kitchenEditor.open"
      @remove="removeKitchen"
    />

    <!-- Receptions Section -->
    <OrganismsDashboardReceptionForm
      :receptions="state.property.reception"
      @add="addReception"
      @edit="receptionEditor.open"
      @remove="removeReception"
    />

    <!-- Other Rooms Section -->
    <OrganismsDashboardOtherRoomForm
      :other-rooms="state.property.otherRoom"
      @add="addOtherRoom"
      @edit="otherRoomEditor.open"
      @remove="removeOtherRoom"
    />

    <!-- Kitchen Editor Slideover -->
    <OrganismsDashboardKitchenSlideForm
      v-model:open="kitchenEditor.isOpen.value"
      :kitchen="kitchenEditor.editingItem.value"
      :kitchen-index="kitchenEditor.editingIndex.value ?? 0"
      :floor-options="floorOptions"
      :is-saving="isSaving"
      @done="handleKitchenDone"
      @cancel="kitchenEditor.cancel"
    />

    <!-- Reception Editor Slideover -->
    <OrganismsDashboardReceptionSlideForm
      v-model:open="receptionEditor.isOpen.value"
      :reception="receptionEditor.editingItem.value"
      :reception-index="receptionEditor.editingIndex.value ?? 0"
      :floor-options="floorOptions"
      :is-saving="isSaving"
      @done="handleReceptionDone"
      @cancel="receptionEditor.cancel"
    />

    <!-- Other Room Editor Slideover -->
    <OrganismsDashboardOtherRoomSlideForm
      v-model:open="otherRoomEditor.isOpen.value"
      :other-room="otherRoomEditor.editingItem.value"
      :other-room-index="otherRoomEditor.editingIndex.value ?? 0"
      :floor-options="floorOptions"
      :is-saving="isSaving"
      @done="handleOtherRoomDone"
      @cancel="otherRoomEditor.cancel"
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
const kitchenEditor = useRoomEditor(state.property.kitchenFeatures)
const receptionEditor = useRoomEditor(state.property.reception)
const otherRoomEditor = useRoomEditor(state.property.otherRoom)

// Form validation
const isFormValid = computed(() => isStep5Valid(state))

// Kitchen methods
function addKitchen() {
  const newIndex = state.property.kitchenFeatures.length
  state.property.kitchenFeatures.push({
    name: '',
    roomNumber: newIndex + 1,
    description: null,
    floor: 0,
    features: [],
    size: null,
  })
  kitchenEditor.isAddingNew.value = true
  kitchenEditor.open(newIndex)
}

async function removeKitchen(index: number) {
  state.property.kitchenFeatures.splice(index, 1)
  state.property.kitchenFeatures.forEach((k, i) => {
    k.roomNumber = i + 1
  })
  await saveRoomProgress('Kitchen removed')
}

// Reception methods
function addReception() {
  const newIndex = state.property.reception.length
  state.property.reception.push({
    name: '',
    roomNumber: newIndex + 1,
    description: null,
    floor: 0,
    type: '' as any,
    features: [],
    size: null,
  })
  receptionEditor.isAddingNew.value = true
  receptionEditor.open(newIndex)
}

async function removeReception(index: number) {
  state.property.reception.splice(index, 1)
  state.property.reception.forEach((r, i) => {
    r.roomNumber = i + 1
  })
  await saveRoomProgress('Reception room removed')
}

// Other Room methods
function addOtherRoom() {
  const newIndex = state.property.otherRoom.length
  state.property.otherRoom.push({
    name: '',
    roomNumber: newIndex + 1,
    description: null,
    floor: 0,
    type: '' as any,
    features: [],
    size: null,
  })
  otherRoomEditor.isAddingNew.value = true
  otherRoomEditor.open(newIndex)
}

async function removeOtherRoom(index: number) {
  state.property.otherRoom.splice(index, 1)
  state.property.otherRoom.forEach((o, i) => {
    o.roomNumber = i + 1
  })
  await saveRoomProgress('Room removed')
}

async function saveRoomProgress(successMessage?: string) {
  await saveRoomData(
    5,
    '/api/listings/update/steps/five/',
    getSubmissionData(),
    successMessage
  )
}

// Handle kitchen done - save and close
async function handleKitchenDone() {
  const isNew = kitchenEditor.isAddingNew.value
  kitchenEditor.close()
  await saveRoomProgress(isNew ? 'Kitchen added' : 'Kitchen updated')
}

// Handle reception done - save and close
async function handleReceptionDone() {
  const isNew = receptionEditor.isAddingNew.value
  receptionEditor.close()
  await saveRoomProgress(isNew ? 'Reception room added' : 'Reception room updated')
}

// Handle other room done - save and close
async function handleOtherRoomDone() {
  const isNew = otherRoomEditor.isAddingNew.value
  otherRoomEditor.close()
  await saveRoomProgress(isNew ? 'Room added' : 'Room updated')
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
