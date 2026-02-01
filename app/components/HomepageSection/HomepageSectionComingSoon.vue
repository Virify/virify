<template>
  <div class="homepage-section-coming-soon">
    <HomepageSectionIntro title="A smarter way to buy, sell and rent is coming soon" description="Whether you're looking for your next home, ready to market privately, or an estate agent looking for a more
      cost-effective and easy-to-use platform, join our waiting list for exclusive early access and progress updates.">

      <div class="homepage-section-coming-soon__computer">
        <!-- <video width="700" autoplay muted loop disablepictureinpicture playsinline>
          <source src="/videos/preview.mp4" media="(prefers-color-scheme: light)" />
          <source src="/videos/preview-dark.mp4" media="(prefers-color-scheme: dark)" />
        </video> -->
        <span class="video">Video here...</span>
      </div>
    </HomepageSectionIntro>

  </div>
</template>

<style lang="scss">
@use 'sass:math';
@use '#styles/_utils/media' as mq;

.homepage-section-coming-soon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: max(var(--size-32), 15vh) 0;

  .homepage-section-intro__title {
    width: min(100%, 20ch);
    text-align: center;
    margin: 0 auto var(--size-24);
  }

  .homepage-section-intro__overview {
    width: min(100%, 60ch);
    text-align: center;
    margin: 0 auto;
  }

  &__computer {
    position: relative;
    margin: var(--size-48) auto 0;
    width: min(100%, 640px);

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
}
</style>