<template>
  <div class="o-listing-mobile-banner" role="presentation" :class="{
    'o-listing-mobile-banner--expanded': isExpanded
  }">
    <div class="| container" role="presentation">
      <Transition name="o-listing-mobile-banner">
        <button ref="$handle" v-show="!overviewVisible && !isExpanded" type="button"
          class="o-listing-mobile-banner__drag-handle" aria-label="Show additional information"></button>
      </Transition>

      <Teleport to="body">
        <button v-show="isDragging || isExpanded" ref="$backdrop"
          class="o-listing-mobile-banner__additional-info-backdrop" @click.prevent="closeExpanded"
          aria-label="Close additional information"></button>
      </Teleport>

      <div v-show="isDragging || isExpanded" ref="$additional" class="o-listing-mobile-banner__additional-info" :class="{
        'o-listing-mobile-banner__additional-info--expanded': isExpanded
      }">

        <h2 v-if="price"
          class="o-listing-mobile-banner__title o-listing-mobile-banner__title--mobile-only | title-md lineheight-xs">
          {{ price }}

          <AtomsPill class="o-listing-mobile-banner__title-offertype | body-2xs">
            Offers in excess of
          </AtomsPill>
        </h2>

        <div role="presentation">
          <h3 class="o-listing-mobile-banner__additional-info-subtitle | title-sm">At a glance</h3>

          <OrganismsListingSidebarIcons class="o-listing-mobile-banner__additional-info-icons" />
        </div>

        <OrganismsListingAgent />
      </div>

      <div class="o-listing-mobile-banner__grid" role="presentation">
        <div class="o-listing-mobile-banner__overview" role="presentation">
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

        <OrganismsListingButtons class="o-listing-mobile-banner__buttons" :property-id="4" enquire-url="#" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
 *  Mobile banner additional information dragger
 */

// Elements
const $handle = useTemplateRef('$handle')
const $backdrop = useTemplateRef('$backdrop')
const $additional = useTemplateRef('$additional')

// Drag thresholds
const DRAG_OPEN_THRESHOLD = 80
const DRAG_CLOSE_THRESHOLD = 120

// Drag handle open state
const isExpanded = shallowRef(false)
const additionalInfoHeight = shallowRef(0)

// Drag events
const isDragging = shallowRef(false)
const backdropIsDragging = shallowRef(false)

// Set up dragging
useVerticalDrag($handle, {
  onDragMounted() {
    closeExpanded()
  },
  onDragStart() {
    isDragging.value = true
  },
  onDrag({ relativeY }) {
    const clampedValue = clampNumber(relativeY, { min: 0, max: DRAG_OPEN_THRESHOLD })

    // Set styling
    setStyle($additional, {
      height: clampedValue + 'px',
      opacity: clampedValue / DRAG_OPEN_THRESHOLD,
      overflow: 'hidden'
    })

    setStyle($backdrop, {
      opacity: clampedValue / DRAG_OPEN_THRESHOLD
    })

    // Open
    if (relativeY > DRAG_OPEN_THRESHOLD) openExpanded()
  },
  onDragEnd() {
    console.log('Drag ended!')
  }
})

useVerticalDrag($backdrop, {
  onDragStart() {
    additionalInfoHeight.value = unref($additional)?.clientHeight || 0
  },
  onDrag({ relativeY }) {
    const infoHeight = additionalInfoHeight.value
    const reverseDifference = infoHeight + relativeY
    const reverseThreshold = infoHeight - DRAG_CLOSE_THRESHOLD

    // Get clamp value
    const clampedValue = clampNumber(reverseDifference, { min: 0, max: infoHeight })

    // Close backdrop
    if (clampedValue < reverseThreshold) {
      backdropIsDragging.value = false

      return closeExpanded()
    }

    // Set styling
    setStyle($additional, {
      height: clampedValue + 'px',
      opacity: clampedValue / infoHeight,
      overflow: 'hidden'
    })

    setStyle($additional, {
      opacity: clampedValue / infoHeight,
    })
  },
  onDragEnd({ relativeY }) {
    // Once dragging has stopped, check if backdrop is above threshold
    const infoHeight = additionalInfoHeight.value
    const reverseDifference = infoHeight + relativeY
    const reverseThreshold = infoHeight - DRAG_CLOSE_THRESHOLD

    // Get clamp value
    const clampedValue = clampNumber(reverseDifference, { min: 0, max: infoHeight })

    // Close backdrop
    if (clampedValue < reverseThreshold) {
      backdropIsDragging.value = false

      return closeExpanded()
    }

    openExpanded()
  }
})

