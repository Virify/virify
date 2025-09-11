<template>
  <div class="create-listing-hero">
    <AtomsStatsCard 
      v-for="tier in tiers" 
      :key="tier.tier"
      :value="tier.tier" 
      title="Create Listing" 
      :subtitle="formattedPrice(tier.price) + ' / month'"
      :animated="true" 
      :tier="tier.tier"
      @click.prevent="createTier(tier)"
    />
  </div>
</template>

<script setup lang="ts">

const tiers: TierOption[] = [
  { tier: 'basic', price: 12.99 },
  { tier: 'featured', price: 24.99 },
  { tier: 'premium', price: 49.99 },
];

const formattedPrice = (price: number) => {
  return `£${price.toFixed(2)}`;
};

const emit = defineEmits<{
  (e: 'create', tier: TierOption): void
}>()

function createTier(tier: TierOption) {
  emit('create', tier);
}
</script>

<style scoped lang="scss">
.create-listing-hero {
  display: grid;
  gap: var(--size-16);
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  text-transform: capitalize;
  
  & > * {
    cursor: pointer;
  }
}
</style>