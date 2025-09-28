<template>
  <section class="guide-grid">
    <slot />
  </section>
</template>
<style lang="scss">
@use '#styles/_utils/media' as mq;

.guide-grid {
  display: grid;
  gap: var(--size-24);
  margin-top: var(--size-32);
  width: 100%;
  height: 100%;
  grid-template-columns: 1fr;
  align-items: stretch;

  @include mq.tablet {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--size-20);
  }

  @include mq.desktop {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    justify-items: stretch;
    gap: var(--size-24);
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
