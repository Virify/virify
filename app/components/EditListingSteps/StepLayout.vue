<template>
  <section class="step">
    <h2 class="step__title | title-lg">{{ title }}</h2>

    <p class="body-xs">
      <span class="step__required | body-md font-semibold">*</span>
      <em>represents a required field</em>
    </p>

    <h3 v-if="info" class="step__info | title-xs">{{ info }}</h3>
    
    <!-- Error message display -->
    <AtomsInlineError v-if="errorMessage" class="step__error">
      {{ errorMessage }}
    </AtomsInlineError>

    <form :key="formKey" class="step__form" @submit.prevent="$emit('submit')">
      <slot />

      <MoleculesListingFormActions
        :hasChanges="hasChanges"
        :buttonDisabled="buttonDisabled"
        :primaryText="buttonText"
        :showPrevious="showPrevious"
        @cancel="$emit('cancel')"
        @previous="$emit('previous')"
        @submit="$emit('submit')"
      >
        <template #additionalActions>
          <slot name="additionalActions" />
        </template>
      </MoleculesListingFormActions>
    </form>
  </section>
  
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  info?: string;
  buttonText?: string;
  hasChanges: boolean;
  buttonDisabled: boolean;
  showPrevious?: boolean;
  formKey?: number;
  errorMessage?: string;
}>()

defineEmits<{
  cancel: [];
  previous: [];
  submit: [];
}>()
</script>

<style lang="scss">
// NOT scoped - these styles are inherited by all step components
.step {
  &__title {
    color: light-dark(var(--blue-500), var(--blue-600));
    margin-bottom: var(--size-4);
  }

  &__info {
    margin: var(--size-16) 0;
  }

  &__required {
    color: var(--error);
  }

  &__form {
    display: flex;
    flex-direction: column;

    &-action {
      align-self: flex-end;
    }
  }

  &__error {
    display: flex;
    gap: var(--size-8);
    width: fit-content;
    justify-self: center;
  }

  // Section divider styling
  &__section {
    border-bottom: 1px solid var(--border-200);

    &:last-child {
      border-bottom: none;
    }
  }

  // Section title styling
  &__section-title {
    display: flex;
    justify-content: flex-start;
    color: var(--secondary-400);
    margin-bottom: 0;

    &--require {
      color: var(--error);
    }
  }

  // Items container (for multiple form items)
  &__items {
    padding-top: var(--size-24);
    display: flex;
    flex-direction: column;
    gap: var(--size-48);
  }

  // Item header (for individual items within a step)
  &__item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--size-24);
    padding-bottom: var(--size-16);
  }

  // Remove button styling
  &__remove-btn {
    color: var(--error);
    background: none;
    border: 1px solid var(--error);
    padding: var(--size-8) var(--size-16);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-fast);

    &:hover {
      background: var(--error);
      color: var(--background-50);
    }
  }

  // Form grid layout
  &__form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--size-24);
    margin-bottom: var(--size-24);
    justify-content: flex-start;
    align-items: flex-start;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }

    .o-form-group {
      padding: 0;
    }
  }

  // Form actions for steps
  &__form-actions {
    display: flex;
    justify-content: space-between;
    margin-top: var(--size-32);
    flex-wrap: wrap;
    gap: var(--size-16);

    &--right {
      display: flex;
      gap: var(--size-16);
      margin-left: auto;
    }
  }

  // Add item button
  &__add-item {
    display: flex;
    justify-content: center;
    margin-top: var(--size-32);
  }
}
</style>
