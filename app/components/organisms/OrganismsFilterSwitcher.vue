<template>
  <div class="o-property-filter">
    <MoleculesSwitcher name="search-type" legend="Change search type" :options="toggleSearchType" v-model="searchType"
      class="o-property-filter__switcher" />

    <template v-if="searchType === 'traditional'">
      <slot name="traditional"></slot>
    </template>

    <template v-else>
      <slot name="ai"></slot>
    </template>
  </div>
</template>

<script setup lang="ts">
/**
 *  Toggle between search variant
 */
const searchType = useState('search-type', () => 'ai')

const toggleSearchType = [
  { value: 'Traditional', key: 'traditional' },
  { value: 'AI enhanced', key: 'ai' }
]

</script>

<style lang="scss">
.o-property-filter {

  &__switcher {
    --switcher-outer-radius: var(--border-radius-2xl);
    --switcher-inner-radius: var(--border-radius-xl);
    --switcher-outer-padding: var(--size-6);
    --switcher-highlight-offset: var(--size-6);
    --switcher-inner-padding: var(--size-10) var(--size-16);

    max-width: 34ch;
    margin: 0 auto var(--size-16);

    &--titled {
      margin: 0 auto var(--size-32);
    }
  }
}
</style>