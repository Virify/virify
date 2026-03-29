<template>
  <button type="button" role="switch" :aria-checked="isCurrentFavourite" :aria-label
    class="a-favourite-button | relative button-none" :class="{
      selected: isCurrentFavourite,
    }" @click.prevent="toggle">
    <AtomsIcon :icon="isCurrentFavourite ? 'cards/favourite-filled' : 'cards/favourite'" :class="iconClass" />

    <client-only>
      <svg v-if="isCurrentFavourite && isSelected && isInteracted" width="90" height="90" viewBox="0 0 90 90"
        fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden class="a-favourite-button-confetti">
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
import { watchOnce } from '@vueuse/core';
import { ViewsDialogConfirmRemoveFavourite } from '#components';

const { isFavourite, addToFavourite, removeFromFavourite } = useFavourites();
const { showDialog } = useDialog();

interface Props {
  listingId: number
  confirmRemoval?: boolean
  iconClass?: string
}

// Confirm remove will make an alert modal appear to confirm before
// removing a listing from favourites (e.g. on the profile page where
// it is hard to then re-add after removing)
const props = withDefaults(defineProps<Props>(), {
  listingId: 0,
  confirmRemoval: true
})

/**
 *  Do not show animation on first use
 */
const isSelected = ref(false)
const isInteracted = ref(false)

const isCurrentFavourite = computed(() => {
  return isFavourite(props.listingId)
});

watchOnce(isSelected, () => {
  isInteracted.value = true
})

/**
 *  a11y
 */
const ariaLabel = computed(() => {
  return isCurrentFavourite.value ? 'Remove from favourites' : 'Add to favourites'
});

/**
 *  Show confirmation dialog for removal
 */
function showConfirmRemoval() {
  showDialog({
    component: ViewsDialogConfirmRemoveFavourite,
    props: { listingId: props.listingId }
  });
}

/**
 *  Fetch, retrieve favourites
 */
function toggle() {
  isSelected.value = !isSelected.value
  if (isCurrentFavourite.value) {
    // If confirmRemoval is enabled, show dialog instead of removing directly
    if (props.confirmRemoval) {
      isSelected.value = true // Reset selection state
      showConfirmRemoval()
    } else {
      // just a tad delayed to allow the animation to finish when removing from a list of favourites
      setTimeout(() => {
        isSelected.value = false
        removeFromFavourite(props.listingId)
      }, 100)
    }
  } else {
    addToFavourite(props.listingId)
  }
}
</script>

<style lang="scss">
.a-favourite-button {
  color: currentColor;
  flex: 0 0;

  &.pending {
    color: var(--blue-500);
  }

  &.selected {
    color: var(--favourite-colour);
    animation: selectedBounce var(--animation-subtle) linear;
  }
}

@keyframes selectedBounce {
  0% {
    transform: scale(0.85)
  }

  30% {
    transform: scale(1.15)
  }

  50% {
    transform: scale(0.9)
  }

  70% {
    transform: scale(1.05)
  }

  90% {
    transform: scale(0.95)
  }

  100% {
    transform: scale(1)
  }
}

.a-favourite-button-confetti {
  position: absolute;
  top: 50%;
  left: 50%;
  pointer-events: none;
  width: 90px;
  height: 90px;
  transform: translate(-50%, -50%);
  max-width: none;
}
</style>

<style scoped>
circle {
  fill: var(--favourite-colour);
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