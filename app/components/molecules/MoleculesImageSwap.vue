<template>
  <div class="image-swap" @click="toggle" role="button" tabindex="0" @keydown.enter="toggle" @keydown.space="toggle">
    <div class="image-swap__container">
      <!-- Image 1 -->
      <div
        class="image-swap__item"
        :class="{ 'is-active': !isToggled, 'is-inactive': isToggled }"
      >
        <NuxtImg
          :src="frontImage"
          alt="Front Image"
          class="image-swap__img"
          draggable="false"
        />
      </div>

      <!-- Image 2 -->
      <div
        class="image-swap__item"
        :class="{ 'is-active': isToggled, 'is-inactive': !isToggled }"
      >
        <NuxtImg
          :src="backImage"
          alt="Back Image"
          class="image-swap__img"
          draggable="false"
        />
      </div>
      
      <div class="image-swap__hint">
        <UButton
          icon="i-heroicons-arrow-path"
          label="Click to compare"
          color="secondary"
          variant="solid"
          size="sm"
          class="text-white! body-sm"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
  frontImage: {
    type: String,
    required: true,
  },
  backImage: {
    type: String,
    required: true,
  },
  frontLabel: {
    type: String,
    default: '',
  },
  backLabel: {
    type: String,
    default: '',
  },
})

const isToggled = ref(false)

const toggle = () => {
  isToggled.value = !isToggled.value
}
</script>

<style lang="scss" scoped>
@use "#styles/_utils/media" as mq;

.image-swap {
  position: relative;
  width: 100%;
  cursor: pointer;
  perspective: 1000px;
  user-select: none;
  // Reserve space for the peek effect so it doesn't overflow
  padding: var(--size-16) var(--size-8) var(--size-8) var(--size-24);

  @include mq.tablet {
     padding: var(--size-32) var(--size-16) var(--size-16) var(--size-48); 
  }
  
  &__container {
    display: grid;
    grid-template-areas: "stack";
    align-items: center;
    justify-items: center;
    width: 100%;
  }

  &__item {
    grid-area: stack;
    position: relative;
    transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
    transform-origin: center bottom;
    background: transparent;

    // Active state (Front)
    &.is-active {
      z-index: 20;
      transform: translateY(0) scale(1);
      opacity: 1;
      filter: brightness(100%);
      pointer-events: auto;
    }

    // Inactive state (Back)
    &.is-inactive {
      z-index: 10;
      // Move left and up to match the reference image style
      transform: translate(-25%, -10%) scale(0.9);
      
      @include mq.mobile-only {
        // Less offset on mobile to prevent cutting off or layout issues
        transform: translate(-10%, -8%) scale(0.95);
      }

      opacity: 0.9;
      filter: brightness(100%);
      pointer-events: none; 
    }
  }

  &__img {
    display: block;
    height: auto;
    width: 100%;
  }

  &__hint {
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 30;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;

    // Always show on mobile since hover doesn't exist
    @include mq.mobile-only {
      opacity: 1;
    }



    .image-swap:hover & {
      opacity: 1;
    }
  }
}
</style>
