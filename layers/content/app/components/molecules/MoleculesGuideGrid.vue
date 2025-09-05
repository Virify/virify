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

  // Mobile: Single column, full width
  grid-template-columns: 1fr;
  justify-items: stretch;

  // Tablet: Two columns with proper spacing
  @include mq.tablet {
    grid-template-columns: repeat(2, 1fr);
    justify-items: stretch;
    gap: var(--size-20);
  }

  // Desktop: Three columns with max width constraint
  @include mq.desktop {
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    justify-items: center;
    gap: var(--size-24);
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
