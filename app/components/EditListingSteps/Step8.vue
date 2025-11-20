<template>
  <EditListingStepsStepLayout
    title="Additional Features"
    info="Add details about additional features, parking, security, accessibility, and storage options for your property."
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

    <!-- Additional Features -->
    <div class="step__section">
      <MoleculesListingFormHeading 
        title="Additional Features" 
        variant="section"
      />
      
      <OrganismsListingFormTextGroup
        title="Description"
        v-model="(stepEightData.property.additionalFeatures as any).description"
        name="additional-features-description"
        placeholder="Describe additional features..."
        :expanded="true"
      >
        <template #tooltip-content>
          <AtomsTooltipParagraphs :paragraphs="[
            'Describe any special features, amenities, or unique selling points of the property that don\'t fit in other categories.'
          ]" />
        </template>
      </OrganismsListingFormTextGroup>

      <OrganismsListingFormCheckboxGroup
        title="Features"
        :options="additionalFeaturesOptions"
        v-model="stepEightData.property.additionalFeatures!.features"
        name="additional-features"
      >
        <template #tooltip-content>
          <p>Select amenities and features that add value to the property, such as pool, gym, concierge services, etc.</p>
        </template>
      </OrganismsListingFormCheckboxGroup>
    </div>

    <AtomsDivider />

    <!-- Parking -->
    <div class="step__section">
      <MoleculesListingFormHeading 
        title="Parking" 
        variant="section"
      />
      
      <OrganismsListingFormTextGroup
        title="Description"
        v-model="(stepEightData.property.parking as any).description"
        name="parking-description"
        placeholder="Describe parking arrangements..."
        :expanded="true"
      >
        <template #tooltip-content>
          <p>Provide details about parking availability, number of spaces, restrictions, or costs associated with parking.</p>
        </template>
      </OrganismsListingFormTextGroup>

      <OrganismsListingFormCheckboxGroup
        title="Parking Options"
        :options="parkingOptions"
        v-model="stepEightData.property.parking!.features"
        name="parking"
      >
        <template #tooltip-content>
          <p>Select the types of parking available, such as garage, driveway, permit parking, EV charging, etc.</p>
        </template>
      </OrganismsListingFormCheckboxGroup>
    </div>

    <AtomsDivider />

    <!-- Security Features -->
    <div class="step__section">
      <MoleculesListingFormHeading 
        title="Security Features" 
        :required="false"
        variant="section"
      />
      
      <OrganismsListingFormTextGroup
        title="Description"
        v-model="(stepEightData.property.securityFeatures as any).description"
        name="security-description"
        placeholder="Describe security features..."
        :expanded="true"
      >
        <template #tooltip-content>
          <p>Detail the security measures in place, including systems, monitoring, and physical security features.</p>
        </template>
      </OrganismsListingFormTextGroup>

      <OrganismsListingFormCheckboxGroup
        title="Security Features"
        :options="securityOptions"
        v-model="stepEightData.property.securityFeatures!.features"
        name="security"
      >
        <template #tooltip-content>
          <p>Select the security features available, such as CCTV, alarm systems, gated community, 24/7 security, etc.</p>
        </template>
      </OrganismsListingFormCheckboxGroup>
    </div>

    <AtomsDivider />

    <!-- Accessibility Features -->
    <div class="step__section">
      <MoleculesListingFormHeading 
        title="Accessibility Features" 
        :required="false"
        variant="section"
      />
      
      <OrganismsListingFormTextGroup
        title="Description"
        v-model="(stepEightData.property.accessibilityFeatures as any).description"
        name="accessibility-description"
        placeholder="Describe accessibility features..."
        :expanded="true"
      >
        <template #tooltip-content>
          <p>Describe accessibility adaptations and features that make the property suitable for people with mobility challenges or disabilities.</p>
        </template>
      </OrganismsListingFormTextGroup>

      <OrganismsListingFormCheckboxGroup
        title="Accessibility Features"
        :options="accessibilityOptions"
        v-model="stepEightData.property.accessibilityFeatures!.features"
        name="accessibility"
      >
        <template #tooltip-content>
          <p>Select accessibility features available, such as wheelchair access, step-free entry, wide doorways, elevator, wet room, etc.</p>
        </template>
      </OrganismsListingFormCheckboxGroup>
    </div>

    <AtomsDivider />

    <!-- Storage Features -->
    <div class="step__section">
      <MoleculesListingFormHeading 
        title="Storage Features" 
        :required="false"
        variant="section"
      />
      
      <OrganismsListingFormTextGroup
        title="Description"
        v-model="(stepEightData.property.storageFeatures as any).description"
        name="storage-description"
        placeholder="Describe storage features..."
        :expanded="true"
      >
        <template #tooltip-content>
          <p>Detail the storage facilities available with the property, including built-in wardrobes, cupboards, loft storage, shed, or garage storage space.</p>
        </template>
      </OrganismsListingFormTextGroup>

      <OrganismsListingFormCheckboxGroup
        title="Storage Features"
        :options="storageOptions"
        v-model="stepEightData.property.storageFeatures!.features"
        name="storage"
      >
        <template #tooltip-content>
          <p>Select the storage facilities available</p>
        </template>
      </OrganismsListingFormCheckboxGroup>
    </div>

    <AtomsDivider />

    <!-- Utility Room -->
    <div class="step__section">
      <MoleculesListingFormHeading 
        title="Utility Room" 
        :required="false"
        variant="section"
      />
      
      <OrganismsListingFormTextGroup
        title="Description"
        v-model="(stepEightData.property.utility as any).description"
        name="utility-description"
        placeholder="Describe the utility room..."
        :expanded="true"
      >
        <template #tooltip-content>
          <p>Describe the utility room features, layout, and what appliances or storage it can accommodate.</p>
        </template>
      </OrganismsListingFormTextGroup>

      <OrganismsListingFormSizeToggle
        title="Utility Room Size"
        :options="sizeOptions"
        :unit="'meter'"
        :size="(stepEightData.property.utility as any).size"
        name="utility-size"
        @update:unit="() => {}"
        @update:size="(value: number | null) => (stepEightData.property.utility as any).size = value"
      >
        <template #tooltip-content>
          <p>
            Not sure how to measure? See our <NuxtLink to="/guides/property-information/room-sizing" target="_blank" rel="noopener" class="link">Room Sizing guide</NuxtLink>.
          </p>
        </template>
      </OrganismsListingFormSizeToggle>

      <OrganismsListingFormCheckboxGroup
        title="Utility Room Features"
        :options="utilityRoomOptions"
        v-model="stepEightData.property.utility!.features"
        name="utility-room"
      >
        <template #tooltip-content>
          <p>
            Select the features available in the utility room, such as plumbing for appliances, sink, or storage space.
          </p>
        </template>
      </OrganismsListingFormCheckboxGroup>
    </div>

  </EditListingStepsStepLayout>
</template>

<script setup lang="ts">
import { additionalFeaturesOptions, parkingOptions, securityOptions, accessibilityOptions, storageOptions, utilityRoomOptions } from '~/utils/listing/step-eight';

const props = defineProps<{
  draft: DraftListingWithFullPayload;
  errorMessage?: string;
}>();

const emit = defineEmits<{
  'updateStepData': [stepData: StepEight, step: number];
  'previousStep': [];
  'nextStep': [];
}>();

const stepConfig = computed(() => ({
  initialData: createInitialStepEightValues(props.draft),
  isValid: (data: StepEight) => stepEightValidation.isStepEightValid(data, props.draft),
  hasExistingData: stepEightValidation.hasExistingStepEightData,
  stepNumber: 8,
}));

const {
  formData: stepEightData,
  hasChanges,
  buttonDisabled,
  buttonText,
  resetForm,
  submitForm: handleSubmit,
} = useListingStepForm(stepConfig, props.draft);

// Direct update handlers for each feature section (no composables)
// v-model on nested fields updates `stepEightData` automatically; no manual setters required.

function submitForm() {
  handleSubmit(
    (data) => {
      emit('updateStepData', data, 8);
    },
    () => emit('nextStep')
  );
}
</script>

