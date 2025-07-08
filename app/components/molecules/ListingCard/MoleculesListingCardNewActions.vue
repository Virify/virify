<template>
  <div class="m-listing-card-actions">
    <button class="m-listing-card-button | ghost body-sm font-bold">
      View
    </button>
    <button class="m-listing-card-button | body-sm font-bold">
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
}

.m-listing-card-button {
  background-color: var(--secondary-400);
  border: none;
  border-radius: var(--border-radius-lg);
  color: var(--monochrome-100);
  cursor: pointer;
  padding: var(--size-4);
  width: 100%;

  &.ghost {
    background-color: transparent;
    color: var(--foreground-900);
    border: 1px solid var(--secondary-400);
  }
}
</style>
