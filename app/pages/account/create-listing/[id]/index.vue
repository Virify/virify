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
            <p class="p-listing-creator__content-inner--stepper | body-xs"><em>Step {{ currentStep + 1 }} of {{ stepperMap.length }}</em></p>
              <component
                v-if="draft && (currentSlide as any).component"
                :is="(currentSlide as any).component"
                :draft="draft"
                @update-step-data="handleUpdateStepData"
                @next-step="() => nextStep(draftId, stepperMap.length)"
                @previous-step="() => previousStep(draftId)"
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

const route = useRoute();
const { getCurrentStep, determineInitialStep, nextStep, previousStep, cleanupDraftStep } = useDraftStep();
const { getDraft, getStepperMap, getStepperProps, getCurrentStepData, handleStepUpdate } = useDraft();

const draftId = Number(route.params.id);
const draft = getDraft(draftId);
const currentStep = getCurrentStep(draftId);
const stepperMap = getStepperMap(draftId);
const stepperMapProp = getStepperProps(draftId);
const currentSlide = getCurrentStepData(draftId, currentStep);

const handleUpdateStepData = async (stepData: StepOne & StepTwo, step: number) => {
  const success = await handleStepUpdate(draftId, stepperMap, stepData, step);
  if (success) {
    nextStep(draftId, stepperMap.value.length);
  }
}

// Initialize step when stepper data becomes available
watch(stepperMap, (steps) => {
  if (steps.length > 0) {
    determineInitialStep(draftId, steps);
  }
}, { immediate: true });

// Scroll to top when the current step changes (client only)
if (import.meta.client) {
  watch(currentStep, () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Clean up when component unmounts
onBeforeUnmount(() => {
  // Only clear if we're navigating to a different page entirely
  const currentPath = window.location.pathname;
  if (!currentPath.includes(`/account/create-listing/${draftId}`)) {
    cleanupDraftStep(draftId);
  }
});

/**
 * Breadcrumb items for navigation
 */
const breadcrumbItems = computed(() => [
  { label: 'Account', to: '/account' },
  { label: 'Draft Listings', to: '/account/create-listing' },
  { label: draft.value?.id ? `Draft #${draft.value.id}` : `Draft #${route.params.id}` }
]);

</script>
<style lang="scss">
@use '#styles/_utils/media' as mq;
.p-listing-creator {
  display: flex;
  flex-direction: column;
  
  &__content {
    padding: var(--size-16) 0;
    background: var(--background-100);

    &-inner {
      padding: var(--size-32);
      
      @include mq.mobile-only {
        padding: var(--size-16);
      }

      &--stepper {
        margin-bottom: var(--size-16);
      }
    }
  }
}
</style>