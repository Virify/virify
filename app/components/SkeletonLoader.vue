<template>
  <template v-if="!isMounted || isPending">
    <div class="skeleton-loader" v-bind="$attrs" aria-hidden></div>
  </template>

  <client-only>
    <slot v-bind="{ isMounted }"></slot>
  </client-only>
</template>

<script setup lang="ts">
/**
 *  Prevent attributes being added to root
 */
defineOptions({
  inheritAttrs: false
})

/**
 *  Props
 */
interface Props {
  isPending?: boolean
}

withDefaults(defineProps<Props>(), {
  isPending: false
})

/**
 *  Monitor mounting
 */
const isMounted = shallowRef(false)

onMounted(() => {
  isMounted.value = true
})
</script>

<style scoped>
.skeleton-loader {
  background: #ccc;
}
</style>