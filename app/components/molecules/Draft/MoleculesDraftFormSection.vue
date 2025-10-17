<template>
  <div class="m-form-section">
    <h3 class="m-form-section__title | title-sm">
      {{ title }}
      <span v-if="required" class="m-form-section__required | title-xs">*</span>
    </h3>
    <div v-if="description || $slots.description" class="m-form-section__description | body-xs">
      <slot name="description">
        <p><em>{{ description }}</em></p>
      </slot>
    </div>
    <div class="m-form-section__content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  description?: string;
  required?: boolean;
}>()
</script>

<style lang="scss">
.m-form-section {
  padding: var(--size-16) 0;
  width: 100%;

  &__title {
    color: var(--secondary-400);
    margin-bottom: var(--size-12);
  }

  &__description {
    color: var(--foreground-200);
    margin-bottom: var(--size-24);
    font-style: italic;
    
    p {
      margin: 0 0 var(--size-8) 0;
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  &__content {
    width: 100%;
  }

  &__required {
    color: var(--error);
    margin-left: var(--size-4);
  }
}
</style>
