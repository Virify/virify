<template>
  <div class="m-results-context">
    <h2 v-if="count" class="m-results-context__title | title-md">
      {{ count }} {{ count === 1 ? 'property' : 'properties' }} found
    </h2>

    <ul class="m-results-context__list">
      <li v-if="location || radiusText">
        <button type="button" class="m-results-context__button" aria-label="Expand location"
          @click.prevent="openLocation">
          <AtomsIcon icon="explore/map" width="16" height="16" />

          <span v-if="location" class="m-results-context__tag">
            {{ location }},
          </span>

          <span v-if="radiusText" class="m-results-context__tag">
            {{ radiusText }}
          </span>
        </button>
      </li>

      <li v-if="sortLabel">
        <button type="button" class="m-results-context__button" aria-label="Change sort order"
          @click.prevent="openSortOrder">
          <AtomsIcon icon="search/sort" width="16" height="16" />

          <span class="m-results-context__tag">
            {{ sortLabel }}
          </span>
        </button>
      </li>

      <li v-if="terms.length">
        <button type="button" class="m-results-context__button" aria-label="Expand filters"
          @click.prevent="openFilters">
          <AtomsIcon icon="explore/ai" width="16" height="16" />

          <span class="m-results-context__tag" v-for="term in terms" :key="term">
            {{ term }}
          </span>
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
interface Props {
  count?: number
  sortBy?: string
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
  sortBy: 'relevance'
})

/**
 * Open sort in the dock
 */
const { setPopoverName } = useDockPopover()

function openSortOrder() {
  setPopoverName('sort-order')
}

function openFilters() {
  setPopoverName('filters')
}

function openLocation() {
  setPopoverName('location')
}

/**
 * Search terms from query analysis - capitalized
 */
const { location, radius, terms } = useActiveSearchTerms()

/**
 * Radius text for display
 */
const radiusText = computed(() => {
  if (!radius && radius !== 0) return ''
  if (radius === 0) return 'This location only'

  return `Within ${radius} Miles`
})

/**
 * Sort label for display
 */
const { sortOrder } = useGlobalSearchState()

const sortLabel = computed(() => {
  const match = selectOptionSortOrder.find(({ value }) => {
    return value === sortOrder.value
  })

  return (match || selectOptionSortOrder[0]!).key
})

</script>

<style lang="scss">
@use "#styles/_utils/media" as mq;

.m-results-context {
  --results-context-gap: var(--size-4);
  --results-context-spacing: var(--size-8);

  overflow: hidden;

  &__title {
    margin: 0;
  }

  &__list {
    list-style: none;
    margin: var(--size-10) 0 var(--size-32);
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: var(--results-context-gap);
    column-gap: var(--results-context-spacing);

    // To allow overflow auto on child flexed elements
    li {
      overflow: hidden;
    }
  }

  &__button {
    display: flex;
    overflow: auto;
    max-width: 100%;
    align-items: center;
    gap: var(--results-context-gap);
    white-space: nowrap;
    font-size: var(--font-xs);
    line-height: var(--lineheight-sm);
    font-weight: var(--font-semisemibold);
    border: 1px solid light-dark(var(--blue-700), var(--blue-300));
    border-radius: var(--border-radius-lg);
    padding: var(--results-context-gap);
    cursor: pointer;

    @include mq.tablet {
      font-size: var(--font-sm);
      border-radius: var(--border-radius-xl);
    }

    .a-icon {
      color: light-dark(var(--blue-400), var(--blue-600));
      margin: 0 var(--size-4) 0 var(--size-6);
      width: var(--size-24);
      height: var(--size-24);
      flex: 0 0 auto;
    }
  }

  &__tag {
    display: block;
    color: light-dark(var(--primary-400), var(--monochrome-900));
    border: 1px solid var(--primary-background-200);
    background: var(--primary-background-100);
    padding: var(--size-4) var(--size-10);
    border-radius: var(--border-radius-md);
    transition: border-color var(--animation-fast) var(--ease-in-out);

    @include mq.tablet {
      border-radius: var(--border-radius-lg);
    }
  }

  &__overflow {
    display: block;
    margin-right: calc(var(--results-context-gap) * 3);
    margin-left: var(--results-context-gap);
  }

  &__button:focus {
    outline: none;
    border-color: light-dark(var(--blue-600), var(--blue-400));
  }

  &__button:hover &__tag,
  &__button:focus &__tag {
    border-color: var(--primary-500);
  }
}
</style>
