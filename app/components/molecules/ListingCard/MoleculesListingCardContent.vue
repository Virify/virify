<template>
  <div>
    <div>
      Content
    </div>

    <div v-if="showTabs" class="m-listing-card-content-tabs">
      TABS<br />TABS
    </div>

    <button v-else @click.prevent="$emit('force-expanded')">
      Expand
    </button>

    <div>
      Agent
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  showTabs?: boolean
}

withDefaults(defineProps<Props>(), {
  showTabs: false
})
</script>

<style>
.m-listing-card-content-tabs {
  interpolate-size: allow-keywords;

  transition: height, margin;
  transition-duration: var(--animation-veryslow);
  transition-timing-function: var(--ease-out);
  transition-delay: var(--delay, 0ms);
  overflow-y: clip;
  margin: var(--size-16);
  height: calc-height(max-content, size);
}

@starting-style {
  .m-listing-card-content-tabs {
    height: 0;
  }
}
</style>