<template>
  <!-- stepper -->
  <div class="p-listing-creator">
    <MoleculesBreadcrumb :items="breadcrumbItems" />

    <ClientOnly>
      <OrganismsAccountListingStepper v-model="currentStep" :stepper-slides="stepperSlidesProp" />
    </ClientOnly>

    <!-- Current step content -->
    <div class="p-listing-creator__content">
      <AtomsAccountCardContainer>
        <ClientOnly>
          <div class="p-listing-creator__content-inner">
            <p class="body-xs"><em>Step {{ currentStep + 1 }} of {{ stepperSlides.length }}</em></p>
            
              <currentStepComponent 
                v-if="draft" 
                :draft="stepperSlidesData[currentStep]" 
                @update-step-data="handleUpdateStepData"
                @next-step="currentStep++"
                @previous-step="currentStep--"
              />
            <div v-else class="loading">Loading draft...</div>
          </div>
        </ClientOnly>
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

const stepperSlides = computed(() => [
  { 
    title: 'Listing Type',
    data: {
      saleListing: draft.value?.saleListing || null,
      rentalListing: draft.value?.rentalListing || null
    },
    complete: !!(draft.value?.saleListing || draft.value?.rentalListing)
  },
  { 
    title: 'Property',
    data: {
      rentalListing: draft.value?.rentalListing || null,
      saleListing: draft.value?.saleListing || null,
      property: draft.value?.property || null,
    },
    complete: !!draft.value?.property
  },
  { title: 'Address' },
  { title: 'Price' },
  { title: 'Description' },
  { title: 'Rooms' },
  { title: 'Additional' },
  { title: 'Energy' },
  { title: 'Outdoor' },
  { title: 'Media' }
]);

const currentStep = ref(0);

// Stepper configuration (reactive)
const stepperSlidesProp = computed(() => stepperSlides.value.map(s => ({ title: s.title, complete: s.complete })));
const stepperSlidesData = computed(() => stepperSlides.value.map(s => s.data || {}));

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
  if (currentStep.value < stepperSlides.value.length - 1) {
    currentStep.value += 1;
  }
};

// When the draft (and therefore step completion flags) becomes available,
// set the current step to the first incomplete step so a hard refresh resumes
watch(stepperSlides, (newSlides) => {
  const idx = newSlides.findIndex(s => !s.complete);
  currentStep.value = idx >= 0 ? idx : 0;
}, { immediate: true });

// Breadcrumb items
const breadcrumbItems = computed(() => [
  { label: 'Account', to: '/account' },
  { label: 'Draft Listings', to: '/account/create-listing' },
  { label: draft.value?.id ? `Draft #${draft.value.id}` : `Draft #${route.params.id}` }
]);
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