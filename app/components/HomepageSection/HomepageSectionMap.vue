<template>
  <div class="homepage-section-map">

    <img src="/img/demo/map-shadow.svg" class="homepage-section-map__shadow" />

    <div ref="$map" class="homepage-section-map__map">
      <template v-if="isVisible">
        <span v-for="{ bottom, left, price }, index of markers" :key="index" class="homepage-section-map__marker"
          :style="{ bottom, left, animationDelay: index * 70 + 'ms' }">
          {{ price }}
        </span>
      </template>

      <img src="/img/demo/map.svg" alt="Floating map tile" class="homepage-section-map__map-tile" />
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
    }, 1000)
  }
)

/**
 *  Markers
 */
interface Marker {
  bottom: string
  left: string
  price: string
}

const markers: Marker[] = [
  { bottom: '40%', left: '35%', price: '£375,000' },
  { bottom: '80%', left: '40%', price: '£287,000' },
  { bottom: '60%', left: '70%', price: '£455,000' },
  { bottom: '30%', left: '55%', price: '£1,200,000' },
  { bottom: '55%', left: '15%', price: '£195,000' },
]

</script>

<style lang="scss">
.homepage-section-map {
  width: min(100%, 40ch);
  position: relative;
  margin: 0 auto;
  height: min(100vh, 60ch);
  box-sizing: border-box;
  display: flex;
  align-items: flex-end;
  padding: var(--size-72) 0;
  box-sizing: border-box;

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
    opacity: 0.7;
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
    width: 1.5em;
    height: 2em;
    animation: dropInMarker var(--animation-subtle) cubic-bezier(0.44, 1.42, 0.64, 0.87);
    animation-fill-mode: backwards;
    border-radius: var(--border-radius-pill);
    background: var(--secondary-400);
  }
}

@keyframes dropInMarker {
  from {
    opacity: 0;
    transform: translateY(-50vh)
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
    filter: blur(10px);
    transform: scale(0.95);
  }
}
</style>