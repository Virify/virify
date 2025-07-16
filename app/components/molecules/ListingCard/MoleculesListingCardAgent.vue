<template>
  <div class="m-listing-card-agent">
    Agent Details for {{ agentId }}
  </div>
</template>

<script setup lang="ts">
interface Props {
  agentId: string
}

defineProps<Props>()
</script>

<style lang="scss" scoped>
@use '#styles/_utils/media' as mq;

.m-listing-card-agent {
  padding: var(--size-12);
  background: var(--blue-400);
  color: var(--monochrome-900);
  border-radius: var(--border-radius-xl);

  @include mq.hover {
    margin-top: var(--size-32);
  }
}
</style>