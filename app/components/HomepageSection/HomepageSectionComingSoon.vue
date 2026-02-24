<template>
  <div class="homepage-section-coming-soon">
    <HomepageSectionIntro title="A smarter way to buy, sell and rent is coming soon" description="Whether you're looking for your next home, ready to market privately, or an estate agent looking for a more
      cost-effective and easy-to-use platform, join our waiting list for exclusive early access and progress updates.">

      <!-- <div class="homepage-section-coming-soon__computer">
        <video width="700" autoplay muted loop disablepictureinpicture playsinline>
          <source src="/videos/preview.mp4" media="(prefers-color-scheme: light)" />
          <source src="/videos/preview-dark.mp4" media="(prefers-color-scheme: dark)" />
        </video>
        <span class="video">Video here...</span>
      </div> -->

      <!-- Temporary button until we have video -->
      <a href="#homepage-content" class="homepage-section-coming-soon__down">
        <AtomsIcon icon="chevron-down" />
      </a>
      <!-- End temporary button -->
    </HomepageSectionIntro>

  </div>
</template>

<style lang="scss">
@use 'sass:math';
@use '#styles/_utils/media' as mq;

.homepage-section-coming-soon {
  padding: clamp(var(--size-32), 10vh, var(--size-120)) 0;

  @include mq.tablet {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  .homepage-section-intro__title {
    margin: 0 0 var(--size-24);
    width: auto;

    @include mq.tablet {
      text-align: center;
      width: min(100%, 20ch);
      margin: 0 auto var(--size-24);
    }
  }

  .homepage-section-intro__overview {
    width: auto;

    @include mq.tablet {
      width: min(100%, 60ch);
      text-align: center;
      margin: 0 auto;
    }
  }

  &__computer {
    position: relative;
    margin: var(--size-48) auto 0;
    width: min(100%, 480px);

    @include mq.tablet {
      width: min(90%, 720px);
    }

    &::before {
      $gradient-offset: 40px;

      content: '';
      position: absolute;
      top: $gradient-offset;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(to bottom, transparent, var(--background-100) calc(100% - #{ $gradient-offset }))
    }

    &::after {
      content: '';
      position: absolute;
      top: 4px;
      left: calc(50% - 4px);
      width: 8px;
      height: 8px;
      background: var(--blue-500);
      border: 1px solid var(--blue-700);
      box-sizing: border-box;
      border-radius: 100%;

      @include mq.small-tablet {
        top: 8px;
      }
    }

    .video {
      display: block;
      box-shadow: 0 -10px 40px -15px var(--monochrome-600);
      border: 16px solid var(--monochrome-200);
      border-bottom: 0;
      border-top-left-radius: var(--border-radius-3xl);
      border-top-right-radius: var(--border-radius-3xl);
      overflow: hidden;
      width: 100%;
      object-fit: contain;
      margin: 0;
      padding: 0;

      @include mq.small-tablet {
        border: 24px solid var(--monochrome-200);
        border-top-left-radius: var(--border-radius-4xl);
        border-top-right-radius: var(--border-radius-4xl);
        border-bottom: 0;
      }

      // Until actual video exists...
      display: flex;
      align-items: center;
      justify-content: center;
      aspect-ratio: 16/9;
      font-weight: var(--font-bold);
      font-size: 2em;
      background: var(--background-200);
      color: var(--background-300);
    }
  }

  /* Start of temporary button */
  &__down {
    display: block;
    margin: var(--size-32) auto;
    padding: var(--size-10);
    width: fit-content;
    background: var(--background-300);
    border-radius: var(--border-radius-pill);
    color: currentColor;
    border: 0;
    cursor: pointer;
    transition: color var(--animation-fast),
      background-color var(--animation-fast);

    &:hover {
      background: var(--secondary-400);
      color: var(--monochrome-900);
    }

    .a-icon {
      display: block;
      width: var(--size-36);
      height: var(--size-36);
    }
  }

  /* End of temporary button */
}
</style>