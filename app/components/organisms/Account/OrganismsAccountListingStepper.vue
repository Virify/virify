<template>
  <section class="o-account-listing-stepper">
    <MoleculesCarousel 
      ref="carouselRef"
      :slides="stepperSlides" 
      :slide-size="carouselSize"
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
            'o-account-listing-stepper__step--complete': slideIndex < currentStep,
            'o-account-listing-stepper__step--active': slideIndex === currentStep
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
              'o-account-listing-stepper__step-indicator--complete': slideIndex < currentStep,
              'o-account-listing-stepper__step-indicator--active': slideIndex === currentStep
            }"
          ></div>
          
          <h2 class="r-body-sm-xs">
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
  stepperSlides: { title: string }[];
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

const carouselSize = computed(() => {
  return isMobile.value ? '100px' : '120px';
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

// Functions to handle step navigation
const goToStep = (stepIndex: number) => {
  currentStep.value = stepIndex;
};

// Watch for carousel scroll events to update current step
onMounted(() => {
  nextTick(() => {
    if (carouselRef.value?.emblaApi) {
      carouselRef.value.emblaApi.on('scroll', () => {
        const selectedIndex = carouselRef.value.emblaApi.selectedScrollSnap();
        currentStep.value = selectedIndex;
      });
    }
  });
});

// Expose step navigation methods for parent components
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
  max-width: 100%;

  &__carousel {
    padding: var(--size-20) var(--size-32);
    background: var(--blue-400);
    border-radius: var(--border-radius-lg);
    position: relative;
    width: 100%;

    :deep(.embla-prev),
    :deep(.embla-next) {
      top: 32%;
    }
  }

  &__step {
    position: relative;
    color: var(--monochrome-900);
    min-width: 100px;
    max-width: 100px;
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
    }

    &--active {
      color: var(--primary-400);
    }

    &--complete {
      color: var(--monochrome-900);
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