<template>
  <div class="m-search-form-collapsed | flex">

    <!-- Preview query -->
    <button class="| body-sm button-none font-semibold" @click.prevent="openForm">
      <template v-for="option in query" :key="option.text">
        <span :class="`segment--${option.type}`">{{ option.text }}</span>
      </template>
      <div v-if="queryLocation" class="| faded-text">
        {{ queryLocation }}
        <template v-if="!!queryRadius"> (within {{ queryRadius }} miles)</template>
      </div>
    </button>

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
}

defineProps<Props>()

/**
 *  Emits
 */
const emits = defineEmits(['expand-form', 'update-sort-order'])

/**
 *  Toggle form open/closed
 */

function openForm() {
  emits('expand-form')
}

/**
 *  Search radius
 */
const sortOrder = defineModel('sortOrder')

function updateSortOrder() {
  emits('update-sort-order')
}
</script>