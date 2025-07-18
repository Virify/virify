<template>
  <button type="button" class="o-dock-inputs-filters" :class="{
    'o-dock-inputs-filters--active': isExpanded
  }">
    <AtomsIcon class="o-dock-inputs-filters__icon" icon="search/filter" />

    <span role="presentation" class="o-dock-inputs-filters__text">
      Filters
    </span>

    <span role="presentation" class="o-dock-inputs-filters__count | body-xs" :class="{
      'o-dock-inputs-filters__count--empty': !filtersCount
    }">
      {{ filtersCount }}
    </span>
  </button>
</template>


<script setup lang="ts">
const { state } = useUniversalSearch()
const { filters } = toRefs(state.value)

/**
 *  Count filters
 */
const filtersCount = computed(() => {
  const { type, options } = asObject(filters.value)

  // If AI search is used, get usedTerms
  if (type === 'ai') {
    const { usedTerms = [] } = asObject((options as Record<string, unknown>)?.queryAnalysis)

    return (usedTerms as string[]).length || 0
  }

  // @TODO for traditional search
  return 0
})

/**
 *  Is expanded styling
 */
interface Props {
  isExpanded?: boolean
}

defineProps<Props>()
</script>

<style lang="scss">
@use '#styles/_utils/media' as mq;

.o-dock-inputs-filters {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--size-6);
  background: var(--background-300);
  border-radius: var(--border-radius-2xl);
  padding: var(--size-6);
  padding-left: var(--size-12);
  padding-right: var(--size-10);
  line-height: var(--size-24);
  font-size: var(--font-md);
  font-weight: var(--font-semibold);
  white-space: nowrap;
  flex: 1 0 auto;
  width: 100%;

  @include mq.tablet {
    padding-right: var(--size-6);
  }

  .a-icon {
    flex: 0 0 auto;
    width: var(--size-24);
    height: var(--size-24);
  }

  @include mq.tablet {
    font-size: var(--font-sm);
    gap: var(--size-10);

    &--active {
      background-color: var(--secondary-400);
      color: var(--monochrome-900);
    }
  }

  &__text {
    display: none;

    @include mq.tablet {
      display: unset;
    }
  }

  &__count {
    margin: 0;
    padding: 0;
    display: block;
    text-align: center;
    flex: 0 0 auto;
    width: var(--size-28);
    height: var(--size-28);
    line-height: var(--size-28);
    background: var(--secondary-400);
    color: var(--monochrome-900);
    border-radius: var(--border-radius-pill);
    margin-left: auto;

    &--empty {
      background-color: light-dark(var(--monochrome-600), var(--monochrome-400));
    }
  }

  &--active &__count {
    background: var(--secondary-300);
  }
}
</style>