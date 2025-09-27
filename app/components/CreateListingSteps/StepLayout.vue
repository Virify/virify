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

      <MoleculesDraftFormActions
        :hasChanges="hasChanges"
        :buttonDisabled="buttonDisabled"
        :primaryText="buttonText"
        :showPrevious="showPrevious"
        @cancel="$emit('cancel')"
        @previous="$emit('previous')"
        @submit="$emit('submit')"
      />
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

<style lang="scss" scoped>
.step {
  &__error {
    display: flex;
    gap: var(--size-8);
    width: fit-content;
    justify-self: center;
  }
}
</style>
