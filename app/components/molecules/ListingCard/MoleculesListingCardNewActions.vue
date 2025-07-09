<template>
  <div class="m-listing-card-actions">
    <nuxt-link to="#" class="| button button-ghost body-sm">
      View
    </nuxt-link>
    <button class="| button button-secondary body-sm">
      Enquire
    </button>
  </div>
</template>

<style lang="scss">
.m-listing-card-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--size-8);
  width: 100%;

  .button {
    width: 100%;
    padding: var(--size-8);
    border-radius: var(--border-radius-lg);
    border-color: var(--secondary-400);
  }
}
</style>
