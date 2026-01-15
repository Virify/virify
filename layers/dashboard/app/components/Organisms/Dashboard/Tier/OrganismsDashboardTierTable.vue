<template>
  <UPricingTable
    :tiers="tableTiers"
    :sections="tableSections"
    class="max-w-5xl m-auto"
    :ui="{
      th: 'body-md! p-2',
      td: 'body-xs! p-0!',
    }"
  >
    <!-- Basic Title/Price -->
    <template #basic-title="{ tier }">
      <span class="title-sm mb-0 text-(--foreground-100)">{{ tier.title }}</span>
    </template>

    <template #basic-price="{ tier }">
      <span class="title-md mt-0 mb-0 font-semibold text-(--foreground-100)">{{ tier.price }}</span>
    </template>

    <!-- Premium Title/Price -->
    <template #premium-title="{ tier }">
      <span class="title-sm mb-0 text-primary dark:text-(--blue-600)">{{ tier.title }}</span>
    </template>

    <template #premium-price="{ tier }">
      <span class="title-md mt-0 mb-0 text-primary dark:text-(--blue-600)">{{ tier.price }}</span>
    </template>

    <!-- Professional Title/Price -->
    <template #professional-title="{ tier }">
      <span class="title-sm mb-0! text-secondary">{{ tier.title }}</span>
    </template>

    <template #professional-price="{ tier }">
      <span class="title-md mt-0! mb-0! text-secondary">{{ tier.price }}</span>
    </template>

    <!-- Generic Description -->
    <template #description="{ tier }">
      <p class="body-sm text-foreground">{{ tier.description }}</p>
    </template>

    <!-- Features -->
    <template #feature-value="{ feature, tier }">
      <UIcon
        v-if="feature.tiers?.[tier.id] === true"
        name="i-lucide-circle-check"
        class="size-5 shrink-0 mx-auto"
        :class="[tier.id === 'basic' && 'text-(--foreground-100)', tier.id === 'premium' && 'text-primary dark:text-(--blue-600)', tier.id === 'professional' && 'text-secondary']"
      />
      <UIcon v-else-if="feature.tiers?.[tier.id] === false" name="i-lucide-minus" class="size-5 shrink-0 text-muted mx-auto" />
      <span v-else class="text-sm text-muted block text-center">{{ feature.tiers?.[tier.id] }}</span>
    </template>

    <!-- Buttons -->
    <template #basic-button="{ tier }">
      <UButton v-bind="tier.button" :label="tier.button.label" block class="body-sm cursor-pointer text-center" />
    </template>

    <template #premium-button="{ tier }">
      <UButton v-bind="tier.button" :label="tier.button.label" block class="body-sm cursor-pointer text-white!" />
    </template>
    
    <template #professional-button="{ tier }">
      <UButton v-bind="tier.button" :label="tier.button.label" block class="body-sm cursor-pointer text-white!" />
    </template>
  </UPricingTable>
</template>
