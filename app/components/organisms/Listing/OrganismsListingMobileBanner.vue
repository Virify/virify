<template>
  <div class="o-listing-mobile-banner" role="presentation">
    <div class="o-listing-mobile-banner__container | container" role="presentation">
      <Transition name="o-listing-mobile-banner">
        <div class="o-listing-mobile-banner__overview" role="presentation" v-show="isTablet || !overviewVisible">
          <h2 v-if="price" class="o-listing-mobile-banner__title | title-md lineheight-xs">
            {{ price }}

            <AtomsPill class="o-listing-mobile-banner__title-offertype | body-2xs">
              Offers in excess of
            </AtomsPill>
          </h2>

          <p role="presentation" class="o-listing-mobile-banner__address | body-sm">
            123 House, Somewhere Street
          </p>
        </div>
      </Transition>

      <OrganismsListingButtons class="o-listing-mobile-banner__buttons" :property-id="4" enquire-url="#" />
    </div>
  </div>
</template>

<script setup lang="ts">
import breakpoints from '#styles/_utils/breakpoints.module.scss'
import { useMediaQuery } from '@vueuse/core';

/**
 *  Props
 */
interface Props {
  price: string
  overviewVisible?: boolean
}

withDefaults(defineProps<Props>(), {
  overviewVisible: true
})

/**
 *  Check for tablet layouts
 */
const isTablet = useMediaQuery(`(min-width: ${breakpoints.tablet})`)

</script>

<style lang="scss">
@use '#styles/_utils/media' as mq;

.o-listing-mobile-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 5;
  width: 100%;
  background: var(--background-100);
  border-top: 1px solid var(--border-color-200);
  padding: var(--size-12) 0;

  &__container {
    @include mq.not-tablet {
      width: fit-content;
      min-width: 325px;
      text-align: center;
    }

    @include mq.tablet {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: var(--size-32);
    }
  }

  &__overview {
    margin-bottom: var(--size-6);
  }

  &__title {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--size-10);
    margin: 0;

    @include mq.tablet {
      justify-content: flex-start;
    }
  }

  &__address {
    text-align: center;

    @include mq.tablet {
      text-align: left;
    }
  }

  &__buttons {
    margin: 0;

    .button {
      font-size: var(--font-lg);
    }
  }
}

/**
 *  Animations
 */
.o-listing-mobile-banner-enter-active,
.o-listing-mobile-banner-leave-active {
  interpolate-size: allow-keywords;

  transition: height, margin, opacity;
  transition-duration: var(--animation-medium);
  transition-timing-function: var(--ease-out);
  overflow: hidden;
}

.o-listing-mobile-banner-leave-to,
.o-listing-mobile-banner-enter-from {
  height: 0;
  margin: 0;
  opacity: 0;
}
</style>