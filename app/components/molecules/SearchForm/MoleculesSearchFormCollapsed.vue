<template>
  <div class="m-search-form-collapsed">
    <!-- Mobile expand button -->
    <AtomsButton @click.prevent="openForm" type="button" class="| button button-ghost">
      <AtomsIcon name="arrow-down" icon="expand" />
    </AtomsButton>

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
    <AtomsSelect id="sort-by" v-model="sortBy" :options="sortOptions" aria-label="Sort results by" class="sort-select"
      @click.stop />
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
 *  Toggle form open/closed
 */
const emits = defineEmits(['expand-form'])

function openForm() {
  emits('expand-form')
}

/**
 *  Search radius
 */
const sortBy = defineModel()
</script>