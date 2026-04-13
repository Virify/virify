<template>
  <div class="o-traditional-search-toolbar | gradient-box">

    <LazyMoleculesJumpLinks hydrate-on-visible class="o-traditional-search-toolbar__jumplinks" :links />


    <button type="submit" class="o-traditional-search-toolbar__button | button button-secondary">
      Search

      <AtomsIcon icon="arrow-right" />
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  links: JumpLink[]
}

defineProps<Props>()

</script>

<style lang="scss">
@use "#styles/_utils/media" as mq;

.o-traditional-search-toolbar {
  --toolbar-padding: var(--size-12);
  --toolbar-offset: calc(0px - var(--toolbar-padding));

  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--toolbar-padding);
  background: var(--background-100);
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

    .a-icon {
      display: none;
    }
  }

  &__button,
  .m-jump-links__link,
  .m-jump-links__indicator {
    border-radius: var(--size-12);
    box-sizing: border-box;
  }

  /**
   *  Hide jump links for really tall screens
   */
  @media (min-height: 980px) {
    &__jumplinks {
      display: none;
    }

    &__button {
      display: flex;
      align-items: center;
      gap: var(--size-10);
      margin-left: auto;
      padding: var(--size-12) var(24);

      .a-icon {
        display: block;
        width: var(--size-20);
        height: var(--size-20);
      }
    }
  }
}
</style>