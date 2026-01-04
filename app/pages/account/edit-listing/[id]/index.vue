<template>
  <!-- stepper -->
  <div class="p-listing-creator">
    <MoleculesBreadcrumb :items="breadcrumbItems" />

    <!-- Current step content -->
    <div class="p-listing-creator__content">
      <AtomsAccountCardContainer>
        <ClientOnly>
          <OrganismsAccountListingStepper v-model="currentStep" :stepper-slides="stepperMapProp" />
        </ClientOnly>
        <ClientOnly>
          <div class="p-listing-creator__content-inner">
              <component
                v-if="listing && (currentSlide as any).component"
                :is="(currentSlide as any).component"
                :draft="listing"
                :error-message="stepErrorMessage"
                @update-step-data="handleUpdateStepData"
                @next-step="handleNextStep"
                @previous-step="() => previousStep(listingId)"
              />
            <div v-else class="loading">Loading listing...</div>
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
    title: "Edit Listing",
  },
  layout: "account",
});

const route = useRoute();
const { getCurrentStep, determineInitialStep, nextStep, previousStep, cleanupListingStep } = useListingStep();
const { getStepperMap, getStepperProps, getCurrentStepData, handleStepUpdate } = useListingEditor();
const { showToast } = useToast();

const listingId = Number(route.params.id);

// Fetch the live listing data
const { data: listing, refresh: refreshListing } = await useAsyncData<ListingWithFullProperty | null>(
  `listing-${listingId}`,
  async () => await useRequestFetch()<ListingWithFullProperty>(`/api/listings/${listingId}`)
);

const currentStep = getCurrentStep(listingId);
const stepperMap = getStepperMap(listingId, listing as Ref<ListingWithFullProperty | null>);
const stepperMapProp = getStepperProps(listingId, listing as Ref<ListingWithFullProperty | null>);
const currentSlide = getCurrentStepData(listingId, currentStep, listing as Ref<ListingWithFullProperty | null>);

const stepUpdateInProgress = ref(false);
const lastStepUpdateFailed = ref(false);
const stepErrorMessage = ref<string>('');

const handleUpdateStepData = async (stepData: any, step: number) => {
  try {
    stepUpdateInProgress.value = true;
    lastStepUpdateFailed.value = false;
    stepErrorMessage.value = '';
    
    const result = await handleStepUpdate(listingId, stepperMap, stepData, step, listing as Ref<ListingWithFullProperty | null>);
    
    if (result.success) {
      // Show success toast with step-specific message
      const stepTitle = stepperMap.value[step - 1]?.title || 'Step';
      showToast(`${stepTitle} updated`, { type: 'success' });
      
      // Refresh the listing data after update
      await refreshListing();
      
      // Success - move to next step
      nextStep(listingId, stepperMap.value.length);
    } else {
      // Failure - display error and prevent navigation
      lastStepUpdateFailed.value = true;
      stepErrorMessage.value = result.errorMessage || 'An unexpected error occurred. Please try again.';
    }
  } finally {
    stepUpdateInProgress.value = false;
  }
}

const handleNextStep = () => {
  // Prevent navigation if the last update failed or is in progress
  if (lastStepUpdateFailed.value || stepUpdateInProgress.value) {
    return;
  }
  
  // Clear error message when successfully moving to next step
  stepErrorMessage.value = '';
  nextStep(listingId, stepperMap.value.length);
};

// Clear error message when user navigates to different step
watch(currentStep, () => {
  stepErrorMessage.value = '';
});

// Initialize step when stepper data becomes available (only once)
const hasInitialized = ref(false);
watch(stepperMap, (steps) => {
  if (steps.length > 0 && listing.value && !hasInitialized.value) {
    // Live listings don't have completedSteps, so all steps are considered complete
    const completedSteps = isDraftListing(listing.value) ? (listing.value.completedSteps || []) : [];
    determineInitialStep(listingId, completedSteps, steps);
    hasInitialized.value = true;
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
  if (!currentPath.includes(`/account/edit-listing/${listingId}`)) {
    cleanupListingStep(listingId);
  }
});

/**
 * Breadcrumb items for navigation
 */
const breadcrumbItems = computed(() => [
  { label: 'Account', to: '/account' },
  { label: 'My Listings', to: '/account/my-listings' },
  { label: listing.value?.id ? `Listing #${listing.value.id}` : `Listing #${route.params.id}` }
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
      padding: var(--size-16) var(--size-32);
      
      @include mq.mobile-only {
        padding: var(--size-8);
      }

      &--stepper {
        margin-bottom: var(--size-16);
      }
    }
  }
}
</style>
