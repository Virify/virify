<template>
  <section class="guide-grid">
    <slot />
  </section>
</template>
<style lang="scss">
.guide-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--size-24);
  margin-top: var(--size-32);
  justify-items: start;
}
</style>
