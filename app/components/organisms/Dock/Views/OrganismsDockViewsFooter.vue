<template>
  <div class="o-dock-views-footer">
    <AtomsButton :popovertarget="popoverId" v-if="currentlyOpen !== 'filters'" class="| button button-sm button-ghost"
      @click.prevent="showFiltersDialog">
      Property
    </AtomsButton>

    <AtomsButton :popovertarget="popoverId" v-if="currentlyOpen !== 'location'" class="| button button-sm button-ghost"
      @click.prevent="showLocationDialog">
      Locations
    </AtomsButton>

    <AtomsButton class="| button button-sm button-secondary" @click.prevent="hidePopover">
      Back to results
    </AtomsButton>
  </div>
</template>

<script setup lang="ts">
import type { PopoverType, PopoverEmits } from '../OrganismsDock.vue'

/**
 *  Props
 */
interface Props {
  popoverId?: string
  currentlyOpen?: PopoverType
}

defineProps<Props>()

/**
 * Emits
 */
const emits = defineEmits<PopoverEmits & { (e: 'close-popover'): void }>()

function showFiltersDialog() {
  emits('open-popover', 'filters')
}

function showLocationDialog() {
  emits('open-popover', 'location')
}

function hidePopover() {
  emits('close-popover')
}
</script>

<style lang="scss">
@use '#styles/_utils/media' as mq;

.o-dock-views-footer {
  display: flex;
  padding: var(--size-16) 0 0;
  align-items: center;
  justify-content: stretch;
  gap: var(--size-8);

  .button {
    flex: 1 1 auto;
  }

  @include mq.tablet {
    display: none;
  }
}
</style>