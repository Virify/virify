<template>
  <section class="o-listing-section" :class="{
    'o-listing-section--accordion': accordionLabel
  }">
    <button v-if="accordionLabel" type="button" class="o-listing-section__button | font-semibold body-lg" :class="{
      'o-listing-section__button--expanded': isExpanded
    }" :aria-controls="accordionId" :aria-expanded="isExpanded" @click.prevent="toggleExpanded">
      {{ accordionLabel }}

      <AtomsIcon icon="chevron-down" />
    </button>

    <Transition v-if="accordionLabel" name="o-listing-section">
      <div :id="accordionId" v-show="isExpanded" class="o-listing-section__expanded-content">
        <slot></slot>
      </div>
    </Transition>

    <slot v-else></slot>
  </section>
</template>

<script setup lang="ts">
interface Props {
  accordionLabel?: string
  startExpanded?: boolean
}

const props = defineProps<Props>()

/**
 *  Accordion
 */
const isExpanded = ref(!!props.startExpanded)

function toggleExpanded() {
  isExpanded.value = !isExpanded.value
}

/**
 *  a11y
 */
const accordionId = useId()
</script>

<style lang="scss">
.o-listing-section {
  padding: calc(var(--container-padding) / 2);
  border: 1px solid var(--border-color-200);
  border-radius: var(--border-radius-3xl);
  overflow: hidden;

  &--accordion {
    padding: 0;
  }

  &__button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    box-sizing: border-box;
    padding: var(--size-12) calc(var(--container-padding) / 2);
    background: var(--background-300);
    color: var(--foreground-100);

    .a-icon {
      display: block;
      height: var(--size-32);
      width: var(--size-32);
      transition: transform var(--animation-veryslow) var(--ease-out);
      transform-origin: 50% 50%;
    }

    &--expanded .a-icon {
      transform: rotate(180deg)
    }
  }

  &__expanded-content {
    padding: calc(var(--container-padding) / 2);
    border-top: 1px solid var(--border-color-200);
  }
}

/**
 *  Transitions
 */
.o-listing-section-enter-active,
.o-listing-section-leave-active {
  interpolate-size: allow-keywords;

  transition-property: height, padding;
  transition-duration: var(--animation-veryslow);
  transition-timing-function: var(--ease-out);
  overflow: hidden;
}

.o-listing-section-leave-to,
.o-listing-section-enter-from {
  height: 0;
  padding-top: 0;
  padding-bottom: 0;
}
</style>