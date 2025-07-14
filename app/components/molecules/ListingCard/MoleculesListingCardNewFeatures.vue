<template>
  <ul class="m-listing-card-features" aria-label="Property features">
    <li v-for="{ count, icon, iconTitle } of iconList.filter(item => item.count)" :key="iconTitle" class="m-listing-card-feature" 
        :aria-label="`${count} ${iconTitle}`">
      <AtomsIcon :name="iconTitle" :icon="icon" class="icon" :aria-hidden="true" :title="`${count} ${iconTitle}`" />
      <p class="| body-sm" :title="`${count} ${iconTitle}`">{{ count }}</p>
    </li>
  </ul>
</template>
<script setup lang="ts">

const props = defineProps<{
  bedrooms?: number | null;
  bathrooms?: number | null;
  receptions?: number | null;
}>();

const iconList = computed(() => [
  { count: props.bedrooms, icon: 'property/bedrooms', iconTitle: 'bedrooms' },
  { count: props.bathrooms, icon: 'property/bathrooms', iconTitle: 'bathrooms' },
  { count: props.receptions, icon: 'property/receptions', iconTitle: 'receptions' }
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
