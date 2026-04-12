<template>
  <div class="m-results-context">
    <h2 class="m-results-context__title | title-md">
      {{ count }} {{ count === 1 ? 'property' : 'properties' }} found
    </h2>

    <ul class="m-results-context__list">
      <li>
        <button type="button" class="m-results-context__button" aria-label="Expand location"
          @click.prevent="openLocation">
          <AtomsIcon icon="explore/map" width="16" height="16" />

          <span class="m-results-context__tag">
            {{ locationName }},
          </span>

          <span class="m-results-context__tag">
            {{ radiusText }}
          </span>
        </button>
      </li>

      <li>
        <button v-if="visibleSearchTerms.length" type="button" class="m-results-context__button"
          aria-label="Expand filters" @click.prevent="openFilters">
          <AtomsIcon icon="explore/ai" width="16" height="16" />

          <span class="m-results-context__tag" v-for="term in visibleSearchTerms" :key="term">
            {{ term }}
          </span>

          <span v-if="overflowSearchTerms" class="m-results-context__overflow">
            and {{ overflowSearchTerms }} more
          </span>
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
interface Props {
  count?: number
  queryAnalysis?: QueryAnalysis | null
  location?: GeocodingFeature | null
  radius?: number
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
  queryAnalysis: null,
  location: null,
  radius: 0
})

const emit = defineEmits<{
  'open-popover': [type: 'location' | 'filters']
}>()

/**
 * Open filters in the dock
 */
function openFilters() {
  emit('open-popover', 'filters')
}

/**
 * Open location in the dock
 */
function openLocation() {
  emit('open-popover', 'location')
}

/**
 * Search terms from query analysis - capitalized
 */
const searchTermsFormatted = computed(() => {
  const { usedTerms } = asObject(props.queryAnalysis)

  // If no search terms exist, return nothing
  if (!Array.isArray(usedTerms)) return []

  // Format the list
  return usedTerms.filter(isString).map(term => {
    return term.charAt(0).toUpperCase() + term.slice(1)
  })
})

const visibleSearchTerms = computed(() => {
  const usedTerms = searchTermsFormatted.value

  // If less than 4 used terms exist, return as-is
  if (usedTerms.length < 4) {
    return searchTermsFormatted.value
  }

  // Else only return the first 2
  return usedTerms.slice(0, 2)
})

const overflowSearchTerms = computed(() => {
  const usedTerms = searchTermsFormatted.value

  // If less than 4 used terms exist, no overflow
  if (usedTerms.length < 4) {
    return 0
  }

  // Else overflow is total length minus 2
  return usedTerms.length - 2
})

/**
 * Location name for display
 */
const locationName = computed(() => {
  if (!props.location) return ''
  return props.location.place_name_en || props.location.place_name || ''
})

/**
 * Radius text for display
 */
const radiusText = computed(() => {
  if (props.radius == null) return ''
  if (props.radius === 0) return 'This location only'
  return `Within ${props.radius} Miles`
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
    border: 1px solid light-dark(var(--blue-600), var(--blue-400));
    border-radius: var(--border-radius-lg);
    padding: var(--results-context-gap);
    cursor: pointer;

    @include mq.tablet {
      font-size: var(--font-sm);
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
    border-radius: var(--border-radius-sm);
    transition: border-color var(--animation-fast) var(--ease-in-out);
  }

  &__overflow {
    display: block;
    margin-right: calc(var(--results-context-gap) * 3);
    margin-left: var(--results-context-gap);
  }

  &__button:focus {
    outline: none;
  }

  &__button:hover &__tag,
  &__button:focus &__tag {
    border-color: var(--primary-500);
  }
}
</style>
