<template>
  <!-- <UPageColumns> -->
  <div>
    <UPricingPlan
      title="Personal Tier"
      badge="Free to use"
      variant="subtle"
      price="Free"
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
        onClick: () => emit('select-tier', ListingTier.BASIC),
      }"
      class="w-full self-center max-w-200 mx-auto mb-8"
    />
    <!-- <UPricingPlan
      title="Premium"
      description="Enhanced visibility"
      price="Free"
      variant="subtle"
      badge="Serious sellers"
      :ui="{
        title: 'title-sm mb-0! text-primary dark:text-(--blue-600)',
        featureTitle: 'text-xs',
        description: 'body-sm text-foreground',
        features: 'mt-2 mb-0! gap-2',
        featureIcon: 'text-(--blue-400) dark:text-(--blue-600)',
        badge: 'bg-primary text-white border-primary',
        price: 'title-md mt-0! mb-0! text-primary dark:text-(--blue-600)',
        priceWrapper: 'mt-2 mb-2',
      }"
      :features="premiumFeaturesFormatted"
      :button="{
        label: 'Create Listing',
        color: 'primary',
        variant: 'solid',
        size: 'xs',
        class: ' body-sm text-white! cursor-pointer',
        onClick: () => emit('select-tier', ListingTier.PREMIUM),
      }"
    />
    <UPricingPlan
      title="Professional"
      description="Professional features"
      price="Free"
      badge="Professionals"
      variant="soft"
      :ui="{
        title: 'title-sm mb-0! text-secondary',
        featureTitle: 'text-xs',
        description: 'body-sm text-foreground',
        features: 'mt-2 mb-0! gap-2',
        featureIcon: 'text-secondary',
        badge: 'bg-secondary/10 text-secondary border-secondary',
        price: 'title-md mt-0! mb-0! text-secondary',
        priceWrapper: 'mt-2 mb-2',
      }"
      :features="professionalFeaturesFormatted"
      :button="{
        label: 'Create Listing',
        color: 'secondary',
        variant: 'solid',
        size: 'xs',
        class: ' body-sm text-white! cursor-pointer',
        onClick: () => emit('select-tier', ListingTier.FEATURED),
      }"
    /> -->
  </div>
  <!-- </UPageColumns> -->
</template>

<script setup lang="ts">
import { ListingTier } from '~~/layers/database/server/database/prisma/generated/enums';

const emit = defineEmits<{
  'select-tier': [tier: ListingTier]
}>();

// Format features from tiers.ts config for UPricingPlan
const basicFeaturesFormatted = basicFeatures.map((f: string) => ({ title: f }));
// const premiumFeaturesFormatted = premiumFeatures.map((f: string) => ({ title: f }));
// const professionalFeaturesFormatted = professionalFeatures.map((f: string) => ({ title: f }));
</script>
