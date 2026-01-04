<template>
  <div class="account-header">
    <h2 class="account-header__title | title-md">{{ title }}</h2>
    <div v-if="showSearchControls" class="account-header__controls">
      <div class="account-header__search-filter-row">
        <AtomsInput v-model="searchTerm" type="text" :placeholder="placeholder" autocomplete="off" class="body-sm" />
        <AtomsSelect v-model="categoryFilter" :options="filterOptions"
          class="account-header__filter-select | body-sm" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">

const searchTerm = defineModel<string>('searchTerm');
const categoryFilter = defineModel<string>('categoryFilter');

const props = defineProps<{
  filterOptions?: { key: string; value: string }[];
  title: string;
  placeholder?: string;
}>();

const showSearchControls = computed(() => {
  return searchTerm.value !== undefined && categoryFilter.value !== undefined && props.filterOptions && props.filterOptions.length > 0;
});

</script>
<style lang="scss">
@use "#styles/_utils/media" as mq;

.account-header {
  background: var(--background-200);
  border-radius: var(--border-radius-xl);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: var(--size-24);

  &__title {
    margin: 0;
  }

  &__controls {
    width: 100%;
    margin-top: var(--size-16);
  }

  &__search-filter-row {
    display: grid;
    grid-template-columns: 3fr 1fr;
    gap: var(--size-12);
    align-items: center;

    @include mq.tablet {
      grid-template-columns: 2fr 1fr;
    }

    @include mq.mobile-only {
      grid-template-columns: 1fr;
      gap: var(--size-8);
    }
  }

  &__filter-select {
    min-width: 160px;
    padding: var(--size-8) var(--size-12);
    border: 1px solid var(--border-color-200);

    @include mq.mobile-only {
      width: 100%;
      min-width: unset;
    }
  }
}
</style>