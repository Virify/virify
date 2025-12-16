<template>
  <div v-if="hasSearchInfo || count > 0" class="m-results-context">
    <AtomsPill v-if="hasSearchInfo" class="m-results-context__pill m-results-context__pill--info | body-sm">
      <AtomsIcon icon="content/search" width="16" height="16" />
      {{ count }} {{ count === 1 ? 'property' : 'properties' }} found
    </AtomsPill>
    <AtomsPill v-for="term in searchTerms" :key="term" class="m-results-context__pill m-results-context__pill--term | body-sm" @click="openFilters">
      <AtomsIcon icon="explore/ai" width="16" height="16" />
      {{ term }}
    </AtomsPill>
    <AtomsPill v-if="locationName" class="m-results-context__pill m-results-context__pill--location | body-sm" @click="openLocation">
      <AtomsIcon icon="explore/map" width="16" height="16" />
      {{ locationName }}
    </AtomsPill>
    <AtomsPill v-if="radiusText" class="m-results-context__pill m-results-context__pill--radius | body-sm" @click="openLocation">
      <AtomsIcon icon="explore/map" width="16" height="16" />
      {{ radiusText }}
    </AtomsPill>
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
const searchTerms = computed(() => {
  if (!props.queryAnalysis?.usedTerms) return []
  return props.queryAnalysis.usedTerms.map(term => 
    term.charAt(0).toUpperCase() + term.slice(1)
  )
})

/**
 * Location name for display - capitalized
 */
const locationName = computed(() => {
  if (!props.location) return ''
  const name = props.location.place_name || props.location.text || ''
  return name.charAt(0).toUpperCase() + name.slice(1)
})

/**
 * Radius text for display
 */
const radiusText = computed(() => {
  if (!props.radius) return ''
  return `Within ${props.radius} Miles`
})

/**
 * Check if we have any search info to display
 */
const hasSearchInfo = computed(() => {
  return searchTerms.value.length > 0 || locationName.value || radiusText.value
})
</script>

<style lang="scss">
.m-results-context {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--size-8);

  &__title {
    margin: 0;
  }

  &__pill {
    display: flex;
    align-items: center;
    gap: var(--size-8);
    padding: var(--size-8) var(--size-16);
    text-transform: capitalize;
    cursor: pointer;
    transition: all 0.2s ease;
    border-radius: var(--border-radius-pill);
    font-weight: var(--font-semibold);
    color: var(--monochrome-900);

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    &--info {
      cursor: default;
      background: light-dark(var(--monochrome-800), var(--monochrome-200));
      border: none;
      color: var(--foreground-100);
      &:hover {
        transform: none;
        box-shadow: none;
      }
    }

    &--term {
      background: light-dark(var(--secondary-500), var(--secondary-400));
      border: none;
    }

    &--location,
    &--radius {
      background: light-dark(var(--blue-500), var(--blue-500));
      border: none;
    }
  }
}
</style>
