<template>
  <div class="banner-hero" :class="{ 'banner-hero--compact': compact }">
    <div v-if="$slots.top" class="banner-hero__top">
      <slot name="top" />
    </div>

    <div class="banner-hero__images" aria-hidden="true">
      <img src="/img/home/sign-up-banner-left.svg"
        class="banner-hero__image banner-hero__image--left"
        aria-label="Peace lily and a moving box" />

      <picture>
        <source srcset="/img/home/window.svg" media="(max-width: 1023px)" />
        <img src="/img/home/window-partial.svg"
          class="banner-hero__image banner-hero__image--window" />
      </picture>

      <img src="/img/home/person-with-ruler.svg"
        class="banner-hero__image banner-hero__image--person"
        aria-label="A lady holding a ruler against a wall and measuring" />
    </div>

    <h1 class="banner-hero__title | title-2xl lineheight-xs">
      <slot name="title" />
    </h1>

    <p v-if="description" class="banner-hero__description | body-lg">
      {{ description }}
    </p>

    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  description?: string
  compact?: boolean
}>()
</script>

<style lang="scss" scoped>
@use '#styles/_utils/media' as mq;

.banner-hero {
  position: relative;
  background: var(--blue-200);
  border-radius: var(--border-radius-2xl);
  padding: var(--size-48) var(--size-32) var(--size-32);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;

  @include mq.tablet {
    border-radius: var(--border-radius-3xl);
    padding: var(--size-56) var(--size-72) var(--size-72);
    min-height: var(--banner-hero-min-height-tablet, 24em);
  }

  @include mq.notebook {
    min-height: var(--banner-hero-min-height-notebook, 26em);
  }

  @include mq.desktop {
    border-radius: var(--border-radius-4xl);
    padding: var(--size-56);
    min-height: var(--banner-hero-min-height-desktop, 30em);
  }

  &--compact {
    --banner-hero-min-height-tablet: 16em;
    --banner-hero-min-height-notebook: 18em;
    --banner-hero-min-height-desktop: 20em;
    --banner-hero-plant-width-tablet: 130px;
    --banner-hero-plant-width-notebook: 200px;
    --banner-hero-plant-width-desktop: 240px;
    --banner-hero-person-width-tablet: 160px;
    --banner-hero-person-width-notebook: 260px;
    --banner-hero-person-width-desktop: 300px;
  }

  &__top {
    position: absolute;
    top: var(--size-16);
    left: var(--size-24);
    z-index: 1;
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
      left: -10px;
      width: 110px;

      @include mq.tablet {
        left: -20px;
        width: var(--banner-hero-plant-width-tablet, 180px);
      }

      @include mq.notebook {
        left: -40px;
        width: var(--banner-hero-plant-width-notebook, 275px);
      }

      @include mq.desktop {
        left: -45px;
        width: var(--banner-hero-plant-width-desktop, 340px);
      }
    }

    &--window {
      display: none;

      @include mq.notebook {
        display: block;
        top: 0;
        right: 0;
        width: 270px;
        opacity: 1;
      }

      @include mq.desktop {
        width: 285px;
      }

      @include mq.superultrawide {
        width: 330px;
      }
    }

    &--person {
      bottom: 0;
      right: -20px;
      width: 140px;

      @include mq.tablet {
        right: -40px;
        width: var(--banner-hero-person-width-tablet, 220px);
      }

      @include mq.notebook {
        right: -95px;
        width: var(--banner-hero-person-width-notebook, 350px);
      }

      @include mq.desktop {
        width: var(--banner-hero-person-width-desktop, 400px);
        right: -65px;
      }
    }
  }

  &__title {
    color: var(--monochrome-900);
    max-width: 24ch;
    margin: 0 auto var(--size-24);
    position: relative;
    z-index: 1;
    padding-top: var(--size-32);

    @include mq.tablet {
      padding-top: 0;
    }
  }

  &__description {
    color: var(--monochrome-900);
    font-weight: normal;
    max-width: 40ch;
    margin: 0 auto var(--size-64);
    position: relative;
    z-index: 1;

    @include mq.tablet {
      margin-bottom: 0;
    }
  }

  /* Caption used inside the #title slot (e.g. "Launching Summer 2026") */
  &__caption {
    display: block;
    font-size: 0.6em;
    line-height: var(--lineheight-xs);
    font-weight: var(--font-semibold);
    color: var(--primary-400);
    margin: 0 auto var(--size-16);
  }
}
</style>
