<template>
  <div class="m-card-slots-accordion" role="presentation">
    <div v-show="isExpanded" :id="expandedId" :aria-expanded="isExpanded">
      <slot></slot>
    </div>

    <button type="button" :aria-controls="expandedId"
      class="m-card-slots-accordion__button | button button-xs button-full" @click.prevent="toggleExpanded">
      {{ isExpanded ? 'Collapse description' : 'Expand description' }}
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  startExpanded?: boolean
}

const props = defineProps<Props>()

/**
 *  a11y ID
 */
const expandedId = useId()

/**
 *  Toggle accordion
 */
const isExpanded = ref(!!props.startExpanded)

function toggleExpanded() {
  isExpanded.value = !isExpanded.value
}

</script>

<style lang="scss">
.m-card-slots-accordion {
  margin: var(--size-12) 0 0;
}
</style>