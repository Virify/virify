<template>
  <button
    type="button"
    role="switch"
    :aria-checked="isHidden(listingId)"
    :aria-label="isHidden(listingId) ? 'Listing hidden' : 'Hide listing'"
    class="a-hide-button | button-none"
    :class="{ 'a-hide-button--active': isHidden(listingId) }"
    @click="showHideDialog(listingId)"
  >
    <UIcon name="i-lucide-eye-off" :class="iconClass" />
  </button>
</template>

<script setup lang="ts">
interface Props {
  listingId: number
  iconClass?: string
}

const props = defineProps<Props>()

const { isHidden, showHideDialog } = useHiddenListings()
</script>
