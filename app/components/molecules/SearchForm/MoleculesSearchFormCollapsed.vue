<template>
  <div class="m-search-form-collapsed | flex">

    <!-- Preview query -->
    <button class="m-search-form-collapsed__summary | button-none font-semibold" @click.prevent="openForm">
      <span v-for="option in query" :key="option.text" :class="`segment--${option.type}`">{{ option.text }}</span>

      <span v-if="queryLocation" class="m-search-form-collapsed__summary-location | faded-text">
        <template v-if="!!queryRadius">Within {{ queryRadius }} miles of</template>
        {{ queryLocation }}
      </span>
    </button>

    <!-- Update radius -->
    <AtomsSelect id="radius-quick" v-model="searchRadius" :options="radiusOptions" aria-label="Search radius"
      class="m-search-form-collapsed__select" @click.stop @change="updateSearchRadius" />

    <!-- Sorting -->
    <AtomsSelect id="sort-by" v-model="sortOrder" :options="sortOptions" aria-label="Sort results by"
      class="m-search-form-collapsed__select" @change="updateSortOrder" />

    <!-- Mobile expand button -->
    <AtomsButton @click.prevent="openForm" type="button" class="m-search-form-collapsed__close | button button-ghost">
      <AtomsIcon name="arrow-down" icon="expand" />
    </AtomsButton>
  </div>
</template>

<script setup lang="ts">
interface Props {
  query?: { type: string, text: string }[]
  queryLocation?: string
  queryRadius?: number
  sortOptions?: { key: string, value: string }[]
  radiusOptions?: { key: string, value: number }[]
}

defineProps<Props>()

/**
 *  Emits
 */
const emits = defineEmits(['expand-form', 'update-sort-order', 'update-search-radius'])

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

function updateSortOrder() {
  emits('update-sort-order')
}

function updateSearchRadius() {
  emits('update-search-radius')
}
</script>

<style lang="scss">
@use '#styles/_utils/media' as mq;

.m-search-form-collapsed {
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  align-items: center;
  gap: var(--size-12);

  &__summary {
    grid-column: span 2;
    text-align: left;
    padding-right: var(--size-48);
    font-size: var(--font-xs);
    line-height: var(--lineheight-md);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
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
    width: auto;
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