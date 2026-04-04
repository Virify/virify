<template>
  <OrganismsBannerHero class="homepage-section-search">
    <template #title>
      Find Your Perfect Home with Virify AI
    </template>

    <OrganismsDockBanner listingType="all" class="homepage-section-search__dock" />
  </OrganismsBannerHero>
</template>

<style lang="scss">
@use '#styles/_utils/media' as mq;

.homepage-section-search {
  z-index: 2;

  &__dock {
    width: min(100%, 740px);
    margin: 0 auto var(--size-48);
  }

  &__search-title {
    color: var(--monochrome-900);
    max-width: 20ch;
    margin: 0 auto var(--size-24);

    @include mq.tablet {
      margin-top: var(--size-24);
    }
  }

  .o-dock-banner__toggle {
    background: var(--blue-300);
    color: var(--monochrome-900);
    border: 1px solid var(--blue-500);
    animation: fadeUp var(--animation-fast) var(--ease-in-out);
    animation-delay: var(--animation-slow);
    animation-fill-mode: both;

    &:hover {
      background: var(--blue-400);
      color: var(--monochrome-900);
    }
  }
}
</style>