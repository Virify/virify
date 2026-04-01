<template>
  <OrganismsBannerHero class="homepage-section-search">
    <template #title>
      Find Your Perfect Home with
      <span class="gradient-text"> Virify AI </span>
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
    margin: 0 auto;

    @include mq.tablet {
      margin-top: var(--size-24);
    }
  }
}
</style>