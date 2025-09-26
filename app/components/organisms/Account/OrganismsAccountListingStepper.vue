<template>
  <section class="o-account-listing-stepper">
    <MoleculesCarousel 
      ref="carouselRef"
      :slides="stepperSlides" 
      :slide-size="carouselSize"
      :options="carouselOptions"
      gap="0"
      :loop="false" 
      :show-arrows="true"
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
  return isMobile.value ? '100px' : '110px';
});

// Carousel options - use center alignment on mobile/tablet
const carouselOptions = computed(() => {
  return {
    align: (isMobile.value || isTablet.value) ? 'center' : 'start',
    containScroll: 'trimSnaps',
    skipSnaps: false,
    dragFree: false
  };
});

const carouselRef = ref();

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
  // Find the highest completed step
  let highestCompletedStep = -1;
  for (let i = 0; i < props.stepperSlides.length; i++) {
    if (props.stepperSlides[i]?.complete === true) {
      highestCompletedStep = i;
    }
  }
  
  // Can access any step up to one past the highest completed step
  return stepIndex <= highestCompletedStep + 1;
};

/**
 * Navigate to a specific step in the stepper.
 * @param stepIndex Index of the step to navigate to
 */
const goToStep = (stepIndex: number) => {
  if (isStepAccessible(stepIndex)) {
    currentStep.value = stepIndex;
  }
};

/**
 * Scroll to center the current step on mobile/tablet viewports
 */
const scrollToCurrentStep = () => {
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
  scrollToCurrentStep();
});

// Watch for carousel scroll events to update current step
onMounted(() => {
  nextTick(() => {
    if (carouselRef.value?.emblaApi) {
      // Set up scroll listener
      carouselRef.value.emblaApi.on('scroll', () => {
        const selectedIndex = carouselRef.value.emblaApi.selectedScrollSnap();
        // Only update if different to avoid infinite loop
        if (selectedIndex !== currentStep.value) {
          currentStep.value = selectedIndex;
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
    padding: var(--size-24) var(--size-32);
    background: var(--blue-400);
    border-radius: var(--border-radius-lg);
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    @include mq.mobile-only {
      padding: var(--size-24) 0 var(--size-40) 0;
    }

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
}
</style>