<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar
        :ui="{
          title: 'title-sm m-0!',
          right: 'flex items-center gap-4',
        }"
      >
        <template #title>
          <MoleculesDashboardBreadcrumb />
        </template>

        <template #right>
          <OrganismsDashboardNotificationButton />
        </template>
      </UDashboardNavbar>
      <MoleculesDashboardPasswordAlert />
    </template>

    <template #body>
      <OrganismsDashboardTierTable @create-listing="openModal" />
      <!-- Create Listing Modal -->
      <UModal
        v-model:open="isModalOpen"
        :dismissible="false"
        scrollable
        :fullscreen="isMobile"
        :ui="{
          overlay: 'backdrop-blur-sm',
          content: 'max-w-7xl h-full lg:h-auto bg-(--background-200) dark:bg-(--background-100)!',
        }"
      >
        <template #title>
          <h2 class="title-md m-0!">Create a New Listing</h2>
        </template>
        <template #body>
          <!-- Mobile: Accordion -->
          <OrganismsDashboardCreateListingAccordion
            v-if="isMobile"
            :steps="steps"
            v-model="currentStepValue"
          />

          <!-- Tablet and above: Stepper -->
          <OrganismsDashboardCreateListingStepper
            v-else
            :steps="steps"
            v-model="currentStepValue"
          />
        </template>
      </UModal>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core"
import type { ListingTier } from '~~/layers/database/server/database/prisma/generated/enums'

definePageMeta({
  middleware: ["authenticated"],
  head: {
    title: "Create a listing",
    icon: "i-lucide-home",
  },
  layout: "dashboard",
})

const breakpoints = useBreakpoints(breakpointsTailwind)
const activeBreakpoints = breakpoints.active()

const isMobile = computed(() => {
  return !activeBreakpoints.value.includes("lg") && !activeBreakpoints.value.includes("xl") && !activeBreakpoints.value.includes("2xl")
})

// Use the composable for all step state management
const {
  steps,
  currentStepValue,
  modalStatesArray,
  openStepModal,
  updateModalState,
  nextStep,
  startNewListing,
} = useCreateListingSteps()

const isModalOpen = ref(false)

const openModal = (tier: ListingTier) => {
  startNewListing(tier)
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

// Provide closeModal to child components
provide('closeModal', closeModal)
</script>
