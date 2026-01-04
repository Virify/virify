<template>
  <div class="m-form-header" :class="{ 'm-form-header--section': variant === 'section' }">
    <h3 v-if="variant === 'section'" class="m-form-header__title m-form-header__title--section | title-md">
      {{ title }}
      <span v-if="required" class="m-form-header__required | title-sm">*</span>
      <span v-if="subtext" class="m-form-header__subtext | body-xs font-light">{{ subtext }}</span>
    </h3>
    <p v-else class="m-form-header__title | body-sm">
      {{ title }}
      <span v-if="required" class="m-form-header__required | title-sm">*</span>
      <span v-if="subtext" class="m-form-header__subtext | body-xs font-light">{{ subtext }}</span>
    </p>
    
    <AtomsTooltip v-if="tooltip || hasTooltip" :responsive="true">
      <AtomsIcon icon="content/info" class="m-form-header__icon" />
      <template #tooltip>
        <slot name="tooltip-content">
          <p class="body-sm">{{ tooltip }}</p>
        </slot>
      </template>
    </AtomsTooltip>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  title: string;
  tooltip?: string;
  required?: boolean;
  hasTooltip?: boolean;
  subtext?: string;
  variant?: 'default' | 'section';
}>()
</script>
<style lang="scss">
.m-form-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--size-8);
  padding-bottom: var(--size-16);
  width: 100%;

  &--section {
    justify-content: flex-start;
    padding-bottom: 0;
  }

  &__title {
    text-align: center;
    
    &--section {
      text-align: left;
      color: light-dark(var(--blue-400), var(--blue-600));
      margin-bottom: 0;
    }
  }

  &__icon {
    flex-shrink: 0;
    cursor: pointer;
  }

  &__required {
    color: var(--error);
    margin-left: var(--size-4);
  }

  &__subtext {
    font-style: italic;
    color: var(--monochrome-300);
  }
}
</style>