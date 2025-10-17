<template>
  <CreateListingStepsStepLayout
    title="Outdoor Spaces & Utilities"
    info="Add details about gardens, yards, land, and outdoor features of your property. The more information you provide, the better potential viewers can understand the property and the more features users can search and discover you from."
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
      <MoleculesDraftFormHeading 
        title="General Outdoor Space Description" 
        :required="false"
        variant="section"
      />
      <em class="body-xs">Optional general description</em>
      
      <OrganismsDraftFormTextGroup
        title="Description"
        v-model="stepSevenData.property.outdoorSpace.description"
        name="outdoor-space-description"
        placeholder="Describe the outdoor space..."
        :expanded="true"
      >
        <template #tooltip-content>
          <AtomsTooltipParagraphs :paragraphs="[
            'Add any additional details about the outdoor space that potential buyers should know. For example: landscaping, privacy, outdoor lighting, irrigation system, etc.'
          ]" />
        </template>
      </OrganismsDraftFormTextGroup>
    </div>

    <AtomsDivider />

    <!-- Garden Section -->
    <div class="step__section">
      <MoleculesDraftFormHeading 
        title="Garden" 
        :required="false"
        variant="section"
      />
      <em class="body-xs">Optional garden details</em>
      
      <OrganismsDraftFormYesNoGroup
        title="Does the property come with a garden?"
        v-model="stepSevenData.property.outdoorSpace.hasGarden"
        name="has-garden"
        @update:modelValue="handleGardenToggle"
      >
        <template #tooltip-content>
          <AtomsTooltipParagraphs :paragraphs="[
            'Select Yes if the property has any garden space. You\'ll be able to provide details about size, position, features, and more.'
          ]" />
        </template>
      </OrganismsDraftFormYesNoGroup>

      <template v-if="stepSevenData.property.outdoorSpace.hasGarden">
        <em class="body-xs">Add optional garden details and features</em>
        
        <OrganismsDraftGardenForm
          v-model="stepSevenData.property.outdoorSpace.garden"
        />
      </template>
    </div>

    <AtomsDivider />

    <!-- Yard Section -->
    <div class="step__section">
      <MoleculesDraftFormHeading 
        title="Yard" 
        :required="false"
        variant="section"
      />
      <em class="body-xs">Optional yard details</em>
      
      <OrganismsDraftFormYesNoGroup
        title="Does the property come with a yard?"
        v-model="stepSevenData.property.outdoorSpace.hasYard"
        name="has-yard"
        @update:modelValue="handleYardToggle"
      >
        <template #tooltip-content>
          <AtomsTooltipParagraphs :paragraphs="[
            'Select Yes if the property has any yard space. You\'ll be able to provide details about size, position, features, and more.'
          ]" />
        </template>
      </OrganismsDraftFormYesNoGroup>

      <template v-if="stepSevenData.property.outdoorSpace.hasYard">
        <em class="body-xs">Add optional yard details and features</em>
        
        <OrganismsDraftYardForm
          v-model="stepSevenData.property.outdoorSpace.yard"
        />
      </template>
    </div>

    <AtomsDivider />

    <!-- Land Section -->
    <div class="step__section">
      <MoleculesDraftFormHeading 
        title="Additional Land" 
        :required="false"
        variant="section"
      />
      <em class="body-xs">Optional land details</em>
      
      <OrganismsDraftFormYesNoGroup
        title="Does the property come with any other land?"
        v-model="stepSevenData.property.outdoorSpace.hasLand"
        name="has-land"
        @update:modelValue="handleLandToggle"
      >
        <template #tooltip-content>
          <AtomsTooltipParagraphs :paragraphs="[
            'Select Yes if the property includes any additional land parcels beyond the garden or yard. You\'ll be able to provide details about the land features and size.'
          ]" />
        </template>
      </OrganismsDraftFormYesNoGroup>

      <template v-if="stepSevenData.property.outdoorSpace.hasLand">
        <em class="body-xs">Add optional land parcel details</em>
        
        <OrganismsDraftLandForm
          v-model="stepSevenData.property.outdoorSpace.land"
        />
      </template>
    </div>

    <AtomsDivider />

    <!-- General Outdoor Features -->
    <div class="step__section">
      <MoleculesDraftFormHeading 
        title="General Outdoor Features" 
        :required="false"
        variant="section"
      />
      <em class="body-xs">Select any features that apply to the overall outdoor space</em>
      
      <OrganismsDraftFormCheckboxGroup
        title="Outdoor Features"
        :options="outdoorSpaceFeaturesOptions"
        :model-value="getSelectedOutdoorSpaceFeatures()"
        name="outdoor-space-features"
        @update:modelValue="updateOutdoorSpaceFeatures"
      >
        <template #tooltip-content>
          <AtomsTooltipParagraphs :paragraphs="[
            'Select any features that apply to the entire outdoor space (not specific to individual gardens, yards, or land). These are general features that describe the overall outdoor area.'
          ]" />
        </template>
      </OrganismsDraftFormCheckboxGroup>
    </div>

    <AtomsDivider />

    <div class="step__section">
      <MoleculesDraftFormHeading 
        title="Total Outdoor Area" 
        :required="false"
        variant="section"
      />
      <em class="body-xs">Optional total size of all outdoor spaces combined</em>
      
      <OrganismsDraftFormSizeToggle
        title="Total Outdoor Area"
        :options="sizeOptions"
        :unit="'meter'"
        :size="stepSevenData.property.outdoorSpace.totalArea"
        name="total-outdoor-area"
        @update:unit="() => {}"
        @update:size="(value: number | null) => stepSevenData.property.outdoorSpace.totalArea = value"
      >
        <template #tooltip-content>
          <AtomsTooltipParagraphs :paragraphs="[
            'Enter the total outdoor area including gardens, yards, and land (in square meters or square feet)'
          ]" />
        </template>
      </OrganismsDraftFormSizeToggle>
    </div>
  </CreateListingStepsStepLayout>
</template>

<script setup lang="ts">
import { gardenPositionOptions, gardenFacingOptions, outdoorSpaceFeaturesOptions } from '../../utils/draft/step-seven';

const sizeOptions = [
  { value: 'meter', key: 'm²', info: 'Square meters' },
  { value: 'feet', key: 'ft²', info: 'Square feet' },
];

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
} = useDraftStepForm(stepConfig, props.draft);

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
      sunTerrace: false,
      terrace: false,
      balcony: false,
      patio: false,
      separateParcel: false,
      shed: false,
      summerHouse: false,
      gardenOffice: false,
      pool: false,
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
      sunTerrace: false,
      terrace: false,
      balcony: false,
      patio: false,
      separateParcel: false,
      shed: false,
      summerHouse: false,
      gardenOffice: false,
      pool: false,
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
      woodland: false,
      paddock: false,
      stables: false,
      tennisCourt: false,
      orchard: false,
      pond: false,
      outbuilding: false,
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
  const features: string[] = [];
  const outdoorSpace = stepSevenData.value.property.outdoorSpace;
  
  outdoorSpaceFeaturesOptions.forEach((option) => {
    if (outdoorSpace[option.value as keyof typeof outdoorSpace]) {
      features.push(option.value);
    }
  });
  return features;
};

const updateOutdoorSpaceFeatures = (selectedFeatures: string[]) => {
  const outdoorSpace = stepSevenData.value.property.outdoorSpace;
  
  // Reset all features
  outdoorSpaceFeaturesOptions.forEach((option) => {
    (outdoorSpace as any)[option.value] = false;
  });
  
  // Set selected features
  selectedFeatures.forEach((feature) => {
    (outdoorSpace as any)[feature] = true;
  });
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


