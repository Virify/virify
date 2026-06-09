<template>
  <!-- <UPageColumns> -->
  <UPricingPlans orientation="vertical">
    <UPricingPlan
      title="Standard Listing"
      description="Only professional accounts can create listings during early access, if you want to upgrade your account for free please head to your account settings."
      badge="Free to use"
      variant="subtle"
      price="Free"
      orientation="horizontal"
      hightlight
      :ui="{
        title: 'title-sm mb-0!',
        featureTitle: 'text-xs',
        description: 'body-sm text-foreground',
        features: 'mt-2 mb-0! gap-2',
        featureIcon: 'text-(--foreground-50)',
        badge: 'bg-foreground-100/10 text-foreground-100 border-foreground-100!',
        price: 'title-md mt-0! mb-0!',
        priceWrapper: 'mt-2 mb-2',
      }"
      :features="basicFeaturesFormatted"
      :button="{
        label: 'Create Listing',
        color: 'neutral',
        variant: 'subtle',
        size: 'xs',
        class: ' body-sm cursor-pointer',
        disabled: !(isAdmin || (createListing && (isAgent || isUser))),
        onClick: () => openConfirmOrCreateModal(ListingTier.BASIC),
      }"
    >
      <template #description>
        <p>Only professional accounts can create listings during early access, if you want to upgrade your account for free please head to your account settings.</p>
        <span
          class="body-xs"
          v-if="isUser"
          >Please note, you must complete personal ID and property ownership verification checks to publish your listing.</span
        >
      </template>
    </UPricingPlan>
    <UPricingPlan
      title="Subscriptions"
      badge="Coming Soon"
      orientation="horizontal"
      variant="subtle"
      price="TBC"
      :ui="{
        title: 'title-sm mb-0!',
        featureTitle: 'text-xs',
        description: 'body-sm text-foreground',
        features: 'mt-2 mb-0! gap-2',
        featureIcon: 'text-(--foreground-50)',
        badge: 'bg-foreground-100/10 text-foreground-100 border-foreground-100!',
        price: 'title-md mt-0! mb-0!',
        priceWrapper: 'mt-2 mb-2',
      }"
      :features="subFeaturesFormatted"
      :button="{
        label: 'Coming Soon',
        color: 'neutral',
        variant: 'subtle',
        size: 'xs',
        class: ' body-sm cursor-pointer',
        disabled: true,
      }"
    >
      <template #description>
        <p>Our subscription offers additional and enhanced tooling for property marketing.</p>
        <span class="body-xs">Please note, not all of the above features may be available immediately and we are always adding to our features.</span>
      </template>
    </UPricingPlan>
  </UPricingPlans>

  <UModal
    v-model:open="confirmOwnershipModalOpen"
    title="Ownership Verification"
    :ui="{
      title: 'title-sm',
      description: 'body-sm text-foreground gap-2 flex flex-col ',
    }"
  >
    <template #description>
      <UAlert
        variant="soft"
        color="info"
        icon="i-lucide-circle-alert"
      >
        <template #description>
          <p class="body-sm">You must complete personal ID and property ownership verification checks to publish your listing</p>
        </template>
      </UAlert>
      <UAlert
        variant="soft"
        color="secondary"
        icon="i-lucide-book-open"
      >
        <template #description>
          <p class="body-sm">You can do this by clicking on the 'Verify Ownership' badge on your draft listing card</p>
        </template>
      </UAlert>
      <UButton
        color="neutral"
        variant="outline"
        size="xs"
        class="body-sm max-w-fit"
        @click="closeConfirmOwnershipModal(ListingTier.BASIC)"
      >
        OK
      </UButton>
    </template>
  </UModal>
  <!-- </UPageColumns> -->
</template>

<script setup lang="ts">
  import { ListingTier } from "~~/layers/database/server/database/prisma/generated/enums";

  const { isAgent, isAdmin, isUser, createListing } = useFeatureFlag();

  const emit = defineEmits<{
    "select-tier": [tier: ListingTier];
  }>();

  const confirmOwnershipModalOpen = ref<boolean>(false);

  const closeConfirmOwnershipModal = (tier: ListingTier) => {
    confirmOwnershipModalOpen.value = false;
    emit("select-tier", tier);
  };

  const openConfirmOrCreateModal = (tier: ListingTier) => {
    if (isAdmin.value || (createListing.value && isAgent.value)) {
      emit("select-tier", tier);
    } else {
      confirmOwnershipModalOpen.value = true;
    }
  };

  // Format features from tiers.ts config for UPricingPlan
  const basicFeaturesFormatted = basicFeatures.map((f: string) => ({ title: f }));
  const subFeaturesFormatted = subFeatures.map((f: string) => ({ title: f }));
</script>
