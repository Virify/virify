<template>
  <div class="o-traditional-search-toolbar">
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
  --toolbar-padding: var(--size-16);

  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--toolbar-padding) 0;
  background: var(--background-200);
  border-top: 2px solid var(--monochrome-800);
  margin-bottom: calc(0px - var(--toolbar-padding));
  gap: var(--size-16);

  &__button {
    border-radius: var(--border-radius-xl);
    padding: var(--size-12) var(--size-24);
    font-size: var(--font-sm)
  }

  .m-jump-links__link {
    border-radius: var(--border-radius-xl);
  }
}
</style>