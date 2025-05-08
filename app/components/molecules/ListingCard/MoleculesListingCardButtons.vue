<template>
  <div class="m-listing-card-buttons">
    <button @click.prevent="toggle" :aria-expanded="isExpanded" :aria-controls="controlsId"
      :aria-label="isExpandedLabel">
      <AtomsIcon :icon="isExpandedIcon" />
    </button>

    <button type="button">
      <AtomsIcon icon="cards/notes" class="m-listing-card-button-icon" />
    </button>

    <button type="button">
      <AtomsIcon icon="cards/favourite" class="m-listing-card-button-icon" />
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  controlsId: string
  isExpanded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isExpanded: false
})

/**
 *  Emits
 */
const emits = defineEmits(['toggle-content'])

function toggle() {
  emits('toggle-content', !props.isExpanded)
}

/**
 *  Button content
 */
const isExpandedIcon = computed(() => {
  const { isExpanded } = props

  return isExpanded ? 'cards/contract' : 'cards/expand'
})

const isExpandedLabel = computed(() => {
  const { isExpanded } = props

  return isExpanded ? 'Show more details' : 'Show fewer details'
})
</script>

<style>
.m-listing-card-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--size-12);
  padding: var(--size-8) var(--size-16);
  border: 1px solid var(--background-300);
  background: var(--background-200);
  width: fit-content;
  border-radius: var(--border-radius-pill)
}

.m-listing-card-button-icon {
  width: var(--size-28);
  height: var(--size-28);
}
</style>