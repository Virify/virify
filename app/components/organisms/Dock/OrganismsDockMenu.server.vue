<template>
  <ul class="o-dock-menu--skeleton">
    <li class="o-dock-menu__skeleton-item" v-for="i of 4">
      <span class="o-dock-menu__skeleton-mobile-label | skeleton"></span>

      <div class="o-dock-menu__skeleton-input | skeleton"></div>
    </li>
  </ul>
</template>

<style lang="scss">
@use '#styles/_utils/media' as mq;

.o-dock-menu {

  &--skeleton {
    padding: var(--size-8);
    margin: 0;
    display: flex;
    align-items: center;
    gap: var(--size-8);
    justify-content: stretch;

    @include mq.tablet {
      padding: var(--size-12);
    }
  }

  &__skeleton-item {
    display: flex;
    flex-direction: column;
    text-align: center;
    justify-content: stretch;
    gap: var(--size-4);
    flex: 1 0 auto;
  }

  &__skeleton-mobile-label {
    width: 100%;
    font-size: var(--font-2xs);
    height: var(--lineheight-sm);

    @include mq.tablet {
      display: none;
    }
  }

  &__skeleton-input,
  &__skeleton-mobile-label {
    border-radius: var(--border-radius-2xl);
  }

  &__skeleton-input {
    width: 100%;
    height: var(--size-40);
  }
}
</style>