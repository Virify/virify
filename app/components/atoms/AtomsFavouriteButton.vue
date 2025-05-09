<template>
  <button type="button" role="switch" :aria-checked="isSelected" :aria-label class="a-favourite-button" :class="{
    selected: isSelected
  }" @click.prevent="toggle">
    <AtomsIcon :icon :class="iconClass" />
  </button>
</template>

<script setup lang="ts">
interface Props {
  propertyId: number
  confirmRemoval?: boolean
  iconClass?: string
}

// Confirm remove will make an alert modal appear to confirm before
// removing a listing from favourites (e.g. on the profile page where
// it is hard to then re-add after removing)
withDefaults(defineProps<Props>(), {
  confirmRemoval: false
})

/**
 *  a11y
 */
const isSelected = ref(false)

const ariaLabel = computed(() => {
  if (isSelected.value) return 'Remove from favourites'

  return 'Add to favourites'
})

const icon = computed(() => {
  if (isSelected.value) return 'cards/favourite-filled'

  return 'cards/favourite'
})

/**
 *  Fetch, retrieve favourites
 */
function toggle() {
  isSelected.value = !isSelected.value
}
</script>

<style>
.a-favourite-button {
  color: var(--foreground-200);
}

.a-favourite-button.pending {
  color: var(--monochrome-400);
}

.a-favourite-button.selected {
  color: var(--error-foreground);
  animation: selectedBounce var(--animation-veryslow) linear;
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
</style>