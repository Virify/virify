<template>
  <div class="o-traditional-search-toolbar">
    <button type="button" class="o-traditional-search-toolbar__button | button button-secondary">
      Search now
    </button>
  </div>
</template>

<style lang="scss">
.o-traditional-search-toolbar {
  --toolbar-padding: var(--size-16);

  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: var(--toolbar-padding) 0;
  background: var(--background-200);
  border-top: 2px solid var(--monochrome-800);
  margin-bottom: calc(0px - var(--toolbar-padding));

  &__button {
    border-radius: var(--border-radius-xl);
    padding: var(--size-12) var(--size-24);
    font-size: var(--font-sm)
  }
}
</style>