<template>
  <OrganismsDashboardCreateListingStepWrapper
    :step-number="6"
    alert-title="Step 6: Outdoor Spaces"
    alert-description="Add details about your outdoor spaces including gardens, yards, and additional land. Complete information helps viewers understand your property's outdoor amenities."
    :schema="step6Schema"
    :state="state"
    :is-valid="isFormValid"
    api-endpoint="/api/draft-listings/update/steps/six/"
    :get-submission-data="getSubmissionData"
    @completed="onStepCompleted"
    @saved="onStepSaved"
  >
    <!-- Gardens Section -->
    <OrganismsDashboardGardenForm
      :gardens="state.property.outdoorSpace.garden"
      @add="addGarden"
      @edit="openGardenEditor"
      @remove="removeGarden"
    />

    <!-- Yards Section -->
    <OrganismsDashboardYardForm
      :yards="state.property.outdoorSpace.yard"
      @add="addYard"
      @edit="openYardEditor"
      @remove="removeYard"
    />

    <!-- Land Section -->
    <OrganismsDashboardLandForm
      :land-parcels="state.property.outdoorSpace.land"
      @add="addLand"
      @edit="openLandEditor"
      @remove="removeLand"
    />

    <!-- Garden Editor Slideover -->
    <OrganismsDashboardGardenSlideForm
      v-model:open="gardenEditorOpen"
      :garden="editingGarden"
      :garden-index="editingGardenIndex ?? 0"
      :is-saving="isSaving"
      @done="handleGardenDone"
      @cancel="handleGardenCancel"
    />

    <!-- Yard Editor Slideover -->
    <OrganismsDashboardYardSlideForm
      v-model:open="yardEditorOpen"
      :yard="editingYard"
      :yard-index="editingYardIndex ?? 0"
      :is-saving="isSaving"
      @done="handleYardDone"
      @cancel="handleYardCancel"
    />

    <!-- Land Editor Slideover -->
    <OrganismsDashboardLandSlideForm
      v-model:open="landEditorOpen"
      :land="editingLand"
      :land-index="editingLandIndex ?? 0"
      :is-saving="isSaving"
      @done="handleLandDone"
      @cancel="handleLandCancel"
    />
  </OrganismsDashboardCreateListingStepWrapper>
</template>

<script setup lang="ts">
// Uses auto-imported types and utils from shared/utils/listing-step6-schema.ts:
// - step6Schema, Step6FormData, GardenData, YardData, LandData
// - createInitialStep6Values, step6Validation

const { getStepData, saveRoomData, isSaving } = useCreateListingSteps()

// Initialize state from saved data or empty
const savedData = getStepData(6) as Step6FormData | undefined
const hasValidSavedData = savedData && savedData.property && savedData.property.outdoorSpace
const state = reactive<Step6FormData>(
  hasValidSavedData ? savedData : createInitialStep6Values()
)

// Slideover state
const gardenEditorOpen = ref(false)
const yardEditorOpen = ref(false)
const landEditorOpen = ref(false)
const editingGardenIndex = ref<number | null>(null)
const editingYardIndex = ref<number | null>(null)
const editingLandIndex = ref<number | null>(null)
const isAddingNewGarden = ref(false)
const isAddingNewYard = ref(false)
const isAddingNewLand = ref(false)

// Computed refs for currently editing items
const editingGarden = computed((): GardenData | null => 
  editingGardenIndex.value !== null 
    ? state.property.outdoorSpace.garden[editingGardenIndex.value] ?? null
    : null
)

const editingYard = computed((): YardData | null => 
  editingYardIndex.value !== null 
    ? state.property.outdoorSpace.yard[editingYardIndex.value] ?? null
    : null
)

const editingLand = computed((): LandData | null => 
  editingLandIndex.value !== null 
    ? state.property.outdoorSpace.land[editingLandIndex.value] ?? null
    : null
)

// Validation - at least one outdoor space item or step can be empty (all optional)
const isFormValid = computed(() => {
  return step6Validation.isStep6Valid(state)
})

