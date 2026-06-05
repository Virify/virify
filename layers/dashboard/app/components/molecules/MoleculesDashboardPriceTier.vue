<template>
  <!-- <UPageColumns> -->
  <UPricingPlans orientation="vertical">
    <UPricingPlan
      title="Standard Listing"
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
        badge:
          'bg-foreground-100/10 text-foreground-100 border-foreground-100!',
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
        onClick: () => emit('select-tier', ListingTier.BASIC),
      }"
    >
      <template #description>
        <p>
          Our standard listing is free to use and includes all the essential
          features you need to create and manage your property listings.
        </p>
        <span class="body-xs italic">
          Please note, you must complete
          <UTooltip
            text="Owner verification involves sumbitting two documents to confirm identify and verify ownership status"
          >
            <span class="underline">owner verification</span>
          </UTooltip>
          checks to publish your listing.
        </span>
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
        badge:
          'bg-foreground-100/10 text-foreground-100 border-foreground-100!',
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
        <p>
          Our subscription offers additional and enhanced tooling for property
          marketing.
        </p>
        <span class="body-xs italic">
          Please note, not all of the above features may be available
          immediately and we are always adding to our features.
        </span>
      </template>
    </UPricingPlan>
  </UPricingPlans>
  <!-- </UPageColumns> -->
</template>

<script setup lang="ts">
import { ListingTier } from "~~/layers/database/server/database/prisma/generated/enums";

const { isAgent, isAdmin, createListing, role } = useFeatureFlag();
const isUser = computed(() => role.value === "USER");

const emit = defineEmits<{
  "select-tier": [tier: ListingTier];
}>();

// Format features from tiers.ts config for UPricingPlan
const basicFeaturesFormatted = basicFeatures.map((f: string) => ({ title: f }));
const subFeaturesFormatted = subFeatures.map((f: string) => ({ title: f }));
</script>
