<template>
  <div ref="$root" class="m-listing-card" :class="{
    'm-listing-card-backdrop': isHoverImage || isHoverContent,
    'm-listing-card-image-parent-hover': isHoverImage,
    'm-listing-card-content-parent-hover': isHoverContent
  }">
    <div @mouseenter="setHoverImage" role="presentation" class="| relative">
      <button @click.prevent="forceHoverImage" class="m-listing-card-image-parent-button">
        <MoleculesListingCardImage />
      </button>

      <Transition name="image">
        <MoleculesListingCardCarousel v-if="isHoverImage" class="m-listing-card-carousel-parent" />
      </Transition>
    </div>

    <MoleculesListingCardButtons class="m-listing-card-buttons-parent" />

    <div class="m-listing-card-content-parent-wrapper | relative">
      <MoleculesListingCardContent @mouseenter="setHoverContent" @force-expanded="forceHoverContent"
        class="m-listing-card-content-parent" />

      <Transition name="content">
        <MoleculesListingCardContent v-if="isHoverContent" class="m-listing-card-content-parent-expanded | elevate-300"
          show-tabs />
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { useElementHover, onClickOutside } from '@vueuse/core'

/**
 *  Selectors
 */
const $root = useTemplateRef('$root')

/**
 *  Set hover states
 */
const hoverRegion = ref('')

const isHover = useElementHover($root, { delayEnter: 200 })

const isHoverImage = computed(() => {
  return isHover.value && hoverRegion.value === 'image'
})

const isHoverContent = computed(() => {
  return isHover.value && hoverRegion.value === 'content'
})

/**
 *  Set hover states
 */
function setHoverImage() {
  hoverRegion.value = 'image'
}

function setHoverContent() {
  hoverRegion.value = 'content'
}

function setHoverNone() {
  hoverRegion.value = 'none'
}

function forceHoverImage() {
  isHover.value = true
  setHoverImage()
}

function forceHoverContent() {
  isHover.value = true
  setHoverContent()
}

function forceHoverNone() {
  isHover.value = false
  setHoverNone()
}

/**
 *  Clickout function
 */
onClickOutside($root, forceHoverNone)

</script>

<style lang="scss">
@use '#styles/_utils/functions' as fn;

.m-listing-card {
  --listing-card-expanded-size: calc(100% + (2 * var(--size-40)));
}

.m-listing-card-image-parent {
  background: var(--monochrome-500);
  aspect-ratio: 4/3;
  border-radius: var(--border-radius-2xl);
}

.m-listing-card-image-parent-button {
  display: block;
  appearance: none;
  padding: 0;
  margin: 0;
  border: 0;
  width: 100%;
  border: none;
  border-radius: 0;
  background: none;
}

.m-listing-card-carousel-parent {
  position: absolute;
  top: 50%;
  left: 50%;
  width: var(--listing-card-expanded-size);
  transform: translate(-50%, -50%);
}

.m-listing-card-buttons-parent {
  margin: 0 auto;
  position: relative;
  z-index: 2;
  transform: translateY(-50%);
  transition: transform var(--animation-veryslow) var(--ease-out);
}

.m-listing-card-content-parent,
.m-listing-card-content-parent-expanded {
  text-align: center;
}

.m-listing-card-content-parent {
  padding: 0 var(--size-16);
}

.m-listing-card-content-parent-expanded {
  position: absolute;
  top: 0;
  left: 50%;
  background: var(--background-100);
  width: var(--listing-card-expanded-size);
  transform: translateX(-50%) translateY(calc(0px - var(--size-16)));
  padding: var(--size-16);
  border-radius: var(--border-radius-2xl);
}

/**
 *  Hover states
 */
.m-listing-card-image-parent-hover .m-listing-card-buttons-parent {
  transform: none;
}

.m-listing-card-image-parent-hover .m-listing-card-content-parent-wrapper {
  z-index: -2;
}

@starting-style {
  .m-listing-card-backdrop::before {
    opacity: 0;
  }
}

/**
 *  Backdrop
 */
.m-listing-card-backdrop {
  position: relative;
  z-index: 2;
}

/**
 *  View transitions
 */
.image-enter-active,
.image-leave-active {
  transition: width var(--animation-veryslow) var(--ease-out);
}

.image-leave-to,
.image-enter-from {
  width: 100%;
}

.content-enter-active,
.content-leave-active {
  transition-property: width, box-shadow;
  transition-duration: var(--animation-veryslow);
  transition-timing-function: var(--ease-out);
}

.content-leave-to,
.content-enter-from {
  opacity: 0;
  width: 100%;
}
</style>