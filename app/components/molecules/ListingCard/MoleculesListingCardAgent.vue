<template>
  <div class="m-listing-card-agent">
    Agent Details
  </div>
</template>

<style lang="scss">
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