<template>
  <div class="o-traditional-search-form-skeleton">
    <div
      class="o-traditional-search-form-skeleton__toggle-content-loader o-traditional-search-form-skeleton__toggle-content-loader--dark">
      <AtomsIcon title="Pending" icon="animated-dots/animated-dots" />
    </div>

    <div class="o-traditional-search-form-skeleton__toggle-content-loader">
      <AtomsIcon title="Pending" icon="animated-dots/animated-dots" />
    </div>
  </div>
</template>

<style lang="scss">
@use '#styles/_utils/media' as mq;

.o-traditional-search-form-skeleton {

  &__toggle-content-loader {
    --tab-height-offset: 3.6rem;
    min-height: 20rem;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    padding: var(--size-24);

    .a-icon {
      width: var(--size-40);
      height: var(--size-40);
    }

    &--dark {
      border-radius: var(--border-radius-2xl);
      margin: var(--tab-height-offset) var(--size-6) var(--size-6);

      @include mq.small-tablet {
        margin: var(--tab-height-offset) var(--size-16) var(--size-16);
      }

      /**
       *  @TODO This is currently duplicated from the component:
       *        OrganismsTraditionalSearchContract - we should probably
       *        create a global utility class so this can be 'shared'
       */
      background: linear-gradient(to bottom, var(--blue-400), var(--blue-300));
      color: var(--monochrome-900);
    }
  }
}
</style>