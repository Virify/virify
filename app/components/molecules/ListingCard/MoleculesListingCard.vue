<template>
  <div ref="$root" class="m-listing-card" :class="{
    'm-listing-card-backdrop': isHoverImage || isHoverContent,
    'm-listing-card-image-hover': isHoverImage,
    'm-listing-card-content-hover': isHoverContent
  }">
    <div @mouseenter="setHoverImage" role="presentation" class="| relative">
      <MoleculesListingCardImage />

      <Transition name="image">
        <MoleculesListingCardCarousel v-if="isHoverImage" class="m-listing-card-carousel-parent" />
      </Transition>
    </div>

    <MoleculesListingCardButtons class="m-listing-card-buttons-parent" />

    <div @mouseenter="setHoverContent" class="m-listing-card-content">
      Content

      <button @click.prevent="showContentHover">Expand</button>

      <pre>image: {{ isHoverImage }}
content: {{ isHoverContent }}</pre>
    </div>

    <!-- <div class="m-listing-card-expanded">
      Expanded content
    </div> -->
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

const isHover = useElementHover($root, { delayEnter: 500 })

const isHoverImage = computed(() => {
  return isHover.value && hoverRegion.value === 'image'
})

const isHoverContent = computed(() => {
  return isHover.value && hoverRegion.value === 'content'
})

function setHoverImage() {
  hoverRegion.value = 'image'
}

function setHoverContent() {
  hoverRegion.value = 'content'
}

function setHoverNone() {
  hoverRegion.value = 'none'
}

/**
 *  Set hover states for touch
 */
function showContentHover() {
  isHover.value = true
  setHoverContent()
}

function hideContentHover() {
  isHover.value = false
  setHoverNone()
}

onClickOutside($root, hideContentHover)

</script>

<style lang="scss">
@use '#styles/_utils/functions' as fn;

.m-listing-card-image {
  background: var(--monochrome-500);
  aspect-ratio: 4/3;
  border-radius: var(--border-radius-2xl);
}

.m-listing-card-carousel-parent {
  position: absolute;
  top: 50%;
  left: 50%;
  width: calc(100% + (2 * var(--size-28)));
  transform: translate(-50%, -50%);
}

.m-listing-card-buttons-parent {
  margin: 0 auto;
  position: relative;
  z-index: 2;
  transform: translateY(-50%);
  transition: transform var(--animation-veryslow) var(--ease-out);
}

/**
 *  Hover states
 */
.m-listing-card-image-hover .m-listing-card-buttons-parent {
  transform: none;
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

  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: block;
    background: #{ fn.faded-color(70%, var(--background-200)) };
    pointer-events: none;
    z-index: -1;
    transition: opacity var(--animation-veryslow) var(--ease-out);
  }
}

@starting-style {
  .m-listing-card-backdrop::before {
    opacity: 0;
  }
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
</style>