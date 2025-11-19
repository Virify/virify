<template>
  <EditListingStepsStepLayout
    title="Outdoor Spaces & Utilities"
    info="Please add details about your outdoor space. You’re property is more likely to stand out if you create a detailed listing!"
    :hasChanges="hasChanges"
    :buttonDisabled="buttonDisabled"
    :buttonText="buttonText"
    :errorMessage="errorMessage"
    showPrevious
    @cancel="resetForm"
    @previous="$emit('previousStep')"
    @submit="submitForm"
  >
    <AtomsDivider />

    <div class="step__section">
      <MoleculesListingFormHeading 
        title="General Outdoor Space Description" 
        :required="false"
        variant="section"
      />
      
      <OrganismsListingFormTextGroup
        title="Description"
        v-model="stepSevenData.property.outdoorSpace.description"
        name="outdoor-space-description"
        placeholder="Describe the outdoor space..."
        :expanded="true"
      >
        <template #tooltip-content>
          <p>Add any additional details about the outdoor space that potential buyers should know. For example: landscaping, privacy, outdoor lighting, irrigation system, etc.</p>
        </template>
      </OrganismsListingFormTextGroup>
    </div>

    <AtomsDivider />

    <!-- Garden Section -->
    <div class="step__section">
      <MoleculesListingFormHeading 
        title="Garden" 
        :required="false"
        variant="section"
      />
      
      <OrganismsListingFormYesNoGroup
        title="Does the property come with a garden?"
        v-model="stepSevenData.property.outdoorSpace.hasGarden"
        name="has-garden"
        @update:modelValue="handleGardenToggle"
      >
        <template #tooltip-content>
          <p>Select Yes if the property has any garden space. You'll be able to provide details about size, position, features, and more.</p>
        </template>
      </OrganismsListingFormYesNoGroup>

      <template v-if="stepSevenData.property.outdoorSpace.hasGarden">
        
        <OrganismsListingGardenForm
          v-model="stepSevenData.property.outdoorSpace.garden"
        />
      </template>
    </div>

    <AtomsDivider />

    <!-- Yard Section -->
    <div class="step__section">
      <MoleculesListingFormHeading 
        title="Yard" 
        :required="false"
        variant="section"
      />
      <OrganismsListingFormYesNoGroup
        title="Does the property come with a yard?"
        v-model="stepSevenData.property.outdoorSpace.hasYard"
        name="has-yard"
        @update:modelValue="handleYardToggle"
      >
        <template #tooltip-content>
          <p>Select Yes if the property has any yard space. You'll be able to provide details about size, position, features, and more.</p>
        </template>
      </OrganismsListingFormYesNoGroup>

      <template v-if="stepSevenData.property.outdoorSpace.hasYard">
        
        <OrganismsListingYardForm
          v-model="stepSevenData.property.outdoorSpace.yard"
        />
      </template>
    </div>

    <AtomsDivider />

    <!-- Land Section -->
    <div class="step__section">
      <MoleculesListingFormHeading 
        title="Additional Land" 
        :required="false"
        variant="section"
      />
      
      <OrganismsListingFormYesNoGroup
        title="Does the property come with any other land?"
        v-model="stepSevenData.property.outdoorSpace.hasLand"
        name="has-land"
        @update:modelValue="handleLandToggle"
      >
        <template #tooltip-content>
          <p>Select Yes if the property includes any additional land parcels beyond the garden or yard. You'll be able to provide details about the land features and size.</p>
        </template>
      </OrganismsListingFormYesNoGroup>

      <template v-if="stepSevenData.property.outdoorSpace.hasLand">
        
        <OrganismsListingLandForm
          v-model="stepSevenData.property.outdoorSpace.land"
        />
      </template>
    </div>

    <AtomsDivider />

    <!-- General Outdoor Features -->
    <div class="step__section">
      <MoleculesListingFormHeading 
        title="General Outdoor Features" 
        :required="false"
        variant="section"
      />
      
      <OrganismsListingFormCheckboxGroup
        title="Outdoor Features"
        :options="outdoorSpaceFeaturesOptions"
        :model-value="getSelectedOutdoorSpaceFeatures()"
        name="outdoor-space-features"
        @update:modelValue="updateOutdoorSpaceFeatures"
      >
        <template #tooltip-content>
          <p>Select any features that apply to the entire outdoor space (not specific to individual gardens, yards, or land). These are general features that describe the overall outdoor area.</p>
        </template>
      </OrganismsListingFormCheckboxGroup>
    </div>

    <AtomsDivider />

    <div class="step__section">
      <MoleculesListingFormHeading 
        title="Total Outdoor Area" 
        :required="false"
        variant="section"
      />
      
      <OrganismsListingFormSizeToggle
        title="Total Outdoor Area"
        :options="sizeOptions"
        :unit="'meter'"
        :size="stepSevenData.property.outdoorSpace.totalArea"
        name="total-outdoor-area"
        @update:unit="() => {}"
        @update:size="(value: number | null) => stepSevenData.property.outdoorSpace.totalArea = value"
      >
        <template #tooltip-content>
          <p>Not sure how to measure? See our <NuxtLink to="/guides/property-information/guide-to-measuring-land-size" target="_blank" rel="noopener" class="link">Total Land Size (Acres) guide.</NuxtLink></p>
        </template>
      </OrganismsListingFormSizeToggle>
    </div>
  </EditListingStepsStepLayout>
</template>

<script setup lang="ts">

const props = defineProps<{
  draft: DraftListingWithFullPayload;
  errorMessage?: string;
}>();

