<template>
  <ul class="search-skeleton">
    <li class="search-skeleton__item" v-for="i of 4">
      <span class="search-skeleton__mobile-label | v-skeleton"></span>

      <div class="search-skeleton__input | v-skeleton"></div>
    </li>
  </ul>
</template>

<style lang="scss">
@use '#styles/_utils/media' as mq;

.search-skeleton {
  padding: var(--size-8);
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--size-8);
  justify-content: stretch;

  @include mq.tablet {
    padding: var(--size-12);
  }

  &__item {
    display: flex;
    flex-direction: column;
    text-align: center;
    justify-content: stretch;
    gap: var(--size-6);
    flex: 1 0 auto;
  }

  &__mobile-label {
    width: 70%;
    height: var(--size-18);
    margin: 0 auto;

    @include mq.tablet {
      display: none;
    }
  }

  &__input,
  &__mobile-label {
    border-radius: var(--border-radius-pill);
  }

  &__input {
    width: 100%;
    height: var(--size-48);

    @include mq.tablet {
      height: var(--size-40);
    }
  }
}
</style>