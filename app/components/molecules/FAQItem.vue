<template>
  <GradientBox>
    <details class="faq-item" :open="isOpen">
      <summary class="faq-question | title-sm">
        {{ question }}
      </summary>
      <p class="faq-answer | body-md">
        {{ answer }}
      </p>
    </details>
  </GradientBox>
</template>

<script setup>
import GradientBox from '@/components/atoms/GradientBox.vue'
defineProps({
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  isOpen: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped lang="scss">
.faq-item {
  &[open] {
    .faq-question::after {
      transform: rotate(90deg);
    }
  }
}

.faq-question {
  list-style: none;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--foreground-100);
  margin: 0;
  padding: 0;

  /* Hide the default details marker across all browsers */
  &::-webkit-details-marker {
    display: none;
  }

  &::marker {
    display: none;
  }

  /* Force display type to override normalize.css */
  display: flex !important;

  &::after {
    content: "→";
    font-size: 1.2rem;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    color: var(--foreground-300);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &:hover {
    &::after {
      color: var(--foreground-100);
    }
  }
}

.faq-answer {
  margin: var(--size-16) 0 0;
}
</style>
