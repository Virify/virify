<template>
  <section class="o-account-listing-stepper">
    <!-- Custom navigation arrows -->
    <button
      v-if="isMobile || isTablet"
      class="o-account-listing-stepper__arrow o-account-listing-stepper__arrow--prev"
      :disabled="!canNavigatePrev"
      @click="navigatePrev"
      aria-label="Previous step"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <MoleculesCarousel 
      ref="carouselRef"
      :slides="stepperSlides" 
      :slide-size="carouselSize"
      :options="carouselOptions"
      gap="0"
      :loop="false" 
      :show-arrows="false"
      button-size="30px"
      class="o-account-listing-stepper__carousel"
    >
      <template #default="{ slide, slideIndex }">
        <div 
          class="o-account-listing-stepper__step" 
          :class="{
            'o-account-listing-stepper__step--complete': slide.complete || slideIndex < currentStep,
            'o-account-listing-stepper__step--active': slideIndex === currentStep,
            'o-account-listing-stepper__step--disabled': !isStepAccessible(slideIndex)
          }" 
          @click="goToStep(slideIndex)"
        >
          <!-- Connecting line before step (except first) -->
          <div 
            v-if="slideIndex > 0"
            class="o-account-listing-stepper__connector o-account-listing-stepper__connector--before"
          ></div>

          <div 
            class="o-account-listing-stepper__step-indicator" 
            :class="{
              'o-account-listing-stepper__step-indicator--complete': slide.complete || slideIndex < currentStep,
              'o-account-listing-stepper__step-indicator--active': slideIndex === currentStep
            }"
          ></div>

          <h2 class="o-account-listing-stepper__title | r-body-sm-xs">
            {{ slide.title }}
          </h2>

          <!-- Connecting line after step (except last) -->
          <div 
            v-if="slideIndex < stepperSlides.length - 1"
            class="o-account-listing-stepper__connector o-account-listing-stepper__connector--after"
          ></div>
        </div>
      </template>
    </MoleculesCarousel>

    <!-- Next arrow -->
    <button
      v-if="isMobile || isTablet"
      class="o-account-listing-stepper__arrow o-account-listing-stepper__arrow--next"
      :disabled="!canNavigateNext"
      @click="navigateNext"
      aria-label="Next step"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  </section>
</template>

<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core';

interface Props {
  modelValue?: number;
  stepperSlides: { title: string; complete?: boolean; }[];
}

interface Emits {
  (e: 'update:modelValue', value: number): void;
  (e: 'step-change', value: number): void;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0
});

const emit = defineEmits<Emits>();

// Media query reactive reference
const isMobile = useMediaQuery('(max-width: 640px)');
const isTablet = useMediaQuery('(max-width: 1024px)');

const carouselSize = computed(() => {
  return isMobile.value ? '100px' : '120px';
});

// Carousel options - use start alignment to prevent overflow
const carouselOptions = computed(() => {
  return {
    align: 'start',
    containScroll: 'trimSnaps',
    skipSnaps: false,
    dragFree: false
  };
});

const carouselRef = ref();
const isProgrammaticNavigation = ref(false);
const isUpdatingFromCarousel = ref(false);

// Current step - synced with parent via v-model
const currentStep = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value);
    emit('step-change', value);
  }
});

/**
 * @param stepIndex Index of the step to check
 * @returns True if the step is accessible (clickable), false otherwise
 */
const isStepAccessible = (stepIndex: number): boolean => {
  // Step 0 (first step) is always accessible
  if (stepIndex === 0) return true;
  
  // For any other step, the previous step must be completed
  const previousStepIndex = stepIndex - 1;
  return props.stepperSlides[previousStepIndex]?.complete === true;
};

/**
 * Navigate to a specific step in the stepper.
 * @param stepIndex Index of the step to navigate to
 */
const goToStep = (stepIndex: number) => {
  if (isStepAccessible(stepIndex)) {
    isProgrammaticNavigation.value = true;
    currentStep.value = stepIndex;
    if (import.meta.client) {
      requestAnimationFrame(() => {
        isProgrammaticNavigation.value = false;
      });
    } else {
      isProgrammaticNavigation.value = false;
    }
  }
};

/**
 * Check if we can navigate to the previous step
 */
const canNavigatePrev = computed(() => {
  return currentStep.value > 0;
});

/**
 * Check if we can navigate to the next step
 */
const canNavigateNext = computed(() => {
  const nextStepIndex = currentStep.value + 1;
  return nextStepIndex < props.stepperSlides.length && isStepAccessible(nextStepIndex);
});

/**
 * Navigate to the previous step
 */
