<template>
  <div class="homepage-section-signup">
    <img src="/img/home/sign-up-banner-left.svg"
      class="homepage-section-signup__image homepage-section-signup__image--left"
      aria-label="Peace lily and a moving box" />

    <picture>
      <source srcset="/img/home/window.svg" media="(max-width: 1023px)" />
      <img src="/img/home/window-partial.svg"
        class="homepage-section-signup__image homepage-section-signup__image--window" />
    </picture>

    <img src="/img/home/person-with-ruler.svg"
      class="homepage-section-signup__image homepage-section-signup__image--person"
      aria-label="A lady holding a ruler against a wall and measuring" />

    <div class="| relative" aria-role="presentation">
      <h1 class="homepage-section-signup__title | title-xl">
        <span class="homepage-section-signup__title-caption">Launching Summer 2026</span>

        Join the waiting list for the property platform that works for everyone
      </h1>

      <HomepageSectionSignupForm />
    </div>
  </div>
</template>

<style lang="scss">
@use '#styles/_utils/media' as mq;

.homepage-section-signup {
  position: relative;
  background: #26333C; // @TODO replace with new colours once supported
  color: var(--monochrome-900);
  border-radius: var(--border-radius-2xl);
  padding: var(--size-56) var(--size-32) 250px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  @include mq.tablet {
    border-radius: var(--border-radius-3xl);
    padding: var(--size-48) var(--size-72) 160px;
  }

  @include mq.notebook {
    padding: var(--size-48) var(--size-72) var(--size-72);
    min-height: 32em;
  }

  @include mq.desktop {
    border-radius: var(--border-radius-4xl);
    padding: var(--size-56);
  }

  &__image {
    position: absolute;

    &--left {
      bottom: 0;
      left: -20px;
      width: 180px;

      @include mq.notebook {
        left: -40px;
        width: 275px;
      }

      @include mq.desktop {
        left: -45px;
        width: 340px;
      }
    }

    &--window {
      bottom: 100px;
      right: 0;
      max-height: calc(100% - 140px);
      width: auto;
      max-width: 220px;
      opacity: 0.5;

      @include mq.notebook {
        bottom: auto;
        top: 0;
        width: 270px;
        max-height: none;
        max-width: none;
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
      right: -40px;
      width: 260px;

      @include mq.notebook {
        right: -95px;
        width: 350px;
      }

      @include mq.desktop {
        width: 400px;
        right: -65px;
      }
    }
  }

  &__title {
    margin: 0 auto var(--size-32);
    max-width: 30ch;
    text-align: center;
    line-height: var(--lineheight-xs);
    font-size: var(--font-4xl);
  }

  &__title-caption {
    display: block;
    font-size: 0.6em;
    line-height: var(--lineheight-xs);
    font-weight: var(--font-semibold);
    color: var(--secondary-400);
    margin: 0 auto var(--size-16);
  }
}
</style>