<template>
  <div class="homepage-section-map">

    <img src="/img/demo/map-shadow.svg" class="homepage-section-map__shadow" width="484" height="262" loading="lazy" />

    <div ref="$map" class="homepage-section-map__map">
      <template v-if="isVisible">
        <div v-for="{ bottom, left, price, variant, image }, index of markers" :key="index"
          class="homepage-section-map__marker" :style="{ bottom, left, animationDelay: index * 70 + 'ms' }">

          <button class="homepage-section-map__marker-button | body-2xs"
            :class="variant && `homepage-section-map__marker-button--${variant}`">
            <img v-if="variant === 'premium' && image" :src="image" alt="Photo of property"
              class="homepage-section-map__marker-button-image" width="491" height="368" loading="lazy" />

            <div class="homepage-section-map__marker-button-flex">
              {{ price }}

              <div role="presentation"
                class="homepage-section-map__marker-button-flex homepage-section-map__marker-button-flex--interactions">
                <AtomsIcon icon="cards/favourite" />
                <AtomsIcon icon="cards/notes" />
              </div>
            </div>
          </button>
        </div>
      </template>

      <img src="/img/demo/map.svg" alt="Floating map tile" class="homepage-section-map__map-tile" width="484"
        height="262" loading="lazy" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core';

const $map = useTemplateRef('$map')

let timeout: NodeJS.Timeout

const isVisible = shallowRef(false)

useIntersectionObserver($map,
  ([entry]) => {
    const { isIntersecting } = asObject(entry)

    // Clear any existing timeouts
    if (timeout) clearTimeout(timeout)

    // If not intersecting, remove active classnames immediately...
    if (!isIntersecting) {
      isVisible.value = false

      return
    }

    // ...else wait for timeout and add active classnames
    timeout = setTimeout(() => {
      isVisible.value = true
    }, 500)
  }, {
  rootMargin: '50px'
}
)

/**
 *  Markers
 */
interface Marker {
  bottom: string
  left: string
  price: string
  variant?: 'premium' | 'featured'
  image?: string
}

const markers: Marker[] = [
  {
    bottom: '30%',
    left: '62%',
    price: '£1.2m',
    variant: 'featured'
  },
  {
    bottom: '44%',
    left: '39%',
    price: '£375k'
  },
  {
    bottom: '80%',
    left: '40%',
    price: '£287k',
    variant: 'featured'
  },
  {
    bottom: '60%',
    left: '70%',
    price: '£455k',
    variant: 'premium',
    image: '/img/demo/demo-1.jpg'
  },
  {
    bottom: '58%',
    left: '20%',
    price: '£195k'
  },
]

</script>

<style lang="scss">
@use '#styles/_utils/media' as mq;

.homepage-section-map {
  width: min(100%, 40ch);
  position: relative;
  margin: 0 auto;
  box-sizing: border-box;
  display: flex;
  align-items: flex-end;
  padding: var(--size-24) 0;
  box-sizing: border-box;

  @include mq.tablet {
    height: min(90vh, 55ch);
    padding: var(--size-72) 0;
  }

  &__map {
    position: relative;
    animation-name: levitateMap;
    z-index: 2;
  }

  &__map-tile {
    display: block;
    width: 100%;
  }

  &__shadow {
    position: absolute;
    bottom: var(--size-20);
    left: 0;
    width: 100%;
    animation-name: fadeMapShadow;
    opacity: 0.66;
    filter: blur(20px);
    transform: scale(0.9);
  }

  &__map,
  &__shadow {
    animation-duration: 3s;
    animation-iteration-count: infinite;
    animation-direction: alternate;
    animation-timing-function: cubic-bezier(0.5, 0, 0.5, 1);
  }

  &__marker {
    position: absolute;
    animation: dropInMarker var(--animation-subtle) cubic-bezier(0.44, 1.42, 0.64, 0.87);
    animation-fill-mode: backwards;
  }

  &__marker-button {
    --marker-bg: var(--blue-400);
    --marker-colour: var(--monochrome-900);

    position: relative;
    border-radius: var(--border-radius-md);
    background: var(--marker-bg);
    color: var(--monochrome-900);
    padding: var(--size-4) var(--size-10);
    line-height: var(--lineheight-md);
    font-weight: var(--font-semisemibold);
    transform: translateX(-50%);

    &::after {
      content: '';
      position: absolute;
      top: calc(100% - var(--size-4));
      left: calc(50% - var(--size-4));
      width: var(--size-8);
      height: var(--size-8);
      background: var(--marker-bg);
      transform: rotate(45deg);
    }

    .a-icon {
      width: var(--size-16);
      height: var(--size-16);
    }

    &--featured {
      --marker-bg: var(--primary-400);

      font-size: var(--font-sm);

      .a-icon {
        width: var(--size-18);
        height: var(--size-18);
      }
    }

    &--premium {
      font-size: var(--font-sm);

      &:has(img) {
        padding: var(--size-6) var(--size-6) var(--size-4);
        border-radius: var(--border-radius-lg);
        width: 14ch;
      }

      .a-icon {
        width: var(--size-18);
        height: var(--size-18);
      }
    }
  }

  &__marker-button-image {
    display: block;
    width: 100%;
    border-radius: var(--border-radius-md);
    margin: 0 0 var(--size-4);
  }

  &__marker-button-flex {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--size-8);

    &--interactions {
      gap: var(--size-4);
    }
  }

  // Pause animation play state on hover, for those with poor
  // motor neuron skills
  &:hover &__map,
  &:hover &__shadow {
    animation-play-state: paused;
  }
}

@keyframes dropInMarker {
  from {
    opacity: 0;
    transform: translateY(-75vh)
  }
}

@keyframes levitateMap {
  from {
    transform: translateY(var(--size-16))
  }
}

@keyframes fadeMapShadow {
  from {
    opacity: 1;
    filter: blur(8px);
    transform: scale(0.95);
  }
}
</style>