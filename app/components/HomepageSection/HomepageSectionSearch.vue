<template>
  <div class="homepage-section-search">
    <div class="homepage-section-search__images" aria-hidden="true">
      <img src="/img/home/sign-up-banner-left.svg"
        class="homepage-section-search__image homepage-section-search__image--left"
        aria-label="Peace lily and a moving box" />

      <picture>
        <source srcset="/img/home/window.svg" media="(max-width: 1023px)" />
        <img src="/img/home/window-partial.svg"
          class="homepage-section-search__image homepage-section-search__image--window" />
      </picture>

      <img src="/img/home/person-with-ruler.svg"
        class="homepage-section-search__image homepage-section-search__image--person"
        aria-label="A lady holding a ruler against a wall and measuring" />
    </div>

    <h1 class="homepage-section-search__search-title | title-2xl lineheight-xs">
      Find Your Perfect Home with
      <span class="gradient-text"> Virify AI </span>
    </h1>

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
    position: relative;
    z-index: 1;

    @include mq.tablet {
      margin-bottom: var(--size-48);
    }
  }

  &__images {
    position: absolute;
    inset: 0;
    overflow: hidden;
    border-radius: inherit;
    pointer-events: none;
  }

  &__image {
    position: absolute;

    &--left {
      bottom: 0;
      left: -20px;
      width: 140px;

      @include mq.tablet {
        left: -20px;
        width: 200px;
      }

      @include mq.notebook {
        left: -40px;
        width: 260px;
      }

      @include mq.desktop {
        left: -45px;
        width: 320px;
      }
    }

    &--window {
      bottom: 0;
      right: 0;
      max-height: calc(100% - 120px);
      width: auto;
      max-width: 180px;
      opacity: 0.5;

      @include mq.notebook {
        bottom: auto;
        top: 0;
        width: 240px;
        max-height: none;
        max-width: none;
        opacity: 1;
      }

      @include mq.desktop {
        width: 260px;
      }
    }

    &--person {
      bottom: 0;
      right: -30px;
      width: 200px;

      @include mq.notebook {
        right: -80px;
        width: 300px;
      }

      @include mq.desktop {
        width: 360px;
        right: -60px;
      }
    }
  }
}
</style>