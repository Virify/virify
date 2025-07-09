<template>
  <ul class="m-listing-card-features">
    <li v-for="{ count, icon, iconTitle } of iconList" :key="iconTitle" class="m-listing-card-feature">
      <AtomsIcon :name="iconTitle" :icon="icon" class="icon" />
      <p class="| body-sm">{{ count }}</p>
    </li>
  </ul>
</template>

<script setup lang="ts">
const iconList = computed(() => [
  { count: 1, icon: 'property/bedrooms', iconTitle: 'bedrooms' },
  { count: 2, icon: 'property/bathrooms', iconTitle: 'bathrooms' },
  { count: 3, icon: 'property/receptions', iconTitle: 'receptions' }
])
</script>

<style lang="scss">
ul {
  margin: 0;
}

.m-listing-card-features {
  display: flex;
  gap: var(--size-12);
  list-style: none;
  margin-bottom: var(--size-8);
  padding: 0;
}

.m-listing-card-feature {
  align-items: center;
  display: flex;
  font-weight: var(--font-semibold);
  gap: var(--size-4);

  .icon {
    font-size: var(--font-2xl);
  }
}
</style>
