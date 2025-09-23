<template>
  <!-- stepper -->
  <div class="p-listing-creator">
    <MoleculesBreadcrumb :items="breadcrumbItems" />

    <OrganismsAccountListingStepper v-model="currentStep" :stepper-slides="stepperSlidesProp"
      @step-change="handleStepChange" />

    <!-- Current step content -->
    <div class="p-listing-creator__content">
      <AtomsAccountCardContainer>
        <div class="p-listing-creator__content-inner">
          <p class="body-xs"><em>Step {{ currentStep + 1 }} of {{ stepperSlides.length }}</em></p>
          <currentStepComponent 
            v-if="draft" 
            :draft="stepperSlidesData[currentStep]" 
            @update-step-data="handleUpdateStepData"
            @next-step="currentStep++"
          />
          <div v-else class="loading">Loading draft...</div>
        </div>
      </AtomsAccountCardContainer>

    </div>
  </div>
</template>
<script setup lang="ts">
import CreateListingStepsStep1 from '~/components/create-listing-steps/Step1.vue';
import CreateListingStepsStep2 from '~/components/create-listing-steps/Step2.vue';

definePageMeta({
  middleware: ["authenticated"],
  head: {
    title: "Listing Creator",
  },
  layout: "account",
});

const route = useRoute();
const { draftListing, updateDraftStepOne } = useDraftListing();
const draft = computed(() => draftListing(Number(route.params.id)));
const currentStep = ref(0);


// Stepper configuration
const stepperSlides = [
  { 
    title: 'Listing Type',
    data: {
      saleListing: draft.value?.saleListing || null,
      rentalListing: draft.value?.rentalListing || null
    },
    complete: !!(draft.value?.saleListing || draft.value?.rentalListing)
  },
  { title: 'Property', complete: !!draft.value?.property },
  { title: 'Price' },
  { title: 'Description' },
  { title: 'Address' },
  { title: 'Rooms' },
  { title: 'Additional' },
  { title: 'Energy' },
  { title: 'Outdoor' },
  { title: 'Media' }
];

const stepperSlidesProp = stepperSlides.map(s => ({ title: s.title, complete: s.complete }));
const stepperSlidesData = stepperSlides.map(s => s.data || {});

// Component mapping for each step
const stepComponents: Record<number, any> = {
  0: CreateListingStepsStep1,
  1: CreateListingStepsStep2
  // Add more steps as you create them:
  // 1: CreateListingStepsStep2,
  // 2: CreateListingStepsStep3,
  // etc.
};

// Get current step component
const currentStepComponent = computed(() => {
  return stepComponents[currentStep.value] || CreateListingStepsStep1;
});

const handleUpdateStepData = async (stepData: StepOne) => {
  console.log('Received step data from child:', stepData);
  if(!draft?.value?.id) return;
  await updateDraftStepOne(draft.value.id, stepData);
  // Optionally, move to the next step after updating
  if (currentStep.value < stepperSlides.length - 1) {
    currentStep.value += 1;
  }
};

// Breadcrumb items
const breadcrumbItems = computed(() => [
  { label: 'Account', to: '/account' },
  { label: 'Create Listing', to: '/account/create-listing' },
  { label: draft.value?.id ? `Draft #${draft.value.id}` : `Draft #${route.params.id}` }
]);

// Handle step change from stepper component
const handleStepChange = (step: number) => {
  console.log('Step changed to:', step);
  // Add any additional logic here when step changes
};

</script>
<style lang="scss">
.p-listing-creator {
  display: flex;
  flex-direction: column;
  &__content {
    padding: var(--size-16) 0;

    &-inner {
      padding: var(--size-32);
    }
  }
}
</style>