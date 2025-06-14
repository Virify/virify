<template>
  <button type="button" role="switch" :aria-checked="hasNote" :aria-label="tooltip" class="note-button | relative"
    :class="{ 'has-note': hasNote }" @click="handleClick">
    <div class="note-icon-wrapper">
      <AtomsIcon icon="cards/notes" class="note-button-icon" />
    </div>
    <client-only>
      <svg v-if="hasNote" width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg"
        aria-hidden class="note-button-confetti">
        <circle cx="45" cy="45" r="35" fill-opacity="0.5" class="root" />
        <circle cx="12.5" cy="3.5" r="3.5" class="dot dot-1" />
        <circle cx="14.5" cy="35.5" r="7.5" class="dot dot-2" />
        <circle cx="25.5" cy="74.5" r="3.5" class="dot dot-3" />
        <circle cx="80" cy="78" r="3" class="dot dot-4" />
        <circle cx="76.5" cy="32.5" r="5.5" class="dot dot-5" />
        <circle cx="73" cy="4" r="2" class="dot dot-6" />
        <circle cx="70" cy="69" r="8" class="dot dot-7" />
        <circle cx="59" cy="82" r="4" class="dot dot-8" />
        <circle cx="26" cy="56" r="3" class="dot dot-9" />
        <circle cx="2" cy="81" r="2" class="dot dot-10" />
        <circle cx="31" cy="88" r="2" class="dot dot-11" />
        <circle cx="57.5" cy="11.5" r="4.5" class="dot dot-12" />
        <circle cx="35.5" cy="25.5" r="5.5" class="dot dot-13" />
        <circle cx="43.5" cy="78.5" r="4.5" class="dot dot-14" />
        <circle cx="9.5" cy="55.5" r="3.5" class="dot dot-15" />
        <circle cx="62.5" cy="36.5" r="3.5" class="dot dot-16" />
        <circle cx="80.5" cy="64.5" r="1.5" class="dot dot-17" />
        <circle cx="87.5" cy="41.5" r="1.5" class="dot dot-18" />
      </svg>
    </client-only>
  </button>
</template>

<script setup lang="ts">
import ViewsDialogNotes from '~/components/views/Dialog/ViewsDialogNotes.vue';
import ViewsDialogLogin from '~/components/views/Dialog/ViewsDialogLogin.vue';

const props = defineProps({
  listingId: {
    type: Number,
    required: true
  }
})

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
.note-button {
  position: relative;
}

.note-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Base styling */
.note-button-icon {
  width: var(--size-32);
  height: var(--size-32);
  transition: all var(--animation-medium) var(--ease-out);
  color: inherit;
}

/* Specific styling for when note exists */
.note-button.has-note .note-button-icon {
  color: var(--primary-600) !important;
  filter: drop-shadow(0 0 2px rgba(var(--primary-rgb), 0.3));
}

/* Deeper selector to ensure we target the SVG elements */
.note-button.has-note .note-icon-wrapper :deep(svg),
.note-button.has-note .note-icon-wrapper :deep(path) {
  color: var(--primary-600) !important;
  fill: var(--primary-600) !important;
}

.note-button-confetti {
  position: absolute;
  top: 50%;
  left: 50%;
  pointer-events: none;
  width: 90px;
  height: 90px;
  transform: translate(-50%, -50%);
  max-width: none;
}

/* Inherit the animation from parent */
.note-button:active .note-button-icon {
  transform: scale(0.9);
}
</style>

<style scoped>
circle {
  fill: var(--primary-600);
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
