<template>
  <div>
    <slot></slot>

    <p v-if="isEnd">
      You've reached the end
    </p>

    <!--
      We can add this as a button so if the watcher doesn't fire for any
      reason (say, if we scroll too fast, given we are debouncing) then
      the user can still call this manually

      @TODO style this
    -->
    <AtomsButton ref="$trigger" :pending="isPending" class="o-pagination-button | button-full button-quiet"
      @click.prevent="fetchNextPage">
      Click to load more
    </AtomsButton>
  </div>
</template>

<script setup lang="ts">
import { useDebounceFn, useIntersectionObserver } from '@vueuse/core';

/**
 *  Props
 */
interface Props {
  isPending?: boolean
  isEnd?: boolean
}

withDefaults(defineProps<Props>(), {
  isPending: false,
  isEnd: false
})

/**
 *  Emits
 */
const emits = defineEmits(['reached-end'])

/**
 *  Page fetcher
 */
const fetchNextPage = useDebounceFn(() => {
  emits('reached-end')
}, 200)

/**
 * Trigger for infinite scroll
 */
const $trigger = useTemplateRef('$trigger')

useIntersectionObserver($trigger, ([entries]) => {
  if (!entries?.isIntersecting) return

  fetchNextPage()
});
</script>

<style>
.o-pagination-button {
  padding: var(--size-16);
  border-radius: var(--border-radius-ui);
}

.o-pagination-button .a-icon {
  width: var(--size-36);
  height: var(--size-36);
}
</style>