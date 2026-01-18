<template>
  <OrganismsDashboardCreateListingStepWrapper
    :step-number="6"
    :schema="step6Schema"
    :state="state"
    :is-valid="isFormValid"
    api-endpoint="/api/draft-listings/update/steps/six/"
    :get-submission-data="getSubmissionData"
    @completed="onStepCompleted"
    @saved="onStepSaved"
  >
    <template #alert>
      <UAlert type="info" class="mb-6" color="secondary" variant="subtle" icon="i-lucide-info" close>
        <template #title>
          <h3>Step 6: Outdoor Spaces</h3>
        </template>
        <template #description>
          <p class="body-sm text-muted">
            Add details about your outdoor spaces including gardens, yards, and additional land. Complete information helps viewers understand your property's outdoor amenities.
          </p>
        </template>
      </UAlert>
    </template>

    <!-- General Outdoor Space Info -->
    <div class="space-y-5 mb-6">
      <UFormField label="Outdoor Space Description" name="property.outdoorSpace.description" description="Describe your general outdoor space" hint="optional" eager-validation>
        <UTextarea
          v-model="state.property.outdoorSpace.description"
          placeholder="e.g. Landscaped gardens, private outdoor area, south-facing aspect..."
          :rows="3"
          color="secondary"
          class="w-full"
        />
      </UFormField>

      <div class="flex flex-col sm:flex-row gap-6">
        <div class="sm:w-64 shrink-0">
          <UFormField label="Total Outdoor Area" name="property.outdoorSpace.totalArea" description="Combined size of all outdoor spaces" hint="optional" eager-validation>
            <UInput
              v-model.number="state.property.outdoorSpace.totalArea"
              type="number"
              :min="0"
              placeholder="e.g. 500"
              color="secondary"
              class="w-full"
            >
              <template #trailing>
                <span class="text-muted text-sm">m²</span>
              </template>
            </UInput>
          </UFormField>
        </div>

        <div class="flex-1">
          <UFormField label="General Outdoor Features" name="property.outdoorSpace.features" description="Features that apply to overall outdoor space" hint="optional" eager-validation>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3 mt-2">
              <UCheckbox
                v-for="feature in outdoorSpaceFeatureOptions"
                :key="String(feature.value)"
                :id="`outdoor-feature-${feature.value}`"
                :name="`outdoor-feature-${feature.value}`"
                :model-value="state.property.outdoorSpace.features?.includes(feature.value)"
                @update:model-value="(val: boolean | 'indeterminate') => toggleOutdoorFeature(feature.value, val === true)"
                :label="feature.label"
                color="secondary"
              />
            </div>
          </UFormField>
        </div>
      </div>
    </div>

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

// Toggle outdoor feature
function toggleOutdoorFeature(value: string, checked: boolean) {
  const current = state.property.outdoorSpace.features ?? []
  if (checked) {
    state.property.outdoorSpace.features = [...current, value]
  } else {
    state.property.outdoorSpace.features = current.filter((v) => v !== value)
  }
}

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
