<template>
  <UModal
    v-model:open="isOpen"
    :dismissible="false"
    :fullscreen="isMobile"
    :ui="{
      overlay: 'backdrop-blur-sm',
      content: 'max-w-7xl h-full lg:h-[85vh] lg:max-h-[85vh] bg-(--background-200) dark:bg-(--background-100)! flex flex-col overflow-hidden',
      body: 'flex-1 min-h-0 flex flex-col overflow-hidden p-0!',
    }"
  >
    <template #title>
      <h2 class="title-md m-0!">{{ modalTitle }}</h2>
    </template>
    <template #body>
      <!-- Mobile: Accordion -->
      <OrganismsDashboardCreateListingAccordion
        v-if="isMobile"
        :steps="steps"
        v-model="currentStepValue"
        class="h-full overflow-y-auto p-4"
      />

      <!-- Tablet and above: Stepper -->
      <OrganismsDashboardCreateListingStepper
        v-else
        :steps="steps"
        v-model="currentStepValue"
        class="h-full"
      />
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
import type { ListingTier } from '~~/layers/database/server/database/prisma/generated/enums';

const emit = defineEmits<{
  'close': []
}>();

const breakpoints = useBreakpoints(breakpointsTailwind);
const activeBreakpoints = breakpoints.active();

const isMobile = computed(() => {
  return !activeBreakpoints.value.includes("lg") && !activeBreakpoints.value.includes("xl") && !activeBreakpoints.value.includes("2xl");
});

// Use the shared composable for all step state management
const {
  steps,
  currentStepValue,
  draftListingId,
  editingListingId,
  startNewListing,
  loadDraftListing,
  loadListing,
} = useCreateListingSteps();

const isOpen = ref(false);
const mode = ref<'create' | 'draft' | 'edit'>('create');

// Dynamic title based on mode
const modalTitle = computed(() => {
  switch (mode.value) {
    case 'create':
      return 'Create a New Listing';
    case 'draft':
      return 'Continue Draft';
    case 'edit':
      return 'Edit Listing';
    default:
      return 'Listing Editor';
  }
});

/**
 * Open the modal for creating a new listing
 */
async function openForNewListing(tier: ListingTier) {
  mode.value = 'create';
  startNewListing(tier);
  isOpen.value = true;
}

/**
 * Open the modal for editing an existing draft
 */
async function openForDraft(draftId: number) {
  mode.value = 'draft';
  await loadDraftListing(draftId);
  isOpen.value = true;
}

/**
 * Open the modal for editing a published listing
 */
async function openForListing(listingId: number) {
  mode.value = 'edit';
  await loadListing(listingId);
  isOpen.value = true;
}

/**
 * Close the modal
 */
function close() {
  isOpen.value = false;
}

// Watch isOpen to emit close event when modal is closed (by any method)
watch(isOpen, (newValue, oldValue) => {
  if (oldValue && !newValue) {
    emit('close');
  }
});

// Provide closeModal to child components (step forms use this)
provide('closeModal', close);

// Expose methods to parent components
defineExpose({
  openForNewListing,
  openForDraft,
  openForListing,
  close,
  isOpen,
});
</script>