const emit = defineEmits<{
  'updateStepData': [stepData: StepSeven, step: number];
  'previousStep': [];
  'nextStep': [];
}>();

const stepConfig = computed(() => ({
  initialData: createInitialStepSevenValues(props.draft),
  isValid: stepSevenValidation.isStepSevenValid,
  hasExistingData: stepSevenValidation.hasExistingStepSevenData,
  stepNumber: 7,
  beforeSubmit: (data: StepSeven): StepSeven => {
    // Helper function to check if garden/yard has additional details
    const hasGardenYardDetails = (item: any) => {
      return !!(
        item.size ||
        (item.position && item.position !== '0') || // Check for non-default value
        (item.facing && item.facing !== '0') ||     // Check for non-default value
        item.sunTerrace ||
        item.terrace ||
        item.balcony ||
        item.patio ||
        item.separateParcel ||
        item.shed ||
        item.summerHouse ||
        item.gardenOffice ||
        item.pool
      );
    };

    // Helper function to check if land has additional details
    const hasLandDetails = (item: any) => {
      return !!(
        item.size ||
        item.separateParcel ||
        item.woodland ||
        item.paddock ||
        item.stables ||
        item.tennisCourt ||
        item.orchard ||
        item.pond ||
        item.outbuilding
      );
    };

    return {
      property: {
        outdoorSpace: {
          ...data.property.outdoorSpace,
          hasGarden: data.property.outdoorSpace.garden.length > 0,
          hasYard: data.property.outdoorSpace.yard.length > 0,
          hasLand: data.property.outdoorSpace.land.length > 0,
          // Update additionalDetails for each garden
          garden: data.property.outdoorSpace.garden.map(g => ({
            ...g,
            position: (g.position as any) === '0' ? null : g.position, // Convert '0' to null
            facing: (g.facing as any) === '0' ? null : g.facing,       // Convert '0' to null
            additionalDetails: hasGardenYardDetails(g),
          })),
          // Update additionalDetails for each yard
          yard: data.property.outdoorSpace.yard.map(y => ({
            ...y,
            position: (y.position as any) === '0' ? null : y.position, // Convert '0' to null
            facing: (y.facing as any) === '0' ? null : y.facing,       // Convert '0' to null
            additionalDetails: hasGardenYardDetails(y),
          })),
          // Update additionalDetails for each land
          land: data.property.outdoorSpace.land.map(l => ({
            ...l,
            additionalDetails: hasLandDetails(l),
          })),
        },
      },
    };
  }
}));

const {
  formData: stepSevenData,
  hasChanges,
  buttonDisabled,
  buttonText,
  resetForm,
  submitForm: handleSubmit,
} = useListingStepForm(stepConfig, props.draft);

// Watch for changes to garden/yard/land arrays and sync the has* flags
watch(() => stepSevenData.value.property.outdoorSpace.garden.length, (newLength) => {
  stepSevenData.value.property.outdoorSpace.hasGarden = newLength > 0;
});

watch(() => stepSevenData.value.property.outdoorSpace.yard.length, (newLength) => {
  stepSevenData.value.property.outdoorSpace.hasYard = newLength > 0;
});

watch(() => stepSevenData.value.property.outdoorSpace.land.length, (newLength) => {
  stepSevenData.value.property.outdoorSpace.hasLand = newLength > 0;
});

// Handle toggle events - create/clear rooms based on yes/no
const handleGardenToggle = (hasGarden: boolean) => {
  if (hasGarden && stepSevenData.value.property.outdoorSpace.garden.length === 0) {
    // Create initial garden when user selects "Yes"
    stepSevenData.value.property.outdoorSpace.garden = [{
      name: 'Garden',
      description: null,
      position: '0' as any, // Default to "Select a position"
      facing: '0' as any,   // Default to "Select a facing"
      features: [],
      additionalDetails: false,
      size: null,
    }];
  } else if (!hasGarden) {
    // Clear gardens when user selects "No"
    stepSevenData.value.property.outdoorSpace.garden = [];
  }
};

const handleYardToggle = (hasYard: boolean) => {
  if (hasYard && stepSevenData.value.property.outdoorSpace.yard.length === 0) {
    // Create initial yard when user selects "Yes"
    stepSevenData.value.property.outdoorSpace.yard = [{
      name: 'Yard',
      description: null,
      position: '0' as any, // Default to "Select a position"
      facing: '0' as any,   // Default to "Select a facing"
      features: [],
      additionalDetails: false,
      size: null,
    }];
  } else if (!hasYard) {
    // Clear yards when user selects "No"
    stepSevenData.value.property.outdoorSpace.yard = [];
  }
};

const handleLandToggle = (hasLand: boolean) => {
  if (hasLand && stepSevenData.value.property.outdoorSpace.land.length === 0) {
    // Create initial land when user selects "Yes"
    stepSevenData.value.property.outdoorSpace.land = [{
      name: 'Land',
      description: null,
      separateParcel: false,
      features: [],
      additionalDetails: false,
      size: null,
    }];
  } else if (!hasLand) {
    // Clear land when user selects "No"
    stepSevenData.value.property.outdoorSpace.land = [];
  }
};

// OutdoorSpace features checkbox management
const getSelectedOutdoorSpaceFeatures = () => {
  return stepSevenData.value.property.outdoorSpace.features || [];
};

const updateOutdoorSpaceFeatures = (selectedFeatures: string[]) => {
  stepSevenData.value.property.outdoorSpace.features = selectedFeatures;
};

function submitForm() {
  handleSubmit(
    (data) => {
      emit('updateStepData', data, 7);
    },
    () => emit('nextStep')
  );
}
</script>


