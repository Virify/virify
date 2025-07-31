<template>
  <div class="a-hero-card">
    <slot />
  </div>
</template>

<style lang="scss">
@use "#styles/_utils/media" as mq;
.a-hero-card {
  border-radius: var(--border-radius-2xl);
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-around;
  padding: var(--size-32);
  background: url("/img/logo-background.svg") no-repeat bottom right,
    var(--blue-400);
  background-size: auto 150%, cover;
  color: var(--monochrome-900);
  gap: var(--size-8);

  @include mq.mobile-only {
    background-position: top right;
    background-size: auto 70%, cover;
  }

  .button {
    margin: var(--size-16) 0;
    color: var(--foreground-100);
  }
}
</style>