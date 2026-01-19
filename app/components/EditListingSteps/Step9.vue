<template>
  <EditListingStepsStepLayout
    title="Energy & Costs"
    info="Add details about energy efficiency, heating systems, utilities, council tax, and running costs of your property."
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

    <!-- Energy & Utilities -->
    <div class="step__section">
      <MoleculesListingFormHeading 
        title="Energy Performance & Utilities" 
        :required="true"
        variant="section"
      />
      <em class="body-xs">Required, provide energy and utility information</em>
      
      <OrganismsListingFormTextGroup
        title="Description"
        v-model="(stepNineData.property.energyAndUtilities as any).description"
        name="energy-description"
        placeholder="Describe energy and utility features..."
        :expanded="true"
      >
        <template #tooltip-content>
          <AtomsTooltipParagraphs :paragraphs="[
            'Provide additional details about energy efficiency features, heating systems, or utility connections.'
          ]" />
        </template>
      </OrganismsListingFormTextGroup>

      <OrganismsListingFormSelectGroup
        title="EPC Rating"
        :options="epcRatingOptions"
        v-model="(stepNineData.property.energyAndUtilities as any).epcRating"
        name="epc-rating"
        :required="true"
      >
        <template #tooltip-content>
          <p>See our <NuxtLink to="/guides/property-information/energy-performance-certificate" target="_blank" rel="noopener" class="link">Energy Performance Certificate (EPC)</NuxtLink> guide for more information.</p>
        </template>
      </OrganismsListingFormSelectGroup>

      <OrganismsListingFormCheckboxGroup
        title="Primary Heating"
        :options="heatingTypeOptions"
        v-model="stepNineData.property.energyAndUtilities!.primaryHeatingType"
        name="primary-heating"
      >
        <template #tooltip-content>
          <p>Leave unselected if not applicable.</p>
        </template>
      </OrganismsListingFormCheckboxGroup>

      <OrganismsListingFormCheckboxGroup
        title="Secondary Heating"
        :options="heatingTypeOptions"
        v-model="stepNineData.property.energyAndUtilities!.secondaryHeatingType"
        name="secondary-heating"
      >
        <template #tooltip-content>
          <AtomsTooltipParagraphs :paragraphs="[
            'Optional - select any additional or backup heating systems available in the property.'
          ]" />
        </template>
      </OrganismsListingFormCheckboxGroup>

      <OrganismsListingFormRadioGroup
        title="Boiler Type"
        :options="boilerTypeOptions"
        v-model="(stepNineData.property.energyAndUtilities as any).boilerType"
        name="boiler-type"
      >
        <template #tooltip-content>
          <p>Leave unselected if not applicable.</p>
        </template>
      </OrganismsListingFormRadioGroup>

      <OrganismsListingFormRadioGroup
        title="Hot Water Source"
        :options="hotWaterSourceOptions"
        v-model="(stepNineData.property.energyAndUtilities as any).hotWaterSource"
        name="hot-water-source"
      >
        <template #tooltip-content>
          <p>Leave unselected if not applicable.</p>
        </template>
      </OrganismsListingFormRadioGroup>

      <OrganismsListingFormCheckboxGroup
        title="Renewable Energy"
        :options="renewableEnergyOptions"
        v-model="stepNineData.property.energyAndUtilities!.renewables"
        name="renewable-energy"
      >
        <template #tooltip-content>
          <AtomsTooltipParagraphs :paragraphs="[
            'Select any renewable energy sources or smart home features installed in the property, such as solar panels, battery storage, or EV charging points.'
          ]" />
        </template>
      </OrganismsListingFormCheckboxGroup>

      <OrganismsListingFormCheckboxGroup
        title="Connected Utilities"
        :options="connectedUtilitiesOptions"
        v-model="stepNineData.property.energyAndUtilities!.connectedUtilities"
        name="connected-utilities"
      >
        <template #tooltip-content>
          <AtomsTooltipParagraphs :paragraphs="[
            'Select all utilities that are connected to the property, including mains connections and alternative systems like septic tanks.'
          ]" />
        </template>
      </OrganismsListingFormCheckboxGroup>
    </div>

    <AtomsDivider />

    <!-- Running Costs -->
    <div class="step__section">
      <MoleculesListingFormHeading 
        title="Running Costs" 
        :required="true"
        variant="section"
      />
      <em class="body-xs">Required, provide council tax and other cost information</em>
      
      <OrganismsListingFormSelectGroup
        title="Council Tax Band"
        :options="councilTaxBandOptions"
        v-model="stepNineData.property.runningCosts!.councilTaxBand"
        name="council-tax-band"
        :required="true"
      >
        <template #tooltip-content>
          <p>For more information see our <NuxtLink to="/guides/property-information/council-tax-band" target="_blank" rel="noopener" class="link">Council Tax Band</NuxtLink> guide.</p>
        </template>
      </OrganismsListingFormSelectGroup>

      <OrganismsListingFormNumberGroup
        v-if="draft.rentalListing || draft.saleListing?.tenureType === 'LEASEHOLD'"
        title="Service Charges (per annum)"
        v-model="(stepNineData.property.runningCosts as any).serviceCharges"
        name="service-charges"
        placeholder="e.g., 1200"
        :min="0"
        :step="1"
      >
        <template #tooltip-content>
          <p>For more information see our <NuxtLink to="/guides/property-information/ground-rent-and-service-charge" target="_blank" rel="noopener" class="link">Ground Rent & Service Charge</NuxtLink> guide.</p>
        </template>
      </OrganismsListingFormNumberGroup>

      <OrganismsListingFormNumberGroup
        v-if="draft.rentalListing || draft.saleListing?.tenureType === 'LEASEHOLD'"
        title="Ground Rent (per annum)"
        v-model="(stepNineData.property.runningCosts as any).groundRent"
        name="ground-rent"
        placeholder="e.g., 250"
        :min="0"
        :step="1"
      >
        <template #tooltip-content>
          <p>For more information see our <NuxtLink to="/guides/property-information/ground-rent-and-service-charge" target="_blank" rel="noopener" class="link">Ground Rent & Service Charge</NuxtLink> guide.</p>
        </template>
      </OrganismsListingFormNumberGroup>
    </div>

  </EditListingStepsStepLayout>
</template>

<script setup lang="ts">

const props = defineProps<{
  draft: DraftListingWithFullPayload;
  errorMessage?: string;
}>();

const emit = defineEmits<{
  'updateStepData': [stepData: StepNine, step: number];
  'previousStep': [];
  'nextStep': [];
}>();

const stepConfig = computed(() => ({
  initialData: createInitialStepNineValues(props.draft),
  isValid: (data: StepNine) => stepNineValidation.isStepNineValid(data, props.draft),
  hasExistingData: stepNineValidation.hasExistingStepNineData,
  stepNumber: 9,
}));

const {
  formData: stepNineData,
  hasChanges,
  buttonDisabled,
  buttonText,
  resetForm,
  submitForm: handleSubmit,
} = useListingStepForm(stepConfig, props.draft);


function submitForm() {
  handleSubmit(
    (data) => {
      emit('updateStepData', data, 9);
    },
    () => emit('nextStep')
  );
}
</script>

