<template>
  <div class="o-listing-mobile-banner" role="presentation" :class="{
    'o-listing-mobile-banner--expanded': isExpanded
  }">
    <div class="o-listing-mobile-banner__container | container" role="presentation">
      <button ref="$handle" v-show="!isExpanded" type="button" class="o-listing-mobile-banner__drag-hangle"></button>

      <Teleport to="body">
        <button v-if="isDragging || isExpanded" :style="dragBackdropStyle"
          class="o-listing-mobile-banner__additional-info-backdrop" @click.prevent="closeExpanded"></button>
      </Teleport>

      <div v-if="isDragging || isExpanded" :style="dragStyle"
        class="o-listing-mobile-banner__additional-info | container" :class="{
          'o-listing-mobile-banner__additional-info--expanded': isExpanded

        }">

        <h2 v-if="price" class="o-listing-mobile-banner__title | title-md lineheight-xs">
          {{ price }}

          <AtomsPill class="o-listing-mobile-banner__title-offertype | body-2xs">
            Offers in excess of
          </AtomsPill>
        </h2>

      </div>
    </div>

    <div class="o-listing-mobile-banner__container | container" role="presentation">
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
</template>

<script setup lang="ts">
/**
 *  Props
 */
interface Props {
  price: string
}

defineProps<Props>()

/**
 *  Drag handle
 */
const $handle = useTemplateRef('$handle')
const isExpanded = shallowRef(false)
const dragBackdropStyle = reactive({
  opacity: 0
})
const dragStyle = reactive({
  height: '0px',
  opacity: 0,
  overflow: 'hidden'
})

const { isDragging, dragDistance } = useVerticalDrag($handle)

watch(dragDistance, (newValue) => {
  const dragPercent = clampNumber(newValue, { min: 0, max: 100 })

  // Set styling
  dragStyle.height = (dragPercent * 0.6) + 'px'
  dragStyle.opacity = dragPercent / 200
  dragBackdropStyle.opacity = dragPercent / 100

  // Open
  if (newValue > 100) openExpanded()
})

function openExpanded() {
  isDragging.value = true
  isExpanded.value = true
  dragStyle.height = 'auto'
  dragStyle.opacity = 1
  dragBackdropStyle.opacity = 1
}

function closeExpanded() {
  isExpanded.value = false
  isDragging.value = false
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

  &__drag-hangle {
    display: flex;
    align-items: center;
    justify-content: center;
    height: var(--size-16);
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
  }

  &__additional-info-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 4;
    touch-action: none;
    background: #{ fn.faded-color(20%, var(--monochrome-100))};
  }

  &__container {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;

    @include mq.not-tablet {
      width: fit-content;
      min-width: 325px;
      text-align: center;
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