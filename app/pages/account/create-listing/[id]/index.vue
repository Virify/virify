<template>
  <!-- stepper -->
  <MoleculesBreadcrumb :items="breadcrumbItems" />
  
  <OrganismsAccountListingStepper 
    v-model="currentStep" 
    @step-change="handleStepChange" 
  />

  <!-- Current step content -->
  <AtomsAccountCardContainer>
    <div class="p-listing-creator__content">
      <h2 class="title-lg">{{ stepNames[currentStep] || 'Step' }}</h2>
      <p class="body-sm">Content for {{ stepNames[currentStep] || 'this step' }} goes here.</p>
    </div>
  </AtomsAccountCardContainer>

  <pre class="body-sm">{{ draft }}</pre>
</template>
<script setup lang="ts">
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

// Breadcrumb items - handle hydration mismatch
const breadcrumbItems = computed(() => [
  { label: 'Account', to: '/account' },
  { label: 'Create Listing', to: '/account/create-listing' },
  { label: draft?.id ? `Draft #${draft.id}` : `Draft #${route.params.id}` }
]);

// Current step state
const currentStep = ref(0);

// Step names for content display
const stepNames = [
  'Listing Type',
  'Property',
  'Price',
  'Description',
  'Address',
  'Rooms',
  'Additional',
  'Energy',
  'Outdoor',
  'Media'
];

// Handle step change from stepper component
const handleStepChange = (step: number) => {
  console.log('Step changed to:', step);
  // Add any additional logic here when step changes
};
</script>
<style lang="scss">
.p-listing-creator {
  &__content {
    padding: var(--size-24);
    text-align: center;
    
    h2 {
      color: var(--secondary-400);
    }
    
    p {
      color: var(--monochrome-600);
    }
  }
}
</style>