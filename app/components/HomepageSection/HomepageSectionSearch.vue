<template>
  <div class="homepage-section-search">
    <h1 class="homepage-section-search__search-title | title-2xl lineheight-xs">
      Find Your Perfect Home with
      <span class="gradient-text"> Virify AI </span>
    </h1>

    <OrganismsDockPopover />

    <OrganismsDockBanner listingType="all" class="homepage-section-search__search-dock" />
  </div>
</template>

<style lang="scss">
@use '#styles/_utils/media' as mq;

.homepage-section-search {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  position: relative;
  z-index: 2;
  background: var(--blue-200);
  border-radius: var(--border-radius-2xl);
  padding: var(--size-48) var(--size-32) var(--size-32);

  @include mq.tablet {
    border-radius: var(--border-radius-3xl);
    padding: var(--size-56) var(--size-72) var(--size-72);
    min-height: 24em;
  }

  @include mq.desktop {
    border-radius: var(--border-radius-4xl);
    padding: var(--size-56) var(--size-56) var(--size-96);
    min-height: 30em;
  }

  &__search-dock {
    width: min(100%, 740px);
    margin: 0 auto;
  }

  &__search-title {
    color: var(--monochrome-900);
    max-width: 20ch;
    margin: 0 auto var(--size-24);

    @include mq.tablet {
      margin-bottom: var(--size-48);
    }
  }
}
</style>