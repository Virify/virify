<template>
  <div class="create-listing-hero">
    <AtomsStatsCard 
      v-for="tier in tiers" 
      :key="tier.value"
      :value="tier.value" 
      title="Create Listing" 
      :animated="true" 
      :tier="tier.tier" 
      :to="'#'" 
    />
  </div>
</template>

<script setup lang="ts">
const tiers = [
  { value: 'Premium', tier: 'premium' as const },
  { value: 'Featured', tier: 'featured' as const },
  { value: 'Basic', tier: 'basic' as const }
]
</script>

<style scoped lang="scss">
.create-listing-hero {
  display: grid;
  gap: var(--size-16);
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}
</style>