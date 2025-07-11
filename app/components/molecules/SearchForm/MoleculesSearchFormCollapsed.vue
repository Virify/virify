<template>
  <div class="m-search-form-collapsed | flex">

    <!-- Preview query -->
    <button class="| body-sm button-none font-semibold" @click.prevent="openForm">
      <span v-for="option in query" :key="option.text" :class="`segment--${option.type}`">{{ option.text }}</span>

      <span v-if="queryLocation" class="| faded-text">
        {{ queryLocation }}
        <template v-if="!!queryRadius"> (within {{ queryRadius }} miles)</template>
      </span>
    </button>

    <!-- Update radius -->
    <AtomsSelect id="radius-quick" v-model="searchRadius" :options="radiusOptions" aria-label="Search radius"
      class="radius-select" @click.stop @change="updateSearchRadius" />

    <!-- Sorting -->
    <AtomsSelect id="sort-by" v-model="sortOrder" :options="sortOptions" aria-label="Sort results by"
      class="sort-select" @change="updateSortOrder" />

    <!-- Mobile expand button -->
    <AtomsButton @click.prevent="openForm" type="button" class="| button button-ghost">
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