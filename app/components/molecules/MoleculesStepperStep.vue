<template>
  <div class="stepper-step" :class="{ 'stepper-step--active': active }">
    <div class="stepper-step__circle" :class="circleClass">
      {{ stepNumber }}
    </div>
    <div class="stepper-step__content">
      <slot />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  stepNumber: {
    type: [String, Number],
    required: true
  },
  active: {
    type: Boolean,
    default: false
  },
  variant: {
    type: String,
    default: 'blue',
    validator: (value) => ['blue', 'secondary'].includes(value)
  }
})

const circleClass = computed(() => `stepper-step__circle--${props.variant}`)
</script>

<style scoped lang="scss">
.stepper-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 0 1 auto;
  text-align: center;
  position: relative;


  &--active .stepper-step__circle {
    box-shadow: 0 0 0 4px var(--blue-400, #3b82f6);
  }

  &__circle {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    color: #fff;
    font-size: 1.5rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: var(--size-16);
    border: 4px solid #fff;
    box-shadow: 0 2px 8px 0 rgba(0,0,0,0.08);
    transition: box-shadow 0.2s;

    &--blue {
      background: var(--blue-400);
    }

    &--secondary {
      background: var(--secondary-400);
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    flex: 1;
    padding: 0 var(--size-12);
    gap: var(--size-16);

    :deep(h3),
    :deep(p) {
      margin: 0;
    }
  }
}

@media (max-width: 900px) {
  .stepper-step {
    flex-direction: row;
    align-items: flex-start;
    min-width: 0;
    max-width: none;
    margin-bottom: 0;
    position: relative;
    padding: var(--size-8) 0;

    &__circle {
      margin-bottom: 0;
      margin-right: var(--size-20);
      min-width: 48px;
      min-height: 48px;
      flex-shrink: 0;
      z-index: 1;
    }

    &__content {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-width: 0;
      padding-top: 2px;
      align-items: flex-start;
      text-align: left;
    }
  }
}
</style>