// Garden handlers
const addGarden = () => {
  const newIndex = state.property.outdoorSpace.garden.length
  state.property.outdoorSpace.garden.push({
    name: '',
    description: null,
    facing: null,
    position: null,
    features: [],
    size: null,
  })
  isAddingNewGarden.value = true
  editingGardenIndex.value = newIndex
  gardenEditorOpen.value = true
}

const openGardenEditor = (index: number) => {
  isAddingNewGarden.value = false
  editingGardenIndex.value = index
  gardenEditorOpen.value = true
}

const removeGarden = (index: number) => {
  state.property.outdoorSpace.garden.splice(index, 1)
  saveRoomProgress()
}

const closeGardenEditor = () => {
  gardenEditorOpen.value = false
  editingGardenIndex.value = null
  isAddingNewGarden.value = false
}

const handleGardenDone = () => {
  isAddingNewGarden.value = false
  closeGardenEditor()
  saveRoomProgress()
}

const handleGardenCancel = () => {
  if (isAddingNewGarden.value && editingGardenIndex.value !== null) {
    state.property.outdoorSpace.garden.splice(editingGardenIndex.value, 1)
  }
  closeGardenEditor()
}

// Yard handlers
const addYard = () => {
  const newIndex = state.property.outdoorSpace.yard.length
  state.property.outdoorSpace.yard.push({
    name: '',
    description: null,
    facing: null,
    position: null,
    features: [],
    size: null,
  })
  isAddingNewYard.value = true
  editingYardIndex.value = newIndex
  yardEditorOpen.value = true
}

const openYardEditor = (index: number) => {
  isAddingNewYard.value = false
  editingYardIndex.value = index
  yardEditorOpen.value = true
}

const removeYard = (index: number) => {
  state.property.outdoorSpace.yard.splice(index, 1)
  saveRoomProgress()
}

const closeYardEditor = () => {
  yardEditorOpen.value = false
  editingYardIndex.value = null
  isAddingNewYard.value = false
}

const handleYardDone = () => {
  isAddingNewYard.value = false
  closeYardEditor()
  saveRoomProgress()
}

const handleYardCancel = () => {
  if (isAddingNewYard.value && editingYardIndex.value !== null) {
    state.property.outdoorSpace.yard.splice(editingYardIndex.value, 1)
  }
  closeYardEditor()
}

// Land handlers
const addLand = () => {
  const newIndex = state.property.outdoorSpace.land.length
  state.property.outdoorSpace.land.push({
    name: '',
    description: null,
    features: [],
    size: null,
  })
  isAddingNewLand.value = true
  editingLandIndex.value = newIndex
  landEditorOpen.value = true
}

const openLandEditor = (index: number) => {
  isAddingNewLand.value = false
  editingLandIndex.value = index
  landEditorOpen.value = true
}

const removeLand = (index: number) => {
  state.property.outdoorSpace.land.splice(index, 1)
  saveRoomProgress()
}

const closeLandEditor = () => {
  landEditorOpen.value = false
  editingLandIndex.value = null
  isAddingNewLand.value = false
}

const handleLandDone = () => {
  isAddingNewLand.value = false
  closeLandEditor()
  saveRoomProgress()
}

const handleLandCancel = () => {
  if (isAddingNewLand.value && editingLandIndex.value !== null) {
    state.property.outdoorSpace.land.splice(editingLandIndex.value, 1)
  }
  closeLandEditor()
}

// Save room progress when adding/removing/updating items
const saveRoomProgress = async () => {
  const data = getSubmissionData()
  const result = await saveRoomData(6, '/api/draft-listings/update/steps/six/', data)
  console.log('Step 6 save result:', result)
}

// Step completed callback
const onStepCompleted = () => {
  console.log('Step 6 completed, advancing to step 7')
}

const onStepSaved = () => {
  console.log('Step 6 saved (progress only)')
}

// Get submission data formatted for API
const getSubmissionData = () => {
  return {
    property: {
      outdoorSpace: {
        description: state.property.outdoorSpace.description,
        totalArea: state.property.outdoorSpace.totalArea,
        features: state.property.outdoorSpace.features,
        garden: state.property.outdoorSpace.garden,
        yard: state.property.outdoorSpace.yard,
        land: state.property.outdoorSpace.land,
      }
    }
  }
}
</script>
