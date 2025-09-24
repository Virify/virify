<template>
  <!-- stepper -->
  <div class="p-listing-creator">
    <MoleculesBreadcrumb :items="breadcrumbItems" />

    <ClientOnly>
      <OrganismsAccountListingStepper v-model="currentStep" :stepper-slides="stepperMapProp" />
    </ClientOnly>

    <!-- Current step content -->
    <div class="p-listing-creator__content">
      <AtomsAccountCardContainer>
        <ClientOnly>
          <div class="p-listing-creator__content-inner">
            <p class="body-xs"><em>Step {{ currentStep + 1 }} of {{ stepperMap.length }}</em></p>
            
              <component
                v-if="draft && currentSlide.component"
                :is="currentSlide.component"
                :draft="currentSlide.data"
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
definePageMeta({
  middleware: ["authenticated"],
  head: {
    title: "Listing Creator",
  },
  layout: "account",
});

import CreateListingStepsStep1 from '~/components/create-listing-steps/Step1.vue';
import CreateListingStepsStep2 from '~/components/create-listing-steps/Step2.vue';

const route = useRoute();
const { draftListing, updateDraftStepOne, updateDraftStepTwo } = useDraftListing();
const draft = computed(() => draftListing(Number(route.params.id)));
const currentStep = ref(0);

const stepperMap = computed(() => [
  { 
    title: 'Listing Type',
    data: {
      saleListing: draft.value?.saleListing || null,
      rentalListing: draft.value?.rentalListing || null
    },
    complete: !!(draft.value?.saleListing || draft.value?.rentalListing),
    update: updateDraftStepOne,
    component: CreateListingStepsStep1
  },
  { 
    title: 'Property',
    data: {
      property: draft.value?.property || null,
    },
    complete: !!(
      draft.value?.property?.type && 
      draft.value?.property?.classification && 
      draft.value?.property?.description && 
      draft.value?.property?.totalFloors
    ),
    update: updateDraftStepTwo,
    component: CreateListingStepsStep2
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


// Stepper configuration (reactive)
const stepperMapProp = computed(() => stepperMap.value.map(s => ({ title: s.title, complete: s.complete })));
// current slide helper (loose any typing to avoid template TS strictness)
const currentSlide: any = computed(() => stepperMap.value[currentStep.value] || {});
const _stepperInitialized = ref(false);

const handleUpdateStepData = async (stepData: StepOne & StepTwo, step: number) => {
  if(!draft?.value?.id) return;

  const stepToUpdate = computed(() => stepperMap.value[step - 1]?.update).value;

  if (stepToUpdate) {
    try {
      await stepToUpdate(draft.value.id, stepData);
      currentStep.value ++;
      
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to save step data:', err);
    }
  }
}

// Scroll to top when the current step changes (client only)
if (import.meta.client) {
  watch(currentStep, () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/**
 * Determine and set the initial step once when stepper data first becomes available.
 * This prevents subsequent updates to `stepperMap` (for example, after saving a step)
 * from overriding whatever step the user is currently viewing.
 */
function setInitialStepIfNeeded(slides: Array<{ complete?: boolean }>) {
  // already set
  if (_stepperInitialized.value) return;

  // no slides yet
  if (!Array.isArray(slides) || slides.length === 0) return;

  // find first incomplete step or default to step 0
  const firstIncompleteIndex = slides.findIndex(s => !s.complete);
  currentStep.value = firstIncompleteIndex >= 0 ? firstIncompleteIndex : 0;
  _stepperInitialized.value = true;
}

/**
 * Watch for stepper data to become available and set initial step if needed.
 */
watch(stepperMap, (slides) => {
  setInitialStepIfNeeded(slides);
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