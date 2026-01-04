<template>
  <div class="o-base-room-form">
    <slot />
  </div>
</template>

<script setup lang="ts">
// Base component for all room form components (bedroom, bathroom, kitchen, reception, etc.)
// Provides shared styles for the repeating room pattern
</script>

<style lang="scss">
// NOT scoped - these styles are inherited by all room form components
.o-base-room-form {
  // Items container
  &__items {
    display: flex;
    flex-direction: column;
  }

  // Individual room item
  &__item {
    padding: var(--size-16) 0;
    border: 1px solid var(--border-200);
    border-radius: var(--radius-lg);
    background: var(--background-50);

    &--collapsed {
      background: var(--background-25);
      border-color: var(--border-100);

      .collapsible-header {
        margin-bottom: 0;
      }
    }
  }

  // Item header (when not collapsed)
  &__item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: var(--size-16);
    border-bottom: 1px solid var(--border-100);
  }

  // Actions in the header (buttons)
  &__item-actions {
    display: flex;
    gap: var(--size-8);
    align-items: center;
  }

  // Title for each room
  &__item-title {
    color: light-dark(var(--blue-400), var(--blue-600));
  }

  // Content area (form fields)
  &__item-content {
    overflow: hidden;
  }

  // Accordion transition animations
  .accordion-enter-active,
  .accordion-leave-active {
    transition: all 0.3s ease-in-out;
    max-height: 1000px;
    opacity: 1;
  }

  .accordion-enter-from,
  .accordion-leave-to {
    max-height: 0;
    opacity: 0;
  }

  // Form grid layout
  &__form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--size-24);
    margin-bottom: var(--size-24);

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }

    .o-form-group {
      padding: 0;
    }
  }

  // Form action buttons (save/cancel)
  &__form-actions {
    display: flex;
    justify-content: center;
    gap: var(--size-12);
    margin-top: var(--size-24);
    margin-bottom: var(--size-24);
  }

  // Add item button container
  &__add-item {
    display: flex;
    justify-content: center;
    padding-top: var(--size-8);
  }
}
</style>
