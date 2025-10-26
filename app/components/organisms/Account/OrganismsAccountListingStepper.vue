<template>
  <section class="o-account-listing-stepper">
    <div class="o-account-listing-stepper__wrapper">
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

          <p class="o-account-listing-stepper__counter | body-xs">
            <em>Step {{ slideIndex + 1 }} of {{ stepperSlides.length }}</em>
          </p>

          <!-- Connecting line after step (except last) -->
          <div 
            v-if="slideIndex < stepperSlides.length - 1"
            class="o-account-listing-stepper__connector o-account-listing-stepper__connector--after"
          ></div>
        </div>
      </template>
    </MoleculesCarousel>

    <!-- Navigation arrows below carousel -->
    <div class="o-account-listing-stepper__nav-buttons">
      <button
        class="o-account-listing-stepper__nav-button o-account-listing-stepper__nav-button--prev"
        :disabled="!canNavigatePrev"
        @click="navigatePrev"
        aria-label="Previous step"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      
      <button
        class="o-account-listing-stepper__nav-button o-account-listing-stepper__nav-button--next"
        :disabled="!canNavigateNext"
        @click="navigateNext"
        aria-label="Next step"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
    </div>
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
        // Only update if different and the step is accessible
        if (selectedIndex !== currentStep.value && isStepAccessible(selectedIndex)) {
          isUpdatingFromCarousel.value = true;
          currentStep.value = selectedIndex;
          nextTick(() => {
            isUpdatingFromCarousel.value = false;
          });
        } else if (!isStepAccessible(selectedIndex)) {
          // If user scrolled to an inaccessible step, scroll back to current step
          isProgrammaticNavigation.value = true;
          nextTick(() => {
            carouselRef.value.scrollTo(currentStep.value);
            isProgrammaticNavigation.value = false;
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
  justify-content: flex-start;
  padding: var(--size-32) var(--size-32);
  overflow: visible;

  @include mq.mobile-only {
    padding: var(--size-8) 0;
  }
  
  &__wrapper {
    width: 100%;
  }
  
  &__carousel {
    background: var(--background-200);
    border-radius: var(--border-radius-lg);
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    overflow: visible;
    
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
    color: light-dark(var(--blue-400), var(--blue-600));
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    white-space: normal;
    text-align: left;
    cursor: pointer;
    padding-top: var(--size-8);
    padding-bottom: var(--size-8);
    padding-left: var(--size-8);
    overflow: visible;

    @include mq.mobile-only {
      max-width: none;
      min-width: auto;
      margin-top: 0;
    }

    &--active {
      color: light-dark(var(--blue-400), var(--blue-600));

      .o-account-listing-stepper__title {
        color: light-dark(var(--blue-400), var(--blue-600));
        font-weight: 600;
      }

      .o-account-listing-stepper__step-indicator {
        box-shadow: 0 0 0 6px rgba(59, 130, 246, 0.6);
        /* Dark mode override */
        @media (prefers-color-scheme: dark) {
          box-shadow: 0 0 0 6px rgba(96, 165, 250, 0.5);
        }
      }

      /* Pulse animation for active step indicator */
      @keyframes stepper-pulse {
        0% {
          box-shadow: 0 0 0 6px rgba(59, 130, 246, 0.6);
        }
        70% {
          box-shadow: 0 0 0 12px rgba(59, 130, 246, 0.2);
        }
        100% {
          box-shadow: 0 0 0 6px rgba(59, 130, 246, 0.6);
        }
      }
      @media (prefers-color-scheme: dark) {
        @keyframes stepper-pulse {
          0% {
            box-shadow: 0 0 0 6px rgba(96, 165, 250, 0.5);
          }
          70% {
            box-shadow: 0 0 0 12px rgba(96, 165, 250, 0.15);
          }
          100% {
            box-shadow: 0 0 0 6px rgba(96, 165, 250, 0.5);
          }
        }
      }
      .o-account-listing-stepper__step--active .o-account-listing-stepper__step-indicator {
        animation: stepper-pulse 1.2s infinite;
      }
    }

    &--complete {
      color: light-dark(var(--blue-400), var(--blue-600));

      .o-account-listing-stepper__title {
        color: light-dark(var(--blue-400), var(--blue-600));
      }
    }

    &--disabled {
      cursor: not-allowed;
      color: light-dark(var(--monochrome-500), var(--monochrome-600));
    }

    &-indicator {
      width: var(--size-24);
      height: var(--size-24);
      border-radius: 50%;
      border: 3px solid light-dark(var(--blue-400), var(--blue-600));
      background: var(--monochrome-900);
      margin: 0 0 8px 0;
      z-index: 3;

      &--complete {
        background: light-dark(var(--blue-400), var(--blue-600));
        border-color: light-dark(var(--blue-400), var(--blue-600));
      }

      &--active {
        background: light-dark(var(--blue-400), var(--blue-600));
        border-color: light-dark(var(--blue-400), var(--blue-600));
      }
    }
  }

  &__title {
    line-height: var(--lineheight-sm);
    align-items: center;
  }

  &__counter {
    color: var(--monochrome-500);
    margin-top: var(--size-4);
  }

  &__connector {
    position: absolute;
    height: 2px;
    background: light-dark(var(--blue-400), var(--blue-600));
    z-index: 2;
    top: calc(var(--size-8) + 12px);
    left: 12px;

    &--before {
      left: calc(-50% + 12px);
      width: 50%;
    }

    &--after {
      left: 12px;
      width: calc(100% - 12px);
    }
  }

  &__nav-buttons {
    display: flex;
    gap: var(--size-8);
  }

  &__nav-button {
    background: light-dark(var(--blue-400), var(--blue-600));
    border: 2px solid light-dark(var(--blue-400), var(--blue-600));
    border-radius: var(--border-radius-md);
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    color: var(--background-100);

    &:hover:not(:disabled) {
      background: var(--blue-500);
      border-color: var(--blue-500);
    }

    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
  }
}
</style>