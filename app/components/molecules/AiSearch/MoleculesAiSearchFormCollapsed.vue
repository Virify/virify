<template>
  <div class="m-search-form-collapsed | flex">

    <!-- Preview query -->
    <AtomsButtonUnstyled class="m-search-form-collapsed__summary | font-semibold" @click.prevent="openForm">
      <span v-for="(option, index) in query" :key="index" :class="{
        '| secondary-400': option.type === 'used',
        '| grey-500 line-through': option.type === 'ignored'
      }">{{ option.text }}</span>

      <span v-if="queryLocation" class="m-search-form-collapsed__summary-location | faded-text">
        <template v-if="!!queryRadius">Within {{ queryRadius }} miles of</template>
        {{ queryLocation }}
      </span>
    </AtomsButtonUnstyled>

    <!-- Controls container -->
    <div class="m-search-form-collapsed__controls">
      <!-- Update radius -->
      <AtomsSelect id="radius-quick" v-model="searchRadius" :options="selectOptionRadius" aria-label="Search radius"
        class="m-search-form-collapsed__select" @click.stop @change="updateSearchRadius" />

      <!-- Sorting -->
      <AtomsSelect v-if="!isMapView" id="sort-by" v-model="sortOrder" :options="selectOptionSortOrder" aria-label="Sort results by"
        class="m-search-form-collapsed__select" @change="updateSortOrder" />

      <!-- View Toggle Button -->
      <AtomsButton v-if="isMapView" @click="toggleView" type="button" 
        class="m-search-form-collapsed__view-toggle | button button-secondary button-sm">
        Show List
      </AtomsButton>
      
      <!-- Show Map Button (desktop/tablet only) -->
      <AtomsButton v-if="!isMapView" @click="toggleView" type="button" 
        class="m-search-form-collapsed__view-toggle m-search-form-collapsed__view-toggle--desktop | button button-secondary button-sm">
        Show Map
      </AtomsButton>
    </div>

    <!-- Mobile expand button -->
    <AtomsButton @click.prevent="openForm" type="button" class="m-search-form-collapsed__close | button button-ghost">
      <AtomsIcon name="arrow-down" icon="expand" />
    </AtomsButton>
  </div>
</template>

<script setup lang="ts">

const { searchState } = useSearchState();

interface Props {
  query?: { type: string, text: string }[]
  queryLocation?: string
  queryRadius?: number
}

defineProps<Props>()

/**
 *  Emits
 */
const emits = defineEmits(['expand-form', 'update-sort-order', 'update-search-radius', 'toggle-view'])

/**
 *  Toggle form open/closed
 */

function openForm() {
  emits('expand-form')
}

/**
 *  Sort order, search radius
 */
const sortOrder = defineModel('sortOrder')
const searchRadius = defineModel('searchRadius')

const isMapView = computed(() => {
  if (import.meta.server) {
    return false; // Always default to list view on server
  }
  return searchState.value?.viewMode === 'map' || false;
});

function updateSortOrder() {
  emits('update-sort-order')
}

function updateSearchRadius() {
  emits('update-search-radius')
}

function toggleView() {
  emits('toggle-view')
}
</script>

<style lang="scss">
@use '#styles/_utils/media' as mq;

.m-search-form-collapsed {
  position: relative;
  display: grid;
  align-items: center;
  gap: var(--size-12);

  // Desktop: summary on left, controls on right
  @media (min-width: 1025px) {
    grid-template-columns: 1fr auto;
  }

  // Tablet: summary full width, controls space-between on next row  
  @media (min-width: 769px) and (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: var(--size-16);
  }

  // Mobile: summary full width, radius full width
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }

  &__summary {
    text-align: left;
    padding-right: var(--size-48);
    font-size: var(--font-xs);
    line-height: var(--lineheight-md);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
  }

  &__controls {
    display: flex;
    align-items: center;
    gap: var(--size-12);

    // Tablet and mobile: space-between controls
    @media (max-width: 1024px) {
      justify-content: space-between;
    }

    // Mobile: prevent overflow
    @media (max-width: 768px) {
      gap: var(--size-8);
      min-width: 0;
      flex-wrap: nowrap;
    }
  }

  &__summary-location {
    display: block;
    line-height: var(--lineheight-sm);
    font-weight: var(--font-medium);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__select {
    flex: 1;
    background-color: var(--background-100);
    border: 1px solid var(--border-color-200);
    padding: var(--size-10) var(--size-12);
    padding-right: var(--size-36);
    line-height: var(--lineheight-sm);
    margin: 0;
    border-radius: var(--border-radius-ui);
    white-space: nowrap;
    font-size: var(--font-xs);
    min-width: 0;

    // Desktop: radius select has no width constraints
    @media (min-width: 1025px) {
      &:first-child {
        flex: none;
        width: auto;
      }
    }

    // Mobile: ensure selects don't overflow
    @media (max-width: 768px) {
      flex: 1 1 0;
      min-width: 80px;
      max-width: calc(50% - var(--size-4));
    }
  }

  &__view-toggle {
    padding: var(--size-10) var(--size-12);
    font-size: var(--font-xs);
    white-space: nowrap;
    min-width: 0;

    &--desktop {
      @media (max-width: 768px) {
        display: none;
      }
    }
  }

  &__close {
    position: absolute;
    top: 0;
    right: 0;
    padding: 0;
    width: var(--size-40);
    height: var(--size-40);
    flex: 0 0 auto;

    svg {
      width: var(--size-20);
      height: var(--size-20);
    }
  }

  @include mq.small-tablet {
    &__summary {
      font-size: var(--font-sm);
    }
  }

  @include mq.notebook {
    display: flex;

    &__summary {
      margin-right: auto;
      padding-right: 0;
    }

    &__select {
      font-size: var(--font-sm);
      flex-shrink: 0;
    }

    &__view-toggle {
      font-size: var(--font-sm);
      flex-shrink: 0;
    }

    &__close {
      position: static;
    }
  }

  @include mq.notebook {

    &__summary {
      font-size: var(--font-md);
    }

    &__summary-location {
      font-size: var(--font-sm);
    }
  }
}
</style>