// Methods
function openExpanded() {
  isDragging.value = true
  isExpanded.value = true

  setStyle($additional, {
    height: '',
    opacity: 1,
    overflow: ''
  })

  setStyle($backdrop, {
    opacity: 1
  })
}

function closeExpanded() {
  isExpanded.value = false
  isDragging.value = false

  setStyle($additional, {
    height: '0px',
    opacity: 0
  })

  setStyle($backdrop, {
    opacity: 0
  })
}

function setStyle(_el: MaybeRef<HTMLElement | null>, styles: Record<string, string | number>) {
  const el = unref(_el)

  if (!isElement(el)) return

  for (let [attr, value] of Object.entries(styles)) {
    el.style[attr] = value
  }
}

</script>

<style lang="scss">
@use '#styles/_utils/media' as mq;
@use '#styles/_utils/functions' as fn;

.o-listing-mobile-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 5;
  width: 100%;
  background: var(--background-100);
  border-top: 1px solid var(--border-color-200);
  padding: var(--size-12) 0;
  display: flex;
  flex-direction: column;
  gap: var(--size-10);
  transition: border-radius var(--animation-slow) var(--ease-out);

  &--expanded {
    border-top-right-radius: var(--border-radius-3xl);
    border-top-left-radius: var(--border-radius-3xl);
  }

  &__drag-handle {
    --touch-overlap: calc(0px - var(--size-8));

    display: flex;
    align-items: center;
    justify-content: center;
    height: var(--size-32);
    margin-top: var(--touch-overlap);
    margin-bottom: var(--touch-overlap);
    width: 100%;
    flex-grow: 1;
    touch-action: none;
    cursor: grab;

    &:active {
      cursor: grabbing;
    }

    &::before {
      content: '';
      width: min(80%, 8ch);
      height: var(--size-6);
      background: var(--foreground-200);
      border-radius: var(--border-radius-pill);
    }
  }

  &__additional-info {
    box-sizing: border-box;
    transition-property: padding;
    transition-duration: var(--animation-slow);
    transition-timing-function: var(--ease-out);

    @starting-style {
      height: 0;
      padding: 0;
    }

    &--expanded {
      interpolate-size: allow-keywords;

      transition-property: padding, height;
      padding: var(--size-12) 0;
    }

    @include mq.tablet {
      display: flex;
      flex-direction: row-reverse;
      gap: var(--size-24);
      margin: 0;
      width: 100%;
      max-width: none;
    }
  }

  &__additional-info-subtitle {
    @include mq.not-tablet {
      display: none;
    }
  }

  &__additional-info-icons {
    height: fit-content;

    @include mq.not-tablet {
      padding: var(--size-12) var(--size-16);

      .o-listing-sidebar-icons__row {
        justify-content: center;
      }
    }
  }

  &__additional-info-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 4;
    touch-action: none;
    background: light-dark(#{ fn.faded-color(30%, var(--monochrome-100))},
      #{ fn.faded-color(70%, var(--monochrome-100))});
  }

  &__grid {
    margin: var(--size-12) 0 0;

    @include mq.tablet {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: var(--size-24);
    }
  }

  &__overview {
    margin-bottom: var(--size-6);

    @include mq.not-tablet {
      display: none;
    }
  }

  &__title {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--size-10);
    margin: 0;

    @include mq.tablet {
      justify-content: flex-start;

      &--mobile-only {
        display: none;
      }
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
    flex-grow: 1;

    @include mq.tablet {
      flex-grow: 0;
    }

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