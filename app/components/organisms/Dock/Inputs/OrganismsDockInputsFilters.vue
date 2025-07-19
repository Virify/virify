<template>
  <button type="button" class="o-dock-inputs-filters" :class="{
    'o-dock-inputs-filters--active': isExpanded
  }">
    <span v-if="isLoading" class="o-dock-inputs-filters__pending-icon">
      <AtomsIcon title="Pending" icon="animated-dots/animated-dots" />
    </span>

    <template v-else>
      <AtomsIcon class="o-dock-inputs-filters__icon" icon="search/filter" />

      <span role="presentation" class="o-dock-inputs-filters__text">
        Filters
      </span>

      <span role="presentation" class="o-dock-inputs-filters__count | body-xs" :class="{
        'o-dock-inputs-filters__count--empty': !filtersCount
      }">
        {{ filtersCount }}
      </span>
    </template>
  </button>
</template>


<script setup lang="ts">
const { searchState, isLoading } = useSearchState()

/**
 *  Count filters
 */
const filtersCount = computed(() => {
  const { queryAnalysis } = asObject(searchState.value)

  console.log('queryAnalysis', JSON.parse(JSON.stringify(queryAnalysis)))

  return queryAnalysis?.usedTerms?.length || 0
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

  &[disabled] {
    cursor: not-allowed;
    color: light-dark(var(--monochrome-500), var(--monochrome-600));
  }

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

    &--active:not([disabled]) {
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

  &__pending-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 4.5ch;

    @include mq.tablet {
      width: 11ch;
    }

    .a-icon {
      width: var(--size-24);
      height: var(--size-24);
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

  &--active:not([disabled]) &__count {
    background: var(--secondary-300);
  }
}
</style>