const navigatePrev = () => {
  if (canNavigatePrev.value) {
    goToStep(currentStep.value - 1);
  }
};

/**
 * Navigate to the next step (only if accessible)
 */
const navigateNext = () => {
  if (canNavigateNext.value) {
    goToStep(currentStep.value + 1);
  }
};

/**
 * Scroll to center the current step on mobile/tablet viewports
 */
const scrollToCurrentStep = () => {
  if (isUpdatingFromCarousel.value) return;
  if ((isMobile.value || isTablet.value) && carouselRef.value?.scrollTo && carouselRef.value?.emblaApi) {
    // Only scroll if the current selected index differs from currentStep
    const selectedIndex = carouselRef.value.emblaApi.selectedScrollSnap();
    if (selectedIndex !== currentStep.value) {
      nextTick(() => {
        carouselRef.value.scrollTo(currentStep.value);
      });
    }
  }
};

// Watch for currentStep changes and auto-center on mobile/tablet
watch(currentStep, () => {
  scrollToCurrentStep();
}, { immediate: false });

// Watch for viewport changes to re-center if needed
watch([isMobile, isTablet], () => {
  // Set flag to prevent carousel scroll events from changing the step
  isProgrammaticNavigation.value = true;
  scrollToCurrentStep();
  nextTick(() => {
    isProgrammaticNavigation.value = false;
  });
});

// Watch for carousel scroll events to update current step
onMounted(() => {
  nextTick(() => {
    if (carouselRef.value?.emblaApi) {
      // Set up scroll listener
      carouselRef.value.emblaApi.on('select', () => {
        if (isProgrammaticNavigation.value) return;
        const selectedIndex = carouselRef.value.emblaApi.selectedScrollSnap();
        // Only update if different to avoid infinite loop
        if (selectedIndex !== currentStep.value) {
          isUpdatingFromCarousel.value = true;
          currentStep.value = selectedIndex;
          nextTick(() => {
            isUpdatingFromCarousel.value = false;
          });
        }
      });
      
      // Initial centering on mount
      scrollToCurrentStep();
    }
  });
});

defineExpose({
  goToStep,
  currentStep: readonly(currentStep),
  stepperSlides: readonly(props.stepperSlides)
});
</script>

<style lang="scss" scoped>
@use '#styles/_utils/media' as mq;

.o-account-listing-stepper {
  width: 100%;
  display: flex;
  justify-content: center;
  &__carousel {
    padding: var(--size-16);
    background: var(--blue-400);
    border-radius: var(--border-radius-lg);
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    :deep(.embla-prev),
    :deep(.embla-next) {
      top: 85%;
    }

    @include mq.tablet {
      :deep(.embla-prev),
      :deep(.embla-next) {
        top: 50%;
      }
    }
  }

  &__step {
    position: relative;
    color: var(--monochrome-900);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    white-space: wrap;
    text-align: center;
    cursor: pointer;

    @include mq.mobile-only {
      max-width: none;
      min-width: auto;
      margin-top: 0;
    }

    &--active {
      color: var(--primary-400);

      .o-account-listing-stepper__title {
        color: var(--primary-400);
      }
    }

    &--complete {
      color: var(--monochrome-900);
    }

    &--disabled {
      cursor: not-allowed;
      color: var(--monochrome-500);
    }

    &-indicator {
      width: var(--size-24);
      height: var(--size-24);
      border-radius: 50%;
      border: 3px solid var(--secondary-400);
      background: var(--monochrome-900);
      margin: 0 auto 8px auto;
      z-index: 3;

      &--complete {
        background: var(--secondary-400);
        border-color: var(--secondary-400);
      }

      &--active {
        background: var(--primary-400);
        border-color: var(--primary-400);
      }
    }
  }

  &__title {
    line-height: var(--lineheight-sm);
    align-items: center;
  }

  &__connector {
    position: absolute;
    height: 2px;
    background: var(--secondary-400);
    z-index: 2;
    top: 12px;

    &--before {
      left: -50%;
      width: 50%;
    }

    &--after {
      right: -50%;
      width: 50%;
    }
  }

  &__arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    background: var(--background-100);
    border: 2px solid var(--monochrome-300);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    color: var(--monochrome-700);

    &:hover:not(:disabled) {
      background: var(--primary-400);
      border-color: var(--primary-400);
      color: var(--background-100);
    }

    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    &--prev {
      left: var(--size-8);

      @include mq.tablet {
        left: var(--size-16);
      }
    }

    &--next {
      right: var(--size-8);

      @include mq.tablet {
        right: var(--size-16);
      }
    }
  }
}
</style>