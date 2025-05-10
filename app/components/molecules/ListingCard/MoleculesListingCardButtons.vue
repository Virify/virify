<template>
  <div class="m-listing-card-buttons">
    <AtomsTooltip>
      <button @click.prevent="toggle" :aria-expanded="isExpanded" :aria-controls="controlsId"
        :aria-label="isExpandedLabel" class="| button-none">
        <AtomsIcon :icon="isExpandedIcon" class="m-listing-card-button-resize" />
      </button>

      <template #tooltip>Expand property card</template>
    </AtomsTooltip>

    <AtomsTooltip>
      <button type="button" class="| button-none" aria-label="Add notes">
        <AtomsIcon icon="cards/notes" class="m-listing-card-button-icon" />
      </button>

      <template #tooltip>Add notes</template>
    </AtomsTooltip>

    <AtomsTooltip>
      <AtomsFavouriteButton class="| button-none" :property-id icon-class="m-listing-card-button-icon" />

      <template #tooltip>Add to favourites</template>
    </AtomsTooltip>
  </div>
</template>

<script setup lang="ts">
import AtomsTooltip from '~/components/atoms/AtomsTooltip.vue';

interface Props {
  propertyId: number,
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

<style lang="scss">
.m-listing-card-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--size-12);
  padding: var(--size-8) var(--size-16);
  border: 1px solid var(--background-300);
  background: var(--background-200);
  width: fit-content;
  border-radius: var(--border-radius-pill);
}

.m-listing-card-button-resize {
  width: var(--size-24);
  height: var(--size-24);
}

.m-listing-card-button-icon {
  width: var(--size-32);
  height: var(--size-32);
}

.m-listing-card-buttons {
  button svg {
    transition: transform var(--animation-medium) var(--ease-out);
  }

  button:active svg {
    transform: scale(0.9);
  }
}
</style>