<template>
  <div>
    <slot></slot>

    <AtomsDivider />

    <p v-if="isEnd">
      You've reached the end
    </p>

    <!--
      We can add this as a button so if the watcher doesn't fire for any
      reason (say, if we scroll too fast, given we are debouncing) then
      the user can still call this manually

      @TODO style this
    -->
    <button v-else type="button" ref="$trigger" @click.prevent="fetchNextPage" :disabled="isPending">
      <template v-if="isPending">LOADING...</template>
      <template v-else>Click to load more</template>
    </button>
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