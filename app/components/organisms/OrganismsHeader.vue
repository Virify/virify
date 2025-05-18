<template>
  <div class="o-header | pointer-none">
    <div class="o-header-container | container">
      <nuxt-link to="/" alt="Back to homepage" class="o-header-homelink | pointer">
        <AtomsIcon title="Virify Ltd" icon="logo/horizontal-colour" width="222" height="67" class="o-header-logo" />
      </nuxt-link>

      <OrganismsSiteNavigation class="| pointer" />
    </div>
  </div>
</template>

<style lang="scss">
@use "#styles/_utils/media" as mq;

.o-header {
  position: sticky;
  top: 0;
  z-index: 4;

  @include mq.mobile-only {
    background: var(--background-100);
  }

  &-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: var(--header-height);
  }

  &-homelink {
    display: block;
    width: min(60%, 120px);
  }

  &-logo {
    display: block;
    width: 100%;
    height: auto;
  }
}

/**
 *  @TODO: refactor
 */
body:has(.o-searchform-fixed) .o-header-container {
  margin-bottom: calc(var(--header-offset) + var(--size-24));
}
</style>