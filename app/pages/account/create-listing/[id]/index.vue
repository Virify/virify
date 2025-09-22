<template>
  <!-- stepper -->
  <div class="p-listing-creator">
    <MoleculesBreadcrumb :items="breadcrumbItems" />

    <OrganismsAccountListingStepper v-model="currentStep" :stepper-slides="stepperSlides"
      @step-change="handleStepChange" />

    <!-- Current step content -->
    <div class="p-listing-creator__content">
      <AtomsAccountCardContainer>
        <div class="p-listing-creator__content-inner">
          <p class="body-xs"><em>Step {{ currentStep + 1 }} of {{ stepperSlides.length }}</em></p>
          <currentStepComponent :draft="draft" />
        </div>
      </AtomsAccountCardContainer>

    </div>
  </div>
</template>
<script setup lang="ts">
import CreateListingStepsStep1 from '~/components/create-listing-steps/Step1.vue';

definePageMeta({
  middleware: ["authenticated"],
  head: {
    title: "Listing Creator",
  },
  layout: "account",
});

const route = useRoute();
const { draftListing } = useDraftListing();
const draft = draftListing(Number(route.params.id));
const currentStep = ref(0);

// Stepper configuration
const stepperSlides = [
  { title: 'Listing Type' },
  { title: 'Property' },
  { title: 'Price' },
  { title: 'Description' },
  { title: 'Address' },
  { title: 'Rooms' },
  { title: 'Additional' },
  { title: 'Energy' },
  { title: 'Outdoor' },
  { title: 'Media' }
];

// Component mapping for each step
const stepComponents: Record<number, any> = {
  0: CreateListingStepsStep1,
  // Add more steps as you create them:
  // 1: CreateListingStepsStep2,
  // 2: CreateListingStepsStep3,
  // etc.
};

// Get current step component
const currentStepComponent = computed(() => {
  return stepComponents[currentStep.value] || CreateListingStepsStep1;
});

// Breadcrumb items - handle hydration mismatch
const breadcrumbItems = computed(() => [
  { label: 'Account', to: '/account' },
  { label: 'Create Listing', to: '/account/create-listing' },
  { label: draft?.id ? `Draft #${draft.id}` : `Draft #${route.params.id}` }
]);

// Handle step change from stepper component
const handleStepChange = (step: number) => {
  console.log('Step changed to:', step);
  // Add any additional logic here when step changes
};

</script>
<style lang="scss">
.p-listing-creator {
  &__content {
    padding: var(--size-16) 0;

    &-inner {
      padding: var(--size-32);
    }
  }
}
</style>