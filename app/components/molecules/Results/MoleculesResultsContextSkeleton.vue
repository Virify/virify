<template>
  <div class="m-results-context-skeleton" aria-hidden>
    <div class="m-results-context-skeleton__title | v-skeleton" aria-hidden></div>
    <div class="m-results-context-skeleton__pills" aria-hidden>
      <div class="m-results-context-skeleton__pill" v-for="_ of 2">
        <div class="m-results-context-skeleton__pill-img | v-skeleton"></div>
        <div class="m-results-context-skeleton__pill-text | v-skeleton"></div>
        <div class="m-results-context-skeleton__pill-text | v-skeleton"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.m-results-context-skeleton {
  --results-context-gap: var(--size-4);
  --results-context-spacing: var(--size-8);

  margin: 0 0 var(--size-32);

  &__title {
    border-radius: var(--border-radius-lg);
    height: var(--size-36);
    margin: 0 0 var(--size-10);
    width: 24ch;
  }

  &__pills {
    display: flex;
    flex-wrap: wrap;
    gap: var(--results-context-gap);
    column-gap: var(--results-context-spacing);
  }

  &__pill {
    display: flex;
    align-items: center;
    gap: var(--results-context-gap);
    border: 1px solid light-dark(var(--blue-600), var(--blue-400));
    border-radius: var(--border-radius-lg);
    padding: var(--results-context-gap);
    width: min(100%, 30ch);
    box-sizing: border-box;

    &:last-child {
      width: min(100%, 40ch);
    }
  }

  &__pill-img {
    width: var(--size-24);
    height: var(--size-24);
    border-radius: var(--border-radius-md);
    margin: 0 var(--size-4) 0 var(--size-6);
    flex-shrink: 0;
  }

  &__pill-text {
    width: 100%;
    height: var(--size-32);
    border-radius: var(--border-radius-md);
    flex-shrink: 1;
  }
}
</style>