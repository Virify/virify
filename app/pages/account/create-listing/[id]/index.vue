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
                v-if="draft" 
                :is="!stepperMap[currentStep]?.component"
                :draft="stepperMap[currentStep]?.data" 
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
const draft = computed(() => draftListing(Number(route.params.id)));
const { draftListing, updateDraftStepOne, updateDraftStepTwo } = useDraftListing();
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
      rentalListing: draft.value?.rentalListing || null,
      saleListing: draft.value?.saleListing || null,
      property: draft.value?.property || null,
    },
    complete: !!(draft.value?.property?.type && draft.value?.property?.classification),
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

const handleUpdateStepData = async (stepData: StepOne & StepTwo, step: number) => {
  if(!draft?.value?.id) return;

  const stepToUpdate = computed(() => stepperMap.value[step - 1]?.update).value;

  if (stepToUpdate) {
    await stepToUpdate(draft.value.id, stepData);
     // Optionally, move to the next step after updating
    if (currentStep.value < stepperMap.value.length - 1) {
      currentStep.value += 1;
    }
  }
}

// When the draft (and therefore step completion flags) becomes available,
// set the current step to the first incomplete step so a hard refresh resumes
watch(stepperMap, (newSlides) => {
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