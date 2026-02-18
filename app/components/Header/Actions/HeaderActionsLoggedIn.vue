<template>
  <div class="header-actions-logged-in">
    <button class="header-actions-logged-in__toggle | body-md">
      Account
      <span role="img" class="header-actions-logged-in__profile-image"></span>
    </button>
  </div>
</template>

<style lang="scss">
.header-actions-logged-in {

  &__toggle {
    display: flex;
    align-items: center;
    gap: var(--size-14);
    font-weight: var(--font-bold);
    padding: 0;
    margin: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
    transition: color var(--animation-fast);

    &:hover {
      background: transparent;
      color: var(--secondary-400);
    }
  }

  &__profile-image {
    display: block;
    width: var(--size-36);
    height: var(--size-36);
    border-radius: var(--border-radius-pill);
    background: var(--monochrome-500);
    object-fit: contain;
  }
}
</style>