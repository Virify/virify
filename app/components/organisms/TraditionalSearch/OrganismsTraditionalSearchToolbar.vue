<template>
  <div class="o-traditional-search-toolbar | gradient-box">
    <MoleculesJumpLinks :links />

    <button type="button" class="o-traditional-search-toolbar__button | button button-secondary">
      Search
    </button>
  </div>
</template>

<script setup>
const links = [
  {
    order: 1,
    icon: 'jumplinks/price',
    title: 'Price',
    id: 'traditional-search-form-price'
  },
  {
    order: 2,
    icon: 'jumplinks/property-type',
    title: 'Property',
    id: 'tradition-search-form-type'
  },
  {
    order: 3,
    icon: 'jumplinks/room-count',
    title: 'Rooms',
    id: 'tradition-search-form-rooms'
  },
  {
    order: 4,
    icon: 'jumplinks/additional-features',
    title: 'Features',
    id: 'tradition-search-form-features'
  },
]

</script>

<style lang="scss">
@use "#styles/_utils/media" as mq;

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

  @include mq.mobile-only {
    gap: var(--size-8);
  }

  &__button {
    padding: var(--size-12) var(--size-24);
    font-size: var(--font-sm);
    white-space: nowrap;
    align-self: stretch;

    @include mq.mobile-only {
      padding: var(--size-12) var(--size-18);
    }
  }

  &__button,
  .m-jump-links__link,
  .m-jump-links__indicator {
    border-radius: var(--size-12);
    box-sizing: border-box;
  }
}
</style>