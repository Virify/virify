<template>
  <div class="o-traditional-search-toolbar | gradient-box">
    <MoleculesJumpLinks :links />

    <button type="button" class="o-traditional-search-toolbar__button | button button-secondary">
      Search now
    </button>
  </div>
</template>

<script setup>
const links = [
  {
    order: 1,
    icon: null,
    title: 'Price',
    id: 'traditional-search-form-price'
  },
  {
    order: 2,
    icon: null,
    title: 'Property Type',
    id: 'tradition-search-form-type'
  },
  {
    order: 3,
    icon: null,
    title: 'Room count',
    id: 'tradition-search-form-rooms'
  },
  {
    order: 4,
    icon: null,
    title: 'Features',
    id: 'tradition-search-form-features'
  },
]

</script>

<style lang="scss">
.o-traditional-search-toolbar {
  --toolbar-padding: var(--size-14);
  --toolbar-offset: calc(0px - var(--toolbar-padding));

  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--toolbar-padding);
  background: var(--background-200);
  margin: var(--toolbar-padding) var(--toolbar-offset) var(--toolbar-offset);
  gap: var(--size-16);
  border-radius: var(--size-20);
  box-sizing: border-box;

  &__button {
    padding: var(--size-12) var(--size-24);
    font-size: var(--font-sm);
    border-radius: var(--size-12);
    white-space: nowrap;
  }

  .m-jump-links__link,
  .m-jump-links__indicator {
    border-radius: var(--size-12);
  }
}
</style>