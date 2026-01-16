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
        scrollable
        :ui="{
          overlay: 'bg-black/50 backdrop-blur-sm',
          content: 'w-[90vw]! max-w-9xl',
        }"
      >
        <template #title>
          <h2 class="title-md m-0!">Create a New Listing</h2>
          <p>Step {{ currentStep }} of {{ steps.length }}</p>
        </template>
        <template #body>
          <!-- TODO: THIS IS A PROTOTYPE OF THE MULTI-STEP CREATE LISTING MODAL -->
          <UStepper
            ref="stepper"
            :items="steps"
            :current-step="currentStep"
            color="secondary"
            :orientation="isMobile ? 'vertical' : 'horizontal'"
            class="w-full"
            size="lg"
            :ui="{
              separator: 'text-secondary! bg-secondary!',
              title: 'text-sm! sm:text-sm!',
              header: 'min-w-[50%]!',
            }"
          >
            <template #step1="{ item }">
              <!-- Step 1 informational content -->
              <div class="min-h-50 m-auto justify-center items-center border-dashed border hidden sm:flex">
                <p class="body-md m-auto">We require x, y and z for this step - click button below to open the step form.</p>
              </div>
              <div class="flex flex-col gap-2">
                <p class="body-sm">Click to open information about Step 1:</p>
                <UButton class="" @click="isStepOneOpen = true" color="secondary" block>Open Step Info</UButton>
                <p class="body-sm">Click to open the step form:</p>
                <UButton class="" @click="isStepOneOpen = true" color="secondary" block>Open Step here</UButton>
              </div>
              <UModal
                v-model:open="isStepOneOpen"
                scrollable
                :ui="{
                  overlay: 'bg-black/50 backdrop-blur-sm',
                  content: 'w-[90vw]! max-w-9xl',
                }"
              >
                <template #title>
                  <h2 class="title-md m-0!">Step 1: Listing Type</h2>
                </template>
                <template #body>
                  <div class="flex min-h-50 m-auto justify-center items-center border-dashed border">
                    <p class="body-md m-auto">Step Form here</p>
                  </div>
                </template>
                <template #footer>
                  <div class="flex justify-end gap-4">
                    <UButton @click="isStepOneOpen = false" label="Cancel" size="xs" color="neutral" variant="outline" class="body-sm" />
                    <UButton @click="isStepOneOpen = false" label="Save and Continue" color="secondary" class="body-sm" />
                  </div>
                </template>
              </UModal>
            </template>
          </UStepper>
        </template>
        <template #footer>
          <div class="flex justify-end gap-4">
            <UButton @click="isModalOpen = false" label="Cancel" size="xs" color="neutral" variant="outline" class="body-sm" />
            <UButton @click="handleNextStep" :label="currentStep < steps.length ? 'Next Step' : 'Finish'" color="secondary" class="body-sm" />
          </div>
        </template>
      </UModal>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["authenticated"],
  head: {
    title: "Create a listing",
    icon: "i-lucide-home",
  },
  layout: "dashboard",
});

interface CreateListingStep {
  title: string;
  description?: string;
  content?: string;
  slot: string;
}

import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
const breakpoints = useBreakpoints(breakpointsTailwind);
const activeBreakpoints = breakpoints.active();

const isMobile = computed(() => {
  return !activeBreakpoints.value.includes("lg") && !activeBreakpoints.value.includes("xl") && !activeBreakpoints.value.includes("2xl");
});

const isModalOpen = ref(false);
const isStepOneOpen = ref(false);
const currentStep = ref(1);
const stepper = useTemplateRef("stepper");

const steps: CreateListingStep[] = [
  { title: "Listing Type", content: "This is step 1", slot: "step1" },
  { title: "Property Basics", content: "Type and description", slot: "step2" },
  { title: "Price", content: "Pricing details", slot: "step3" },
  { title: "Address", content: "Property location", slot: "step4" },
  { title: "Bedrooms & Bathrooms", content: "Room details", slot: "step5" },
  { title: "Living Spaces", content: "Kitchens, receptions & other rooms", slot: "step6" },
  { title: "Outdoor & Utilities", content: "Gardens and outdoor space", slot: "step7" },
  { title: "Additional Features", content: "Parking, security & storage", slot: "step8" },
  { title: "Energy & Costs", content: "EPC and running costs", slot: "step9" },
  { title: "Property Images", content: "Upload photos", slot: "step10" },
];

const formState = ref({
  type: null as "sale" | "rent" | null,
  tenure: null as string | null,
  chain: null as string | null,
  billsIncluded: null as string | null,
  furnished: null as string | null,
});

const openModal = () => {
  isModalOpen.value = true;
  currentStep.value = 1;
};

const handleNextStep = () => {
  if (currentStep.value < steps.length) {
    currentStep.value++;
  } else {
    isModalOpen.value = false;
  }
};
</script>
