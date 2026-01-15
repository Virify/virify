<template>
  <UPageColumns class="max-w-500 m-auto">
    <UPricingPlan
      title="Basic"
      description="Entry level tier"
      badge="Most value"
      variant="soft"
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
      :features="basicFeatures"
      :button="{
        label: 'Create Listing',
        color: 'neutral',
        variant: 'subtle',
        size: 'xs',
        class: ' body-sm cursor-pointer',
      }"
    />
    <UPricingPlan
      title="Premium"
      description="Our premium tier"
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
      :features="premiumFeatures"
      :button="{
        label: 'Create Listing',
        color: 'primary',
        variant: 'solid',
        size: 'xs',
        class: ' body-sm text-white! cursor-pointer',
      }"
    />
    <UPricingPlan
      title="Professional"
      description="Tier designed for professionals"
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
      :features="professionalFeatures"
      :button="{
        label: 'Create Listing',
        color: 'secondary',
        variant: 'solid',
        size: 'xs',
        class: ' body-sm text-white!',
      }"
    />
  </UPageColumns>
</template>
