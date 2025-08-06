<template>
  <button type="button" role="switch" :aria-checked="hasNote" :aria-label="tooltip"
    class="a-note-button | relative button-none" :class="{ 'a-note-button--active': hasNote }" @click="handleClick">

    <AtomsIcon icon="cards/notes" :class="iconClass" />
  </button>
</template>

<script setup lang="ts">
import { ViewsDialogNotes, ViewsDialogLogin } from '#components'

interface Props {
  listingId: number
  iconClass?: string
}

const props = defineProps<Props>()

const { hasNote: propertyHasNote } = useNotes()
const { showDialog } = useDialog()
const { loggedIn } = useUserSession()

/**
 * Computed property to check if the note exists for the given property ID
 */
const hasNote = computed(() => {
  return propertyHasNote(props.listingId)
})

/**
 * Lifecycle hook - no need to fetch individual notes anymore
 * All notes are fetched in useNotes composable on mount
 */

/**
 * Tooltip text based on whether a note exists
 */
const tooltip = computed(() => hasNote.value ? 'Edit notes' : 'Add notes')

/**
 * Handle button click to show the notes dialog
 */
function handleClick() {
  if (!loggedIn.value) {
    showDialog({
      component: ViewsDialogLogin
    })
    return
  }

  /**
   * Show the notes dialog
   * The useNotes composable will handle the state and data fetching
   */
  showDialog({
    component: ViewsDialogNotes,
    props: {
      listingId: props.listingId
    }
  })
}
</script>

<style lang="scss">
.a-note-button {
  --notes-active-color: var(--secondary-400);
  --notes-dot-color: var(--secondary-400);

  position: relative;
  color: currentColor;
  flex: 0 0;

  &--active {
    color: var(--notes-active-color);

    &::after {
      content: '';
      position: absolute;
      top: calc(0px - var(--size-2));
      right: calc(0px - var(--size-2));
      width: var(--size-10);
      height: var(--size-10);
      background-color: var(--notes-dot-color);
      border-radius: 50%;
    }
  }
}
</style>

<style scoped>
circle {
  fill: var(--primary-600);
  border: none;
}

circle.root {
  opacity: 0;
  transform-origin: 50% 50%;
  animation: growFade 0.8s var(--ease-out);
}

circle.dot {
  opacity: 0;
  animation: expandDots reverse 0.6s var(--ease-in);
}

circle.dot-1,
circle.dot-3,
circle.dot-5 {
  animation-delay: 0.1s;
}

circle.dot-10,
circle.dot-12,
circle.dot-14,
circle.dot-18 {
  animation-delay: 0.1s;
}

circle.dot-4,
circle.dot-8,
circle.dot-9,
circle.dot-11 {
  animation-delay: 0.2s;
}

@keyframes expandDots {
  0% {
    opacity: 0;
  }

  80% {
    opacity: 0.4;
  }

  100% {
    cx: 45;
    cy: 45;
    opacity: 0.6;
  }
}

@keyframes growFade {
  from {
    opacity: 0.8;
    transform: scale(0.3);
  }

  to {
    opacity: 0;
    transform: scale(1);
  }
}
</